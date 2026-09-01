import uuid
from datetime import datetime
import mongodb
from typing import Dict, Any, Optional

# Basic hardcoded pricing for now, can be moved to DB
DEFAULT_PRICING = {
    "outbound": {"provider_cost": 8.0, "customer_price": 12.0},
    "inbound": {"provider_cost": 7.0, "customer_price": 11.0},
    "default": {"provider_cost": 8.0, "customer_price": 12.0}
}

class BillingService:
    async def get_or_create_wallet(self, db, company_id: str):
        wallet = await db.wallets.find_one({"company_id": company_id})
        if not wallet:
            wallet = {
                "id": str(uuid.uuid4()),
                "company_id": company_id,
                "balance": 0.0,
                "currency": "INR",
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.wallets.insert_one(wallet)
        return wallet

    async def add_credits(self, db, company_id: str, amount: float, payment_provider: str, provider_transaction_id: str, description: str):
        # Idempotency check
        existing_tx = await db.transactions.find_one({
            "provider_transaction_id": provider_transaction_id,
            "type": "CREDIT",
            "status": "COMPLETED"
        })
        if existing_tx:
            return existing_tx
            
        wallet = await self.get_or_create_wallet(db, company_id)
        
        tx = {
            "id": str(uuid.uuid4()),
            "company_id": company_id,
            "wallet_id": wallet["id"],
            "type": "CREDIT",
            "amount": amount,
            "currency": wallet["currency"],
            "payment_provider": payment_provider,
            "provider_transaction_id": provider_transaction_id,
            "status": "COMPLETED",
            "description": description,
            "created_at": datetime.utcnow()
        }
        
        await db.transactions.insert_one(tx)
        
        new_balance = wallet["balance"] + amount
        await db.wallets.update_one(
            {"id": wallet["id"]},
            {"$set": {"balance": new_balance, "updated_at": datetime.utcnow()}}
        )
        return tx

    async def process_call_billing(self, db, call_id: str, company_id: str, direction: str, duration_seconds: int, provider: str = "bolna"):
        if duration_seconds <= 0:
            return None # No duration, no cost
            
        # Check idempotency
        existing_usage = await db.usage_records.find_one({"call_id": call_id})
        if existing_usage:
            return existing_usage # Already billed
            
        duration_minutes = max(1, (duration_seconds + 59) // 60) # round up to next minute
        
        pricing = DEFAULT_PRICING.get(direction, DEFAULT_PRICING["default"])
        provider_cost = pricing["provider_cost"] * duration_minutes
        customer_cost = pricing["customer_price"] * duration_minutes
        
        # Check active subscription first
        subscription = await db.company_subscriptions.find_one({
            "company_id": company_id, 
            "status": "active"
        })
        
        wallet = await self.get_or_create_wallet(db, company_id)
        
        # We will deduct from wallet directly for now (simplified plan model for V1)
        # In a full model, we'd check if subscription has remaining minutes and deduct from there first.
        
        usage_record = {
            "id": str(uuid.uuid4()),
            "company_id": company_id,
            "call_id": call_id,
            "provider": provider,
            "duration_seconds": duration_seconds,
            "billed_minutes": duration_minutes,
            "provider_cost": provider_cost,
            "customer_cost": customer_cost,
            "service_type": f"{direction}_call",
            "created_at": datetime.utcnow()
        }
        
        await db.usage_records.insert_one(usage_record)
        
        # Create transaction and deduct wallet
        tx = {
            "id": str(uuid.uuid4()),
            "company_id": company_id,
            "wallet_id": wallet["id"],
            "type": "DEBIT",
            "amount": customer_cost,
            "currency": wallet["currency"],
            "payment_provider": "wallet",
            "provider_transaction_id": call_id,
            "status": "COMPLETED",
            "description": f"Voice usage: {duration_minutes} min ({direction})",
            "created_at": datetime.utcnow()
        }
        await db.transactions.insert_one(tx)
        
        new_balance = wallet["balance"] - customer_cost
        await db.wallets.update_one(
            {"id": wallet["id"]},
            {"$set": {"balance": new_balance, "updated_at": datetime.utcnow()}}
        )
        
        return usage_record

    async def get_dashboard_data(self, db, company_id: str):
        wallet = await self.get_or_create_wallet(db, company_id)
        
        # Active Plan
        sub = await db.company_subscriptions.find_one({"company_id": company_id, "status": "active"})
        plan_name = "Pay-As-You-Go"
        included_minutes = 0
        if sub:
            plan = await db.subscription_plans.find_one({"id": sub["plan_id"]})
            if plan:
                plan_name = plan["name"]
                included_minutes = plan["included_minutes"]
                
        # Used minutes this month
        now = datetime.utcnow()
        start_of_month = datetime(now.year, now.month, 1)
        
        pipeline = [
            {"$match": {"company_id": company_id, "created_at": {"$gte": start_of_month}}},
            {"$group": {"_id": None, "total_seconds": {"$sum": "$duration_seconds"}, "total_cost": {"$sum": "$customer_cost"}}}
        ]
        
        cursor = db.usage_records.aggregate(pipeline)
        agg = []
        async for doc in cursor:
            agg.append(doc)
            
        minutes_used = 0
        total_spending = 0
        if agg:
            minutes_used = int((agg[0]["total_seconds"] + 59) // 60)
            total_spending = agg[0]["total_cost"]
            
        return {
            "balance": wallet["balance"],
            "plan_name": plan_name,
            "minutes_used": minutes_used,
            "minutes_included": included_minutes,
            "total_spending": total_spending,
            "billing_period": f"{start_of_month.strftime('%B 1')} - {now.strftime('%B %d')}"
        }

billing_service = BillingService()
