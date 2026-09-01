from typing import Dict, Any

class TransferService:
    """
    Handles transferring calls to human agents.
    """
    
    def evaluate_transfer_need(self, analysis_result: Dict[str, Any]) -> bool:
        """
        Evaluates the AI's analysis to decide if a transfer is needed.
        Triggers if sentiment is very negative, intent is complex, or explicit request.
        """
        sentiment = analysis_result.get("sentiment", "Neutral").lower()
        intent = analysis_result.get("intent_label", "").lower()
        
        if sentiment in ["angry", "frustrated", "highly negative"]:
            return True
            
        if "human" in intent or "transfer" in intent or "escalate" in intent:
            return True
            
        # Check explicit flags
        if analysis_result.get("requires_human_intervention") is True:
            return True
            
        return False
        
    def generate_transfer_context(self, call_doc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates the context payload to be sent to the human agent's dashboard.
        """
        return {
            "call_id": call_doc.get("call_id"),
            "customer_name": call_doc.get("customer_name"),
            "customer_id": call_doc.get("customer_id"),
            "summary": call_doc.get("summary", "No summary yet."),
            "sentiment": call_doc.get("sentiment", "Unknown"),
            "language": call_doc.get("language", "English"),
            "transcript_snippet": call_doc.get("transcript", "")[-500:], # last 500 chars
            "reason": "AI Confidence Low or Escalation Requested"
        }
