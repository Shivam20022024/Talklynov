from fastapi import APIRouter, HTTPException, Depends, Body
from datetime import datetime
import uuid
import mongodb
from auth import get_current_user

campaign_router = APIRouter()

@campaign_router.post("/campaigns")
async def create_campaign(payload: dict = Body(...), current_user: dict = Depends(get_current_user)):
    name = payload.get("name")
    property_name = payload.get("property")
    
    if not name:
        raise HTTPException(status_code=400, detail="Campaign name is required")
        
    db = mongodb.get_db()
    campaign_id = str(uuid.uuid4())
    
    doc = {
        "campaign_id": campaign_id,
        "company_id": current_user["company_id"],
        "name": name,
        "property": property_name or "",
        "created_at": datetime.utcnow(),
        "leads_count": 0,
        "calls_made": 0,
        "connected": 0,
        "interested": 0,
        "status": "Active",
        "progress": 0
    }
    
    await db.campaigns.insert_one(doc)
    doc["_id"] = None
    return doc

@campaign_router.get("/campaigns")
async def list_campaigns(current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    campaigns = await db.campaigns.find({"company_id": current_user["company_id"]}).sort("created_at", -1).to_list(length=100)
    
    for c in campaigns:
        c["_id"] = None
        campaign_id = c.get("campaign_id")
        
        if campaign_id:
            # Dynamically calculate metrics
            leads_count = await db.leads.count_documents({"campaign_id": campaign_id})
            calls_made = await db.calls.count_documents({"campaign_id": campaign_id})
            connected = await db.calls.count_documents({"campaign_id": campaign_id, "status": {"$in": ["Completed", "completed"]}})
            interested = await db.calls.count_documents({
                "campaign_id": campaign_id, 
                "analysis.lead_temperature": {"$in": ["Warm", "Hot"]}
            })
            
            c["leads"] = leads_count
            c["calls"] = calls_made
            c["connected"] = connected
            c["interested"] = interested
            
            # Update the static fields in the background to keep them somewhat in sync
            await db.campaigns.update_one(
                {"campaign_id": campaign_id},
                {"$set": {
                    "leads_count": leads_count,
                    "calls_made": calls_made,
                    "connected": connected,
                    "interested": interested
                }}
            )
        else:
            c["leads"] = c.get("leads_count", 0)
            c["calls"] = c.get("calls_made", 0)
            c["connected"] = c.get("connected", 0)
            c["interested"] = c.get("interested", 0)
            
        # Calculate conversion for UI based on connected/interested
        if c.get("connected", 0) > 0:
            c["conversion"] = f"{round((c['interested'] / c['connected']) * 100, 1)}%"
        else:
            c["conversion"] = "0%"
            
    return campaigns

@campaign_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    result = await db.campaigns.delete_one({"campaign_id": campaign_id, "company_id": current_user["company_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"status": "success"}
