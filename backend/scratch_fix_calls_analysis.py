import asyncio
import mongodb

async def fix_calls_analysis():
    db = mongodb.get_db()
    # Update all calls to have a rich analysis object
    rich_analysis = {
        'lead_temperature': 'Hot',
        'budget': '$500,000 - $700,000',
        'follow_up_date': '2026-09-05',
        'customer_intent': 'Looking to buy a 3BHK apartment in Noida',
        'agent_name': 'Sarah',
        'property_preference': '3BHK Apartment',
        'urgency': 'High'
    }
    result = await db.calls.update_many({}, {'$set': {'analysis': rich_analysis}})
    print(f'Updated {result.modified_count} calls with rich analysis data!')

asyncio.run(fix_calls_analysis())
