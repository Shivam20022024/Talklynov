import asyncio
from mongodb import get_db

async def main():
    db = get_db()
    result = await db.calls.update_many(
        {"status": "Analyzed", "duration_seconds": {"$exists": False}},
        {"$set": {"duration_seconds": 60}}
    )
    print(f"Updated {result.modified_count} calls")

asyncio.run(main())
