import re
from typing import Dict, Any, Optional

class LanguageService:
    """
    Handles language detection, switching logic, and analytics aggregation
    for TalklyAI (Indian Languages).
    """
    
    SUPPORTED_LANGUAGES = [
        "English", "Hindi", "Tamil", "Telugu", "Kannada", 
        "Malayalam", "Bengali", "Marathi", "Gujarati", 
        "Punjabi", "Bhojpuri", "Odia", "Assamese", "Urdu"
    ]

    def detect_language_from_text(self, transcript: str, current_language: str = "English") -> str:
        """
        Uses heuristics or delegates to an LLM (in process_audio.py) to detect language.
        For now, this provides a lightweight fallback mechanism.
        """
        if not transcript:
            return current_language
            
        transcript_lower = transcript.lower()
        
        # Simple heuristic mapping (in reality, relies on OpenRouter/GPT-4o)
        if re.search(r'[\u0900-\u097F]', transcript):
            return "Hindi"  # Devanagari block
        if re.search(r'[\u0B80-\u0BFF]', transcript):
            return "Tamil"
        if re.search(r'[\u0C00-\u0C7F]', transcript):
            return "Telugu"
        if re.search(r'[\u0C80-\u0CFF]', transcript):
            return "Kannada"
        if re.search(r'[\u0D00-\u0D7F]', transcript):
            return "Malayalam"
        if re.search(r'[\u0980-\u09FF]', transcript):
            return "Bengali"
            
        return current_language

    def should_switch_language(self, transcript: str, current_language: str) -> Optional[str]:
        """
        Determines if the customer requested a language switch or if the spoken
        language heavily deviated from the current language.
        """
        detected = self.detect_language_from_text(transcript, current_language)
        if detected != current_language and detected in self.SUPPORTED_LANGUAGES:
            # We detected a switch
            return detected
        return None

    async def get_agent_id_for_language(self, db, language: str, company_id: str = None) -> str:
        """
        Dynamically fetches the Bolna Agent ID for a requested language from the DB.
        Falls back to English if not found.
        """
        import os
        
        query = {"language": {"$regex": f"^{language}$", "$options": "i"}}
        if company_id:
            query["company_id"] = company_id
            
        # 1. Query the database
        mapping = await db.language_mappings.find_one(query)
        if mapping and mapping.get("bolna_agent_id"):
            return mapping["bolna_agent_id"]
            
        # 2. Fallback to English DB configuration
        query_en = {"language": "English"}
        if company_id:
            query_en["company_id"] = company_id
            
        mapping_en = await db.language_mappings.find_one(query_en)
        if mapping_en and mapping_en.get("bolna_agent_id"):
            return mapping_en["bolna_agent_id"]
            
        # 3. Absolute fallback to env var
        return os.environ.get("BOLNA_AGENT_ID", "").strip()
