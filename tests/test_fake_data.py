import requests
import time
from datetime import datetime
import random

payload_data = [10, 10, 10, 13, 15, 30, 70, 80, 60, 30, 10, 15, 15, 20, 25, 15, 10, 5]
initial_payload = payload_data.copy()

def generate_payload(prev_payload, counter):
    payload_data = [max(data + random.randint(-10, 10), 0) for data in prev_payload] if counter < 13 else initial_payload
    return payload_data

wod_data = {
    "bat-voltage":4.1,
    "bat-current":2.0,
    "3v3-current":2.3,
    "5v-current":4.1,
    "comm-temp":30,
    "eps-temp":25,
    "batt-temp":25,
}
initial_wod = wod_data.copy()

def generate_wod_data(prev_wod, counter):
    wod_data = {
        "bat-voltage": prev_wod["bat-voltage"] - 0.001,
        "bat-current": prev_wod["bat-current"] + float(random.randint(-1, 1))/10,
        "3v3-current": prev_wod["3v3-current"] + float(random.randint(-1, 1))/10,
        "5v-current": prev_wod["5v-current"] + float(random.randint(-1, 1))/10,
        "comm-temp": prev_wod["comm-temp"] + float(random.randint(-1, 1))/10,
        "eps-temp": prev_wod["eps-temp"] + float(random.randint(-1, 1))/10,
        "batt-temp": prev_wod["batt-temp"] + float(random.randint(-1, 1))/10,
    }
    return wod_data

counter = 0

while True:
    # update the counter
    counter += 1
    if counter > 15:
        counter = 0

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # generate all the variables
    payload_data = generate_payload(payload_data, counter)
    wod_data = generate_wod_data(wod_data, counter)

    data = {"timestamp":current_time,
            "payload_data": payload_data,
            "wod_data": wod_data} 
    
    try:
        requests.post("http://127.0.0.1:5000/data", json=data)
        print("Sent data:", data)
    except Exception as e:
        print("Failed to send:", e)

    time.sleep(2)

