import os
import hmac
import hashlib
import json
import uuid
import base64
from typing import Dict, Any, Tuple
import requests

class CashfreeProvider:
    def __init__(self):
        self.app_id = os.environ.get("CASHFREE_APP_ID")
        self.secret_key = os.environ.get("CASHFREE_SECRET_KEY")
        self.env = os.environ.get("CASHFREE_ENVIRONMENT", "SANDBOX").upper()
        
        if self.env == "PRODUCTION":
            self.base_url = "https://api.cashfree.com/pg"
        else:
            self.base_url = "https://sandbox.cashfree.com/pg"
            
        self.api_version = "2023-08-01"

    def is_configured(self) -> bool:
        return bool(self.app_id and self.secret_key and self.app_id != "YOUR_CASHFREE_APP_ID_HERE")

    def _get_headers(self) -> Dict[str, str]:
        return {
            "x-client-id": self.app_id,
            "x-client-secret": self.secret_key,
            "x-api-version": self.api_version,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    def create_order(self, amount: float, currency: str = "INR", receipt_id: str = None, notes: Dict[str, str] = None, customer_details: Dict[str, str] = None) -> Dict[str, Any]:
        if not self.is_configured():
            # For testing without keys, return a mock order
            return {
                "id": f"mock_order_{uuid.uuid4().hex[:10]}",
                "payment_session_id": "mock_session_id",
                "amount": amount,
                "currency": currency,
                "status": "created",
                "notes": notes or {}
            }

        order_id = receipt_id or f"order_{uuid.uuid4().hex[:12]}"
        
        customer = customer_details or {
            "customer_id": f"cust_{uuid.uuid4().hex[:8]}",
            "customer_phone": "9999999999"
        }
        
        if "customer_id" not in customer:
            customer["customer_id"] = f"cust_{uuid.uuid4().hex[:8]}"
        if "customer_phone" not in customer:
            customer["customer_phone"] = "9999999999"

        payload = {
            "order_amount": amount,
            "order_currency": currency,
            "order_id": order_id,
            "order_tags": notes or {},
            "customer_details": customer
        }
        
        response = requests.post(
            f"{self.base_url}/orders",
            headers=self._get_headers(),
            json=payload,
            timeout=10
        )
        
        if not response.ok:
            raise Exception(f"Failed to create Cashfree order: {response.text}")
            
        data = response.json()
        return {
            "id": data.get("order_id"),
            "payment_session_id": data.get("payment_session_id"),
            "amount": data.get("order_amount"),
            "currency": data.get("order_currency"),
            "status": data.get("order_status"),
            "notes": data.get("order_tags", {})
        }

    def fetch_order(self, order_id: str) -> Dict[str, Any]:
        if not self.is_configured():
             return {"order_status": "PAID", "order_amount": 1000}
             
        response = requests.get(
            f"{self.base_url}/orders/{order_id}",
            headers=self._get_headers(),
            timeout=10
        )
        if not response.ok:
             raise Exception(f"Failed to fetch order: {response.text}")
        return response.json()

    def verify_webhook_signature(self, payload_body: str, signature: str, timestamp: str) -> bool:
        if not self.is_configured():
            return True # Mock
            
        # Cashfree signature logic: timestamp + body
        data_to_verify = f"{timestamp}{payload_body}"
        
        generated_signature = base64.b64encode(
            hmac.new(
                self.secret_key.encode(),
                data_to_verify.encode(),
                hashlib.sha256
            ).digest()
        ).decode()
        
        return hmac.compare_digest(generated_signature, signature)

payment_provider = CashfreeProvider()
