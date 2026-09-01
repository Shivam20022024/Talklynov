import asyncio
import os
import json
import requests
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv

# Re-using logic from server.py and process_audio.py logic manually for this one-off
from process_audio import analyze_transcript_text

async def fix_specific_call(execution_id, lead_id):
    load_dotenv(".env.local")
    uri = os.environ.get("MONGODB_URI")
    db_name = os.environ.get("MONGODB_DB", "voiceai")
    api_key = os.environ.get("BOLNA_API_KEY")
    
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    print(f"Fetching data for {execution_id} from Bolna...")
    url = f"https://api.bolna.ai/executions/{execution_id}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers, timeout=10)
    if not response.ok:
        print(f"Failed to fetch from Bolna: {response.text}")
        return

    data = response.json()
    transcript = data.get("transcript", "")
    print(f"Transcript found ({len(transcript)} chars). Analyzing...")
    
    # Run analysis
    analysis = analyze_transcript_text(transcript)
    
    update_data = {
        "transcript": transcript,
        "status": "Analyzed",
        "summary": analysis.get("summary"),
        "sentiment": analysis.get("sentiment"),
        "analysis": analysis,
        "updated_at": datetime.utcnow()
    }
    
    print(f"Updating Lead {lead_id} in MongoDB...")
    await db.calls.update_one({"call_id": lead_id}, {"$set": update_data}, upsert=True)
    print("Done! Check your dashboard now.")

if __name__ == "__main__":
    # The ID provided by the user
    eid = "bc3bd5cf-a455-48df-a478-2a77367fc9d7"
    lid = "test_verification_call_2" 
    asyncio.run(fix_specific_call(eid, lid))
