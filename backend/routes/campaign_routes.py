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
    
    campaign_ids = [c.get("campaign_id") for c in campaigns if c.get("campaign_id")]
    
    # Bulk fetch leads counts
    leads_counts = {}
    if campaign_ids:
        leads_cursor = db.leads.aggregate([
            {"$match": {"campaign_id": {"$in": campaign_ids}}},
            {"$group": {"_id": "$campaign_id", "count": {"$sum": 1}}}
        ])
        async for doc in leads_cursor:
            leads_counts[doc["_id"]] = doc["count"]
            
    # Bulk fetch calls stats
    calls_stats = {}
    if campaign_ids:
        calls_cursor = db.calls.aggregate([
            {"$match": {"campaign_id": {"$in": campaign_ids}}},
            {"$group": {
                "_id": "$campaign_id",
                "calls_made": {"$sum": 1},
                "connected": {"$sum": {"$cond": [{"$in": ["$status", ["Completed", "completed"]]}, 1, 0]}},
                "interested": {"$sum": {"$cond": [{"$in": ["$analysis.lead_temperature", ["Warm", "Hot"]]}, 1, 0]}}
            }}
        ])
        async for doc in calls_cursor:
            calls_stats[doc["_id"]] = doc
    
    # Bulk prepare update operations to sync campaign stats
    from pymongo import UpdateOne
    bulk_updates = []
    
    for c in campaigns:
        c["_id"] = None
        campaign_id = c.get("campaign_id")
        
        if campaign_id:
            # Get stats from our bulk aggregation maps
            leads_count = leads_counts.get(campaign_id, 0)
            c_stats = calls_stats.get(campaign_id, {})
            calls_made = c_stats.get("calls_made", 0)
            connected = c_stats.get("connected", 0)
            interested = c_stats.get("interested", 0)
            
            c["leads"] = leads_count
            c["calls"] = calls_made
            c["connected"] = connected
            c["interested"] = interested
            
            # Queue for bulk update
            bulk_updates.append(
                UpdateOne(
                    {"campaign_id": campaign_id},
                    {"$set": {
                        "leads_count": leads_count,
                        "calls_made": calls_made,
                        "connected": connected,
                        "interested": interested
                    }}
                )
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
            
    if bulk_updates:
        # Execute the background sync in a single DB call
        import asyncio
        asyncio.create_task(db.campaigns.bulk_write(bulk_updates))
            
    return campaigns

@campaign_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    result = await db.campaigns.delete_one({"campaign_id": campaign_id, "company_id": current_user["company_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"status": "success"}
