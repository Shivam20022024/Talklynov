import asyncio
import uuid
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys

# Hack to add backend to sys.path so we can import mongodb
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import mongodb

async def seed_data():
    client = AsyncIOMotorClient("mongodb+srv://Voice_Ai:Voice_Ai123@cluster0.hsvhojv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.voiceai
    
    # We will just insert into db.calls and db.usage_records directly
    company_a = "company_admin" # Currently logged in company from the screenshot
    company_b = "test_company_b"
    
    # Clean up any previous test data we might have inserted if we want, but let's just insert new ones
    print("Seeding Company A (100 calls, 30 leads)")
    for i in range(100):
        call_id = f"call_A_{i}"
        await db.calls.insert_one({
            "call_id": call_id,
            "company_id": company_a,
            "direction": "inbound" if i % 2 == 0 else "outbound",
            "created_at": datetime.utcnow(),
            "analysis": {"lead_temperature": "Hot" if i < 30 else "Warm", "lead_score": 80, "conversion_probability": 50} if i < 30 else None
        })
        await db.usage_records.insert_one({
            "company_id": company_a,
            "call_id": call_id,
            "duration_seconds": 60,
            "customer_cost": 2.0
        })

    print("Seeding Company B (50 calls, 20 leads)")
    for i in range(50):
        call_id = f"call_B_{i}"
        await db.calls.insert_one({
            "call_id": call_id,
            "company_id": company_b,
            "direction": "outbound",
            "created_at": datetime.utcnow(),
            "analysis": {"lead_temperature": "Cold", "lead_score": 10, "conversion_probability": 5} if i < 20 else None
        })
        await db.usage_records.insert_one({
            "company_id": company_b,
            "call_id": call_id,
            "duration_seconds": 120,
            "customer_cost": 4.0
        })

    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_data())
