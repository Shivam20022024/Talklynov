import asyncio
import mongodb

async def check_campaigns():
    db = mongodb.get_db()
    campaigns = await db.campaigns.find().to_list(length=10)
    for c in campaigns:
        cid = c.get("campaign_id")
        name = c.get("name")
        print(f"Campaign: {name} (ID: {cid})")
        
        leads_count = await db.leads.count_documents({"campaign_id": cid})
        calls_count = await db.calls.count_documents({"campaign_id": cid})
        
        print(f"  - Actual Leads in DB: {leads_count}")
        print(f"  - Actual Calls in DB: {calls_count}")
        print(f"  - Static Leads in DB: {c.get('leads_count', 0)}")
        print(f"  - Static Calls in DB: {c.get('calls_made', 0)}")
        print("---")

asyncio.run(check_campaigns())
