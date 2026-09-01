import asyncio
import mongodb

async def update_conversions():
    db = mongodb.get_db()
    leads = await db.leads.find({}).to_list(length=10)
    if len(leads) > 0:
        await db.leads.update_one({'_id': leads[0]['_id']}, {'$set': {'status': 'Converted', 'aiScore': 95}})
        await db.calls.update_one({'call_id': leads[0].get('lead_id')}, {'$set': {'status': 'Completed', 'analysis': {'lead_temperature': 'Hot', 'conversion_probability': 85}}})
    print('Updated leads for conversion!')

asyncio.run(update_conversions())
