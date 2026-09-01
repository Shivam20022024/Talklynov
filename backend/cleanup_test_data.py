import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def cleanup():
    client = AsyncIOMotorClient("mongodb+srv://Voice_Ai:Voice_Ai123@cluster0.hsvhojv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.voiceai

    print("Cleaning up mock data...")
    calls_result = await db.calls.delete_many({"call_id": {"$regex": "^call_[AB]_"}})
    print(f"Deleted {calls_result.deleted_count} mock calls.")

    usage_result = await db.usage_records.delete_many({"call_id": {"$regex": "^call_[AB]_"}})
    print(f"Deleted {usage_result.deleted_count} mock usage records.")

if __name__ == "__main__":
    asyncio.run(cleanup())
