import time
import requests
from datetime import datetime
import random
import json


def generate_fake_payload():
    """Generate a fake payload for testing."""
    data = [random.randint(1, 100) for _ in range(18)]
    return data


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
        headers=headers,
    )
    return response


if __name__ == "__main__":
    while True:
        payload = generate_fake_payload()
        response = send_data(payload, 0x0F)
        print(f"Sent data: {payload}, Response: {response.__dict__}")
        time.sleep(1)
