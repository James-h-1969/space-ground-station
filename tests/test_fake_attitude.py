import time
import requests
from datetime import datetime
import random
import json
import math

def generate_fake_attitude_data():
    """Generate fake attitude data payload for testing."""
    # Generate realistic attitude angles (in degrees, converted to radians)
    theta = random.uniform(-180, 180)  # Roll angle
    phi = random.uniform(-90, 90)      # Pitch angle  
    sigma = random.uniform(-180, 180)  # Yaw angle
    
    # Generate realistic angular velocities (degrees/second, converted to radians/second)
    theta_dot = random.uniform(-10, 10)  # Roll rate
    phi_dot = random.uniform(-10, 10)    # Pitch rate
    sigma_dot = random.uniform(-10, 10)  # Yaw rate
    
    data = {
        "theta": round(math.radians(theta), 6),      # Convert to radians
        "phi": round(math.radians(phi), 6),          # Convert to radians
        "sigma": round(math.radians(sigma), 6),      # Convert to radians
        "theta_dot": round(math.radians(theta_dot), 6),  # Convert to radians/second
        "phi_dot": round(math.radians(phi_dot), 6),      # Convert to radians/second
        "sigma_dot": round(math.radians(sigma_dot), 6)   # Convert to radians/second
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
        payload = generate_fake_attitude_data()
        response = send_data(payload, "ATTITUDE_DATA")
        print(f"Sent attitude data: {payload}")
        print(f"Response: {response.status_code} - {response.text}")
        time.sleep(5)