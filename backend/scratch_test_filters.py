import asyncio
import mongodb
from datetime import datetime, timedelta
import uuid

async def test_date_filters():
    db = mongodb.get_db()
    
    # First get the company_id from an existing lead or default
    lead = await db.leads.find_one()
    company_id = lead['company_id'] if lead else 'test-company'
    
    # Create leads with different dates
    now = datetime.utcnow()
    
    docs = [
        {
            "lead_id": str(uuid.uuid4()),
            "company_id": company_id,
            "name": "Today Lead",
            "phone": "11111",
            "created_at": now,
            "lastContact": None
        },
        {
            "lead_id": str(uuid.uuid4()),
            "company_id": company_id,
            "name": "7 Days Lead",
            "phone": "22222",
            "created_at": now - timedelta(days=5),
            "lastContact": None
        },
        {
            "lead_id": str(uuid.uuid4()),
            "company_id": company_id,
            "name": "30 Days Lead",
            "phone": "33333",
            "created_at": now - timedelta(days=20),
            "lastContact": None
        },
        {
            "lead_id": str(uuid.uuid4()),
            "company_id": company_id,
            "name": "Old Lead",
            "phone": "44444",
            "created_at": now - timedelta(days=60),
            "lastContact": None
        }
    ]
    
    await db.leads.insert_many(docs)
    
    # Now simulate the queries
    async def get_count(range_str):
        query = {"company_id": company_id}
        if range_str != "All Time":
            today = datetime.utcnow()
            if range_str == "Today":
                start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
            elif range_str == "7 Days":
                start_date = (today - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
            elif range_str == "30 Days":
                start_date = (today - timedelta(days=30)).replace(hour=0, minute=0, second=0, microsecond=0)
            else:
                start_date = None
                
            if start_date:
                query["$or"] = [
                    {"created_at": {"$gte": start_date}},
                    {"lastContact": {"$gte": start_date.isoformat()}}
                ]
        
        count = await db.leads.count_documents(query)
        return count
        
    print("Today:", await get_count("Today"))
    print("7 Days:", await get_count("7 Days"))
    print("30 Days:", await get_count("30 Days"))
    print("All Time:", await get_count("All Time"))
    
    # Cleanup dummy dates
    await db.leads.delete_many({"phone": {"$in": ["11111", "22222", "33333", "44444"]}})

asyncio.run(test_date_filters())
