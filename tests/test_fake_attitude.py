import time
import requests
from datetime import datetime
import random
import json
import math

def generate_fake_attitude_data():
    """Generate fake attitude data payload for testing."""
    # Generate realistic attitude angles (in degrees, converted to radians)
    phi = random.uniform(-180, 180)  # Roll angle
    theta = random.uniform(-90, 90)      # Pitch angle  
    psi = random.uniform(-180, 180)  # Yaw angle
    
    # Generate realistic angular velocities (degrees/second, converted to radians/second)
    phi_dot = random.uniform(-10, 10)  # Roll rate
    theta_dot = random.uniform(-10, 10)    # Pitch rate
    psi_dot = random.uniform(-10, 10)  # Yaw rate
    
    data = {
        "phi": phi,      
        "theta": theta,          
        "psi": psi,     
        "phi_dot": phi_dot,  
        "theta_dot": theta_dot,      
        "psi_dot": psi_dot  
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
        response = send_data(payload, 0x09)
        print(f"Sent attitude data: {payload}")
        print(f"Response: {response.status_code} - {response.text}")
        time.sleep(2)