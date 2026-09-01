import asyncio
from dotenv import load_dotenv
load_dotenv('.env.local')

import mongodb
from datetime import datetime

async def run_sync():
    print("Starting retroactive sync...")
    
    # Initialize DB connection using existing logic
    db = mongodb.get_db()
    
    # Find all analyzed calls that have analysis data
    cursor = db.calls.find({"status": "Analyzed", "analysis": {"$exists": True}})
    
    count = 0
    async for call in cursor:
        lead_id = call.get("call_id")
        analysis_result = call.get("analysis")
        
        if lead_id and analysis_result:
            lead_temperature = analysis_result.get("lead_temperature")
            if lead_temperature in ["Hot", "Warm"]:
                lead_status = "Interested" if lead_temperature == "Warm" else "Qualified"
            elif analysis_result.get("conversion_probability", 0) > 80:
                lead_status = "Converted"
            else:
                lead_status = "Contacted"
                
            await db.leads.update_one(
                {"lead_id": lead_id},
                {"$set": {
                    "status": lead_status,
                    "aiScore": analysis_result.get("lead_score", 0),
                    "lastContact": datetime.utcnow().isoformat()
                }}
            )
            count += 1
            
    print(f"Successfully synced {count} past calls to leads!")

if __name__ == "__main__":
    asyncio.run(run_sync())
