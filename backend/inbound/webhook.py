import json
from datetime import datetime
from .session_manager import update_inbound_session

async def process_inbound_post_call(data: dict):
    """
    Handles post-call processing (e.g., transcripts and analytics) 
    specifically for inbound calls if needed.
    Currently, the main Bolna webhook handles this globally, 
    but this module isolates inbound-specific analytics.
    """
    call_id = data.get("call_id")
    if not call_id:
        return
        
    transcript = data.get("transcript", "")
    
    updates = {
        "transcript": transcript,
        "status": "Completed",
        "last_webhook_at": datetime.utcnow().isoformat() + "Z"
    }
    
    await update_inbound_session(call_id, updates)
    return {"status": "success"}
