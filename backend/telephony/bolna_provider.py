import os
import requests
from typing import Dict, Any, Optional
from .provider_base import TelephonyProviderBase

class BolnaProvider(TelephonyProviderBase):
    def __init__(self):
        self.api_key = os.environ.get("BOLNA_API_KEY", "").strip()
        self.base_url = "https://api.bolna.ai"

    async def trigger_outbound_call(
        self, 
        phone_number: str, 
        lead_id: str,
        agent_id: str,
        campaign_language: str, 
        ai_voice: str, 
        voice_gender: str, 
        regional_accent: str,
        webhook_url: str
    ) -> Dict[str, Any]:
        
        if not self.api_key or not agent_id:
            raise ValueError("Bolna.ai API Key or Agent ID not configured")

        url = f"{self.base_url}/call"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        bolna_payload = {
            "agent_id": agent_id,
            "recipient_phone_number": phone_number,
            "webhook_url": webhook_url,
            "user_data": {
                "lead_id": lead_id,
                "customer_name": "Phone Lead",
                "agent_name": "AI Agent",
                "campaign_language": campaign_language,
                "ai_voice": ai_voice,
                "voice_gender": voice_gender,
                "regional_accent": regional_accent
            }
        }

        # Uses blocking request here, but we can run this via threadpool in the server
        response = requests.post(url, json=bolna_payload, headers=headers, timeout=30)
        
        if not response.ok:
            raise Exception(f"Bolna Error: {response.text}")
            
        return response.json()

    async def process_webhook(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Webhook parsing logic will be unified here or in the server
        # For Bolna, the main data is in 'user_data', 'telephony_data', 'transcript'
        return data

    async def transfer_call(self, call_id: str, transfer_to: str, context: Dict[str, Any]) -> bool:
        # Bolna transfer logic (if supported by their API natively, or just logging for now)
        # As of current implementation, we may just notify a human via dashboard
        print(f"Transferring {call_id} to {transfer_to} with context {context}")
        return True
