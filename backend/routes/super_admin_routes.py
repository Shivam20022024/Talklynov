from fastapi import APIRouter, Depends, HTTPException
import mongodb
import uuid
from auth import get_current_user, require_super_admin, get_password_hash
from datetime import datetime

super_admin_router = APIRouter()

@super_admin_router.get("/dashboard-stats")
async def get_dashboard_stats(current_user: dict = Depends(require_super_admin)):
    db = mongodb.get_db()
    
    total_companies = await db.companies.count_documents({})
    active_companies = await db.companies.count_documents({"status": "ACTIVE"})
    total_users = await db.users.count_documents({})
    total_leads = await db.calls.count_documents({"direction": "outbound"}) # Assuming leads correspond to calls
    total_calls = await db.calls.count_documents({})
    completed_calls = await db.calls.count_documents({"status": "Completed"})
    
    return {
        "status": "success",
        "data": {
            "Total Companies": total_companies,
            "Active Companies": active_companies,
            "Total Users": total_users,
            "Total Leads": total_leads,
            "Total Calls": total_calls,
            "Completed Calls": completed_calls,
        }
    }

@super_admin_router.get("/companies")
async def get_companies(current_user: dict = Depends(require_super_admin)):
    db = mongodb.get_db()
    
    pipeline = [
        {
            "$lookup": {
                "from": "users",
                "localField": "company_id",
                "foreignField": "company_id",
                "as": "users"
            }
        },
        {
            "$lookup": {
                "from": "calls",
                "localField": "company_id",
                "foreignField": "company_id",
                "as": "calls"
            }
        },
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "company_id": 1,
                "name": 1,
                "status": 1,
                "created_at": 1,
                "stats": {
                    "users": {"$size": "$users"},
                    "calls": {"$size": "$calls"}
                }
            }
        },
        {
            "$sort": {"created_at": -1}
        }
    ]
    
    cursor = db.companies.aggregate(pipeline)
    companies = []
    async for c in cursor:
        companies.append(c)
        
    return {"status": "success", "data": companies}

@super_admin_router.post("/companies")
async def create_company(payload: dict, current_user: dict = Depends(require_super_admin)):
    company_name = payload.get("company_name")
    email = payload.get("email")
    password = payload.get("password")
    user_name = payload.get("name")
    
    if not all([company_name, email, password, user_name]):
        raise HTTPException(status_code=400, detail="Missing required fields")
        
    db = mongodb.get_db()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    company_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    
    # Create Company
    company_doc = {
        "company_id": company_id,
        "name": company_name,
        "plan_type": "trial",
        "status": "ACTIVE",
        "created_at": datetime.utcnow()
    }
    await db.companies.insert_one(company_doc)
    
    # Create Company Admin User
    user_doc = {
        "user_id": user_id,
        "company_id": company_id,
        "name": user_name,
        "email": email,
        "password_hash": get_password_hash(password),
        "role": "COMPANY_ADMIN",
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(user_doc)
    
    return {"status": "success", "message": "Company and user created successfully"}

@super_admin_router.post("/companies/{company_id}/status")
async def update_company_status(company_id: str, payload: dict, current_user: dict = Depends(require_super_admin)):
    new_status = payload.get("status")
    if new_status not in ["ACTIVE", "SUSPENDED", "TRIAL", "INACTIVE"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    db = mongodb.get_db()
    await db.companies.update_one(
        {"company_id": company_id},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
    )
    return {"status": "success", "message": f"Company status updated to {new_status}"}

@super_admin_router.get("/users")
async def get_users(current_user: dict = Depends(require_super_admin)):
    db = mongodb.get_db()
    
    # Use aggregation to lookup company names
    pipeline = [
        {
            "$lookup": {
                "from": "companies",
                "localField": "company_id",
                "foreignField": "company_id",
                "as": "company_info"
            }
        },
        {
            "$unwind": {
                "path": "$company_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "user_id": 1,
                "name": 1,
                "email": 1,
                "role": 1,
                "company_id": 1,
                "created_at": 1,
                "company_name": "$company_info.name"
            }
        },
        {
            "$sort": {"created_at": -1}
        }
    ]
    
    cursor = db.users.aggregate(pipeline)
    users = []
    async for u in cursor:
        users.append(u)
    return {"status": "success", "data": users}
