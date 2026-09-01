import asyncio
import mongodb
from report_service import generate_multi_sheet_report

async def test_report():
    await mongodb.ensure_indexes()
    db = mongodb.get_db()
    cursor = db.calls.find().sort("created_at", -1)
    calls_data = []
    async for d in cursor:
        d["_id"] = None
        calls_data.append(d)
    
    print(f"Loaded {len(calls_data)} calls")
    try:
        path = generate_multi_sheet_report(calls_data)
        print("Success:", path)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_report())
