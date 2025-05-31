import time
import requests
from datetime import datetime
import random
import json

def generate_fake_wod_data():
    """Generate fake WOD (Whole Orbit Data) payload for testing."""
    data = {
        "mode": random.randint(0, 3),  # Assuming 4 different modes
        "batt_voltage": round(random.uniform(3.0, 4.2), 2),  # Typical battery voltage range
        "batt_current": round(random.uniform(-2.0, 2.0), 3),  # Battery current (charging/discharging)
        "current_3v3_bus": round(random.uniform(0.1, 1.5), 3),  # 3.3V bus current
        "current_5v_bus": round(random.uniform(0.1, 2.0), 3),  # 5V bus current
        "temp_comm": round(random.uniform(-10, 60), 1),  # Communication module temp (°C)
        "temp_EPS": round(random.uniform(-5, 55), 1),  # EPS (Electrical Power System) temp (°C)
        "temp_battery": round(random.uniform(0, 45), 1)  # Battery temperature (°C)
    }
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
        payload = generate_fake_wod_data()
        response = send_data(payload, "WOD_DATA")
        print(f"Sent WOD data: {payload}")
        print(f"Response: {response.status_code} - {response.text}")
        time.sleep(5)