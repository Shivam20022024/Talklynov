import asyncio
import mongodb

async def check():
    db = mongodb.get_db()
    c = await db.calls.find_one()
    print("Call campaign ID:", c.get('campaign_id') if c else "No calls")

asyncio.run(check())
