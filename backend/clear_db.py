import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def clear_db():
    load_dotenv(".env.local")
    uri = os.environ.get("MONGODB_URI")
    db_name = os.environ.get("MONGODB_DB", "voiceai")
    
    if not uri:
        print("MONGODB_URI not found in .env.local")
        return

    print(f"Connecting to: {uri[:20]}...")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    count_before = await db.calls.count_documents({})
    print(f"Current calls in DB: {count_before}")
    
    print("Deleting all records from 'calls' collection...")
    result = await db.calls.delete_many({})
    
    print(f"Successfully deleted {result.deleted_count} records.")
    
    count_after = await db.calls.count_documents({})
    print(f"Calls remaining: {count_after}")

if __name__ == "__main__":
    asyncio.run(clear_db())
