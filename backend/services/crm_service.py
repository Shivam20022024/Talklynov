import datetime
import asyncio

class CRMService:
    async def sync_call_to_crm(self, db, call_id: str) -> bool:
        """
        Mocks a CRM sync operation.
        In a real scenario, this would push data to HubSpot/Salesforce via API.
        """
        # Look up the call
        call_doc = await db.calls.find_one({"call_id": call_id})
        if not call_doc:
            raise ValueError(f"Call {call_id} not found")

        # Mock API delay
        await asyncio.sleep(1)

        # Update the database
        await db.calls.update_one(
            {"call_id": call_id},
            {"$set": {
                "crm_synced": True,
                "crm_sync_timestamp": datetime.datetime.utcnow().isoformat()
            }}
        )

        return True

crm_service = CRMService()
