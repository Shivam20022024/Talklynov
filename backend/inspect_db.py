import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    db = AsyncIOMotorClient('mongodb+srv://shivam:Shivam7004@cluster0.p1b7v0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').talkly
    call = await db.calls.find_one()
    if call:
        print("CALL KEYS:", call.keys())
    else:
        print("No calls")
        
    tx = await db.transactions.find_one()
    if tx:
        print("TX KEYS:", tx.keys())
        print("TX SAMPLE:", tx)
    else:
        print("No transactions")

asyncio.run(main())
