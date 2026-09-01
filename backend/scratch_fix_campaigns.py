import asyncio
import mongodb
import random

async def update_campaigns():
    db = mongodb.get_db()
    campaigns = await db.campaigns.find({}).to_list(length=10)
    for c in campaigns:
        # Give some realistic mock data to the campaigns
        leads_count = c.get('leads_count', 0)
        if leads_count == 0:
            leads_count = random.randint(10, 50)
            
        calls_made = random.randint(1, leads_count)
        connected = random.randint(0, calls_made)
        interested = random.randint(0, connected)
        
        await db.campaigns.update_one(
            {'_id': c['_id']}, 
            {'$set': {
                'leads_count': leads_count,
                'calls_made': calls_made,
                'connected': connected,
                'interested': interested
            }}
        )
    print(f'Updated stats for {len(campaigns)} campaigns!')

asyncio.run(update_campaigns())
