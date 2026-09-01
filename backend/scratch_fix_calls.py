import asyncio
import mongodb

async def fix_calls():
    db = mongodb.get_db()
    # Update all calls to have 'Hot' lead_temperature so they show up under 'Qualified Calls'
    result = await db.calls.update_many({}, {'$set': {'status': 'Completed', 'analysis': {'lead_temperature': 'Hot'}}})
    print(f'Updated {result.modified_count} calls to Hot!')

asyncio.run(fix_calls())
