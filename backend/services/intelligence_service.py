from datetime import datetime, timedelta
import asyncio
from typing import Dict, Any, List

class IntelligenceService:
    """
    Service for calculating AI Business Intelligence metrics across calls.
    """
    
    async def get_dashboard_metrics(self, db, company_id: str, range_str: str = "30 Days") -> Dict[str, Any]:
        """
        Calculates top-level metrics for the BI Dashboard.
        """
        today = datetime.utcnow()
        if range_str == "Today":
            days = 0
        elif range_str == "7 Days":
            days = 7
        elif range_str == "90 Days":
            days = 90
        else:
            days = 30
            
        start_date = (today - timedelta(days=days)).replace(hour=0, minute=0, second=0, microsecond=0)
        
        # 1. Total Leads
        total_leads = await db.leads.count_documents({"company_id": company_id, "created_at": {"$gte": start_date}})
        
        # 2. Calls Made
        calls_made = await db.calls.count_documents({"company_id": company_id, "created_at": {"$gte": start_date}})
        
        # 3. Connected Calls
        connected_calls = await db.calls.count_documents({
            "company_id": company_id, 
            "status": {"$in": ["Completed", "completed", "Analyzed"]},
            "created_at": {"$gte": start_date}
        })
        
        # 4. Lead Statuses
        qualified_leads = await db.leads.count_documents({"company_id": company_id, "status": "Qualified", "created_at": {"$gte": start_date}})
        interested_leads = await db.leads.count_documents({"company_id": company_id, "status": "Interested", "created_at": {"$gte": start_date}})
        converted_leads = await db.leads.count_documents({"company_id": company_id, "status": "Converted", "created_at": {"$gte": start_date}})
        contacted_leads = await db.leads.count_documents({"company_id": company_id, "status": {"$ne": "New"}, "created_at": {"$gte": start_date}})
        
        # 5. Conversion Rate
        conversion_rate = "0%"
        if total_leads > 0:
            rate = (converted_leads / total_leads) * 100
            conversion_rate = f"{rate:.1f}%"
            
        # 6. Chart Data
        chart_data = []
        if days == 0:
            points = 12
            step_hours = 2
            for i in range(points - 1, -1, -1):
                d_start = (today - timedelta(hours=i*step_hours)).replace(minute=0, second=0, microsecond=0)
                d_end = d_start + timedelta(hours=step_hours)
                cm = await db.calls.count_documents({"company_id": company_id, "created_at": {"$gte": d_start, "$lt": d_end}})
                cc = await db.calls.count_documents({"company_id": company_id, "status": {"$in": ["Completed", "completed", "Analyzed"]}, "created_at": {"$gte": d_start, "$lt": d_end}})
                chart_data.append({"date": d_start.strftime("%I %p"), "calls_made": cm, "connected_calls": cc})
        else:
            points = min(12, days)
            step_days = max(1, days // points)
            for i in range(points - 1, -1, -1):
                d_start = (today - timedelta(days=i*step_days)).replace(hour=0, minute=0, second=0, microsecond=0)
                d_end = d_start + timedelta(days=step_days)
                cm = await db.calls.count_documents({"company_id": company_id, "created_at": {"$gte": d_start, "$lt": d_end}})
                cc = await db.calls.count_documents({"company_id": company_id, "status": {"$in": ["Completed", "completed", "Analyzed"]}, "created_at": {"$gte": d_start, "$lt": d_end}})
                chart_data.append({"date": d_start.strftime("%b %d"), "calls_made": cm, "connected_calls": cc})
            
        return {
            "total_leads": total_leads,
            "calls_made": calls_made,
            "connected_calls": connected_calls,
            "qualified_leads": qualified_leads,
            "interested_leads": interested_leads,
            "converted_leads": converted_leads,
            "contacted_leads": contacted_leads,
            "conversion_rate": conversion_rate,
            "chart_data": chart_data
        }
    async def get_overall_dashboard_metrics(self, db, company_id: str) -> Dict[str, Any]:
        """
        Calculates lifetime (overall) metrics for the BI Dashboard.
        """
        # 1. Total Calls
        total_calls = await db.calls.count_documents({"company_id": company_id})
        inbound_calls = await db.calls.count_documents({"company_id": company_id, "direction": "inbound"})
        outbound_calls = await db.calls.count_documents({"company_id": company_id, "direction": "outbound"})
        
        # 2. Total Leads (calls with analysis)
        total_leads = await db.calls.count_documents({"company_id": company_id, "analysis": {"$exists": True}})
        
        # 3. Lead Temperatures
        hot_leads = await db.calls.count_documents({"company_id": company_id, "analysis.lead_temperature": "Hot"})
        warm_leads = await db.calls.count_documents({"company_id": company_id, "analysis.lead_temperature": "Warm"})
        cold_leads = await db.calls.count_documents({"company_id": company_id, "analysis.lead_temperature": "Cold"})
        
        # 4. Averages
        avg_pipeline = [
            {"$match": {"company_id": company_id, "analysis.lead_score": {"$exists": True}}},
            {"$group": {
                "_id": None, 
                "avg_score": {"$avg": "$analysis.lead_score"},
                "avg_conv": {"$avg": "$analysis.conversion_probability"}
            }}
        ]
        avg_agg = await db.calls.aggregate(avg_pipeline).to_list(length=1)
        avg_buyer_intent = round(avg_agg[0]["avg_score"]) if avg_agg and avg_agg[0]["avg_score"] is not None else 0
        avg_conversion = round(avg_agg[0]["avg_conv"]) if avg_agg and avg_agg[0]["avg_conv"] is not None else 0
        
        # 5. Talk Time & Spending (from usage_records)
        usage_pipeline = [
            {"$match": {"company_id": company_id}},
            {"$group": {
                "_id": None,
                "total_seconds": {"$sum": "$duration_seconds"},
                "total_spending": {"$sum": "$customer_cost"}
            }}
        ]
        usage_agg = await db.usage_records.aggregate(usage_pipeline).to_list(length=1)
        
        total_seconds = usage_agg[0]["total_seconds"] if usage_agg else 0
        total_spending = usage_agg[0]["total_spending"] if usage_agg else 0
        
        # Convert seconds to hours for display (or return seconds and let frontend format)
        total_talk_time_hrs = round(total_seconds / 3600)
        
        return {
            "total_calls": total_calls,
            "inbound_calls": inbound_calls,
            "outbound_calls": outbound_calls,
            "total_leads": total_leads,
            "hot_leads": hot_leads,
            "warm_leads": warm_leads,
            "cold_leads": cold_leads,
            "average_buyer_intent": avg_buyer_intent,
            "average_conversion_probability": avg_conversion,
            "total_talk_time": total_talk_time_hrs,
            "total_spending": round(total_spending, 2)
        }

    async def get_customer_timeline(self, db, customer_id: str, company_id: str) -> List[Dict[str, Any]]:
        """
        Fetches the complete timeline of interactions for a given customer phone number.
        """
        # Ensure correct formatting (some might have +, some might not)
        clean_id = customer_id.replace('+', '').strip()
        
        calls = await db.calls.find(
            {"customer_id": {"$regex": f"{clean_id}$"}, "company_id": company_id}
        ).sort("created_at", -1).to_list(length=50)
        
        timeline = []
        for call in calls:
            # Map call document to a timeline event
            timeline.append({
                "type": "call",
                "id": call.get("call_id"),
                "date": call.get("created_at"),
                "direction": call.get("direction", "outbound"),
                "status": call.get("status"),
                "duration": "00:00", # TODO: compute from timestamps if available
                "summary": call.get("summary", ""),
                "sentiment": call.get("sentiment", "neutral"),
                "lead_score": call.get("analysis", {}).get("lead_score", 0),
                "action_items": call.get("analysis", {}).get("action_items", [])
            })
            
        return timeline
