import asyncio
import mongodb

async def update_qualified():
    db = mongodb.get_db()
    leads = await db.leads.find({}).to_list(length=10)
    if len(leads) > 2:
        await db.leads.update_one({'_id': leads[2]['_id']}, {'$set': {'status': 'Qualified', 'aiScore': 90}})
        await db.calls.update_one({'call_id': leads[2].get('lead_id')}, {'$set': {'status': 'Completed', 'analysis': {'lead_temperature': 'Hot'}}})
        print('Updated a third lead to Qualified!')
    else:
        print('Not enough leads to update')

asyncio.run(update_qualified())
