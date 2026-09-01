from fastapi import APIRouter, HTTPException, Depends, Body
from datetime import datetime, timedelta
import uuid
import mongodb
from auth import get_password_hash, verify_password, create_access_token, get_current_user

auth_router = APIRouter()

@auth_router.post("/register")
async def register_company(payload: dict = Body(...)):
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
    
    # Generate Token
    access_token = create_access_token(
        data={"sub": user_id, "company_id": company_id, "role": "COMPANY_ADMIN", "email": email}
    )
    
    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_name,
            "email": email,
            "role": "COMPANY_ADMIN",
            "company_id": company_id,
            "company_name": company_name
        }
    }

@auth_router.post("/login")
async def login(payload: dict = Body(...)):
    email = payload.get("email")
    password = payload.get("password")
    
    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Missing email or password")
        
    db = mongodb.get_db()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if user.get("status") == "PENDING_ACTIVATION":
        raise HTTPException(status_code=401, detail="Your account is not activated yet. Please check your email.")
        
    company = await db.companies.find_one({"company_id": user["company_id"]})
    company_name = company["name"] if company else "Unknown"
        
    access_token = create_access_token(
        data={"sub": user["user_id"], "company_id": user["company_id"], "role": user.get("role", "COMPANY_ADMIN"), "email": email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["user_id"],
            "name": user["name"],
            "email": email,
            "role": user.get("role", "COMPANY_ADMIN"),
            "company_id": user["company_id"],
            "company_name": company_name
        }
    }

@auth_router.post("/activate")
async def activate_account(payload: dict = Body(...)):
    token = payload.get("token")
    password = payload.get("password")
    
    if not token or not password:
        raise HTTPException(status_code=400, detail="Missing token or password")
        
    db = mongodb.get_db()
    token_doc = await db.activation_tokens.find_one({"token": token, "used": False})
    
    if not token_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired activation link.")
        
    if datetime.utcnow() > token_doc["expires_at"]:
        raise HTTPException(status_code=400, detail="Your activation link has expired. Please contact support.")
        
    user_id = token_doc["user_id"]
    
    # Update user
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {
            "password_hash": get_password_hash(password),
            "status": "ACTIVE"
        }}
    )
    
    # Mark token as used
    await db.activation_tokens.update_one(
        {"token": token},
        {"$set": {"used": True}}
    )
    
    return {"status": "success", "message": "Account activated successfully."}

@auth_router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    user_doc = await db.users.find_one({"user_id": current_user["user_id"]})
    if user_doc:
        current_user["name"] = user_doc.get("name")
    return current_user

