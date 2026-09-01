import asyncio
import mongodb

async def main():
    db = mongodb.get_db()
    # Find all companies that don't have a status field
    result = await db.companies.update_many(
        {"status": {"$exists": False}},
        {"$set": {"status": "ACTIVE"}}
    )
    print(f"Updated {result.modified_count} companies to ACTIVE.")

if __name__ == "__main__":
    asyncio.run(main())
