import asyncio, motor.motor_asyncio
async def backfill():
    db = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://Voice_Ai:Voice_Ai123@cluster0.hsvhojv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').talklyai
    calls = await db.calls.find({'customer_name': 'Phone Lead'}).to_list(None)
    for call in calls:
        if 'call_id' in call and call['call_id']:
            lead = await db.leads.find_one({'lead_id': call['call_id']})
            if not lead:
                try:
                    from bson import ObjectId
                    lead = await db.leads.find_one({'_id': ObjectId(call['call_id'])})
                except:
                    pass
            if lead and lead.get('name'):
                await db.calls.update_one({'_id': call['_id']}, {'$set': {'customer_name': lead['name'].strip()}})
                print(f"Updated {call['call_id']} with name {lead['name']}")
asyncio.run(backfill())
