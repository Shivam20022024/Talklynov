import asyncio
import mongodb

async def update_leads():
    db = mongodb.get_db()
    leads = await db.leads.find({}).to_list(length=10)
    print(f'Found {len(leads)} leads')
    if len(leads) > 0:
        await db.leads.update_one({'_id': leads[0]['_id']}, {'$set': {'status': 'Qualified', 'aiScore': 95}})
        await db.calls.update_one({'call_id': leads[0].get('lead_id')}, {'$set': {'status': 'Completed', 'analysis': {'lead_temperature': 'Hot'}}})
    if len(leads) > 1:
        await db.leads.update_one({'_id': leads[1]['_id']}, {'$set': {'status': 'Interested', 'aiScore': 80}})
        await db.calls.update_one({'call_id': leads[1].get('lead_id')}, {'$set': {'status': 'Completed', 'analysis': {'lead_temperature': 'Warm'}}})
    print('Updated leads!')

asyncio.run(update_leads())
