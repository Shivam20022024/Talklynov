import asyncio
import uuid
from datetime import datetime
import mongodb
from auth import get_password_hash

async def create_admin():
    db = mongodb.get_db()
    
    email = "admin@talkly.ai"
    password = "admin"
    company_name = "TalklyAI"
    user_name = "Talkly Admin"
    
    existing = await db.users.find_one({"email": email})
    if existing:
        print("Admin user already exists")
        return
        
    company_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    
    company_doc = {
        "company_id": company_id,
        "name": company_name,
        "plan_type": "enterprise",
        "created_at": datetime.utcnow()
    }
    await db.companies.insert_one(company_doc)
    
    user_doc = {
        "user_id": user_id,
        "company_id": company_id,
        "name": user_name,
        "email": email,
        "password_hash": get_password_hash(password),
        "role": "super_admin",
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(user_doc)
    
    print(f"Created admin user {email} / {password} for company {company_name}")

if __name__ == "__main__":
    asyncio.run(create_admin())
