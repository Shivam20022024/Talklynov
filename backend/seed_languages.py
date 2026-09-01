import asyncio
import os
from dotenv import load_dotenv
import motor.motor_asyncio

async def seed_languages():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    load_dotenv(os.path.join(BASE_DIR, ".env.local"))
    
    MONGO_URI = os.environ.get("MONGODB_URI")
    MONGO_DB_NAME = os.environ.get("MONGODB_DB", "voiceai")
    
    if not MONGO_URI:
        print("MONGODB_URI not found.")
        return
        
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    
    default_agent = os.environ.get("BOLNA_AGENT_ID", "default_agent_id")
    hindi_agent = os.environ.get("BOLNA_AGENT_ID_HINDI", default_agent)
    
    mappings = [
        {"language": "English", "bolna_agent_id": default_agent, "status": "Supported"},
        {"language": "Hindi", "bolna_agent_id": hindi_agent, "status": "Supported"},
        {"language": "Bhojpuri", "bolna_agent_id": "test_bhojpuri_agent_id", "status": "Supported"}
    ]
    
    for mapping in mappings:
        await db.language_mappings.update_one(
            {"language": mapping["language"]},
            {"$set": mapping},
            upsert=True
        )
    print("Database seeded with language mappings.")

if __name__ == "__main__":
    asyncio.run(seed_languages())
