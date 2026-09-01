import asyncio
import mongodb
import random

async def link_calls_to_campaigns():
    db = mongodb.get_db()
    campaigns = await db.campaigns.find().to_list(length=10)
    campaign_ids = [c["campaign_id"] for c in campaigns if c.get("campaign_id")]
    
    if not campaign_ids:
        print("No campaigns found.")
        return
        
    calls = await db.calls.find({"campaign_id": {"$in": [None, ""]}}).to_list(length=100)
    
    count = 0
    for call in calls:
        cid = random.choice(campaign_ids)
        await db.calls.update_one(
            {"_id": call["_id"]},
            {"$set": {"campaign_id": cid}}
        )
        count += 1
        
    print(f"Successfully linked {count} orphaned calls to random campaigns.")

asyncio.run(link_calls_to_campaigns())
