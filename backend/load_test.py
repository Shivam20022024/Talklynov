from locust import HttpUser, task, between

class TalklyAIUser(HttpUser):
    # This simulates how long a user waits between requests (1 to 5 seconds)
    wait_time = between(1, 5)

    @task(3)
    def test_health_check(self):
        """
        Simulate a user repeatedly pinging the health check endpoint.
        This tests the raw connection limits of Uvicorn.
        """
        with self.client.get("/", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status code {response.status_code}")
