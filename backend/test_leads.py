import asyncio, motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()
async def main():
    db = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URI")).talklyai
    print("Connected to:", os.getenv("MONGODB_URI"))
    count = await db.leads.count_documents({})
    print(f'Total Leads: {count}')
    cursor = db.leads.find({"campaign_id": {"$exists": True, "$ne": None}})
    async for d in cursor:
        print(d.get("name"), d.get("campaign_id"))

asyncio.run(main())
