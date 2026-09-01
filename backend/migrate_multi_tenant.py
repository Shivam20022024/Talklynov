import asyncio
import os
import uuid
from datetime import datetime
import motor.motor_asyncio
from dotenv import load_dotenv

# Load env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))

MONGO_URI = os.environ.get("MONGODB_URI")
MONGO_DB_NAME = os.environ.get("MONGODB_DB", "voiceai")

async def migrate():
    print("Starting Multi-Tenant Migration...")
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    
    # 1. Create a Novalantis Default Company if it doesn't exist
    legacy_company_id = "novalantis-legacy-tenant"
    existing_legacy = await db.companies.find_one({"company_id": legacy_company_id})
    
    if not existing_legacy:
        print(f"Creating legacy company: {legacy_company_id}")
        await db.companies.insert_one({
            "company_id": legacy_company_id,
            "name": "Novalantis (Legacy)",
            "status": "ACTIVE",
            "subscription_plan": "ENTERPRISE",
            "created_at": datetime.utcnow()
        })
    else:
        print("Legacy company already exists.")

    # 2. Update users
    print("Migrating users...")
    users = db.users.find({})
    async for user in users:
        update_fields = {}
        if "role" not in user:
            update_fields["role"] = "COMPANY_ADMIN"
        if "company_id" not in user:
            update_fields["company_id"] = legacy_company_id
            
        # Give the first user SUPER_ADMIN role for testing
        if user.get("email") == "admin@talkly.ai" or user.get("email") == "test@test.com":
             update_fields["role"] = "SUPER_ADMIN"
             update_fields["company_id"] = legacy_company_id
             
        if update_fields:
            await db.users.update_one({"_id": user["_id"]}, {"$set": update_fields})
            print(f"Updated user {user.get('email')} with {update_fields}")

    # 3. Update existing records with company_id
    collections_to_migrate = ["calls", "leads", "campaigns", "ai_agents", "language_mappings", "appointments"]
    for coll_name in collections_to_migrate:
        print(f"Migrating {coll_name}...")
        try:
            coll = db[coll_name]
            result = await coll.update_many(
                {"company_id": {"$exists": False}},
                {"$set": {"company_id": legacy_company_id}}
            )
            print(f"Updated {result.modified_count} records in {coll_name}.")
        except Exception as e:
            print(f"Error migrating {coll_name}: {e}")

    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate())
