import random
import uuid
import requests
from locust import HttpUser, task, between, events

# Global variable to hold our single JWT token for all virtual users
GLOBAL_TEST_TOKEN = None

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """
    This runs exactly ONCE before the load test starts.
    We will create one test user and get one token to share across all 500 users.
    This prevents us from load-testing the authentication endpoints.
    """
    global GLOBAL_TEST_TOKEN
    
    # We must construct the host URL manually here since the client isn't fully initialized
    host = environment.host or "http://localhost:8002"
    email = f"loadtest_shared_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    
    print(f"Creating shared test user: {email}")
    
    # Register single user
    requests.post(f"{host}/api/v1/auth/register", json={
        "name": "Shared Load Test User",
        "company_name": "Load Testing Inc",
        "email": email,
        "password": password
    })
    
    # Log in to get the token
    login_response = requests.post(f"{host}/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    
    if login_response.status_code == 200:
        GLOBAL_TEST_TOKEN = login_response.json().get("access_token")
        print("Successfully acquired shared JWT token for load testing.")
    else:
        print(f"CRITICAL ERROR: Failed to get shared token! {login_response.text}")


class TalklyAILoadUser(HttpUser):
    wait_time = between(1, 5)

    @task(3)
    def fetch_calls(self):
        """
        Simulate a user refreshing their dashboard and fetching their calls.
        """
        if not GLOBAL_TEST_TOKEN:
            return
            
        headers = {"Authorization": f"Bearer {GLOBAL_TEST_TOKEN}"}
        
        with self.client.get("/calls?limit=50", headers=headers, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch calls: {response.status_code}")

    @task(1)
    def fetch_analytics(self):
        """
        Simulate a user checking the analytics dashboard.
        """
        if not GLOBAL_TEST_TOKEN:
            return
            
        headers = {"Authorization": f"Bearer {GLOBAL_TEST_TOKEN}"}
        
        with self.client.get("/api/v1/analytics/dashboard", headers=headers, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch analytics: {response.status_code}")
