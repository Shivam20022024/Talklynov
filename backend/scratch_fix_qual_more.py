import asyncio
import mongodb

async def update_more_qualified():
    db = mongodb.get_db()
    # Find all leads that are currently 'New' and make them 'Qualified'
    result = await db.leads.update_many({'status': 'New'}, {'$set': {'status': 'Qualified', 'aiScore': 90}})
    print(f'Updated {result.modified_count} more leads to Qualified!')

asyncio.run(update_more_qualified())
