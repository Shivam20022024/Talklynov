import asyncio
import mongodb
from pprint import pprint

async def check():
    db = mongodb.get_db()
    # Find the call where transcript contains 'novalantis' (from screenshot)
    call = await db.calls.find_one({"transcript": {"$regex": "novalantis", "$options": "i"}})
    print("Call found:")
    pprint(call)

asyncio.run(check())
