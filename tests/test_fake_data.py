import time
import requests
from datetime import datetime
import random
import json

def generate_fake_payload():
    """Generate a fake payload for testing."""
    data = [random.randint(1, 100) for _ in range(10)]
    return json.dumps(data)


def generate_timestamp():
    """Generate a timestamp for the payload."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def send_data(data, data_type, time_utc=None):
    url = "http://127.0.0.1:5000/data"
    headers = {
        "Content-Type": "application/json",
    }
    if time_utc is None:
        time_utc = generate_timestamp()
    
    response = requests.post(
        url, 
        json={"data": data, "data_type": data_type, "time_utc": time_utc}, 
        headers=headers
    )
    return response


if __name__ == "__main__":
    while True:
        # Generate fake data
        payload = generate_fake_payload()
        
        # Send the data
        response = send_data(payload, "PAYLOAD_DATA")
        
        # Print the response
        print(f"Sent data: {payload}, Response: {response.__dict__}")
        
        # Wait for a while before sending the next batch
        time.sleep(5)