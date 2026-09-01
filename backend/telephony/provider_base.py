from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List

class TelephonyProviderBase(ABC):
    """
    Abstract base class for telephony providers (Bolna, Twilio, etc.).
    TalklyAI interacts with this abstraction rather than concrete implementations.
    """
    
    @abstractmethod
    async def trigger_outbound_call(
        self, 
        phone_number: str, 
        lead_id: str, 
        campaign_language: str, 
        ai_voice: str, 
        voice_gender: str, 
        regional_accent: str,
        webhook_url: str
    ) -> Dict[str, Any]:
        """Trigger an outbound call to the given phone number."""
        pass
    
    @abstractmethod
    async def process_webhook(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process inbound webhooks for status updates and transcripts."""
        pass

    @abstractmethod
    async def transfer_call(self, call_id: str, transfer_to: str, context: Dict[str, Any]) -> bool:
        """Transfer a live call to a human agent."""
        pass
