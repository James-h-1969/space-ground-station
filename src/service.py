from src.schemas import DataType, State
from src.models import PayloadData, WODData, AttitudeData
from src.database import db
from datetime import datetime, timezone

current_state = State.INIT
to_reset = False
reset_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def store_vals_in_db(data, data_type, time_utc):
    data_type = DataType(data_type)

    if data_type == DataType.PAYLOAD_DATA:
        new_data = PayloadData(
            timestamp=time_utc,
            spec_410nm=data[0],
            spec_435nm=data[1],
            spec_460nm=data[2],
            spec_485nm=data[3],
            spec_510nm=data[4],
            spec_535nm=data[5],
            spec_560nm=data[6],
            spec_585nm=data[7],
            spec_610nm=data[8],
            spec_645nm=data[9],
            spec_680nm=data[10],
            spec_705nm=data[11],
            spec_730nm=data[12],
            spec_760nm=data[13],
            spec_810nm=data[14],
            spec_860nm=data[15],
            spec_900nm=data[16],
            spec_940nm=data[17],
        )
    elif data_type == DataType.ATTITUDE_DATA:
        new_data = AttitudeData(
            timestamp=time_utc,
            theta=data['theta'],
            phi=data['phi'],
            sigma=data['sigma'],
            theta_dot=data['theta_dot'],
            phi_dot=data['phi_dot'],
            sigma_dot=data['sigma_dot']
        )
    elif data_type == DataType.WOD_DATA:
        new_data = WODData(
            timestamp=time_utc,
            mode=data['mode'],
            batt_voltage=data['batt_voltage'],
            batt_current=data['batt_current'],
            current_3v3_bus=data['current_3v3_bus'],
            current_5v_bus=data['current_5v_bus'],
            temp_comm=data['temp_comm'],
            temp_EPS=data['temp_EPS'],
            temp_battery=data['temp_battery']
        )

    try:
        db.session.add(new_data)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
    
def get_state():
    return current_state.value

def change_state(state):
    global current_state
    current_state = State(state)

def get_current_utc_time():
    current_utc_time = datetime.now(timezone.utc)
    utc_string = current_utc_time.strftime("%Y-%m-%d %H:%M:%S")
    return utc_string

def get_payload_data():
    try:
        latest_data = db.session.query(PayloadData).order_by(PayloadData.timestamp.desc()).first()
        
        if not latest_data:
            print("No payload data found in the database.")
            return None
        
        spectral_values = [
            latest_data.spec_410nm,
            latest_data.spec_435nm,
            latest_data.spec_460nm,
            latest_data.spec_485nm,
            latest_data.spec_510nm,
            latest_data.spec_535nm,
            latest_data.spec_560nm,
            latest_data.spec_585nm,
            latest_data.spec_610nm,
            latest_data.spec_645nm,
            latest_data.spec_680nm,
            latest_data.spec_705nm,
            latest_data.spec_730nm,
            latest_data.spec_760nm,
            latest_data.spec_810nm,
            latest_data.spec_860nm,
            latest_data.spec_900nm,
            latest_data.spec_940nm,
        ]

        ts = latest_data.timestamp

        return [ts, spectral_values]
        
    except Exception as e:
        print(f"Error retrieving payload data: {e}")
        return None

def get_wod_data():
    try:
        latest_data = db.session.query(WODData).order_by(WODData.timestamp.desc()).first()
        if not latest_data:
            print("No WOD data found in the database.")
            return None
        
        wod_values = [
            latest_data.timestamp,
            latest_data.mode,
            latest_data.batt_voltage,
            latest_data.batt_current,
            latest_data.current_3v3_bus,
            latest_data.current_5v_bus,
            latest_data.temp_comm,
            latest_data.temp_EPS,
            latest_data.temp_battery
        ]

        return wod_values
    
    except Exception as e:
        print(f"Error retrieving WOD data: {e}")
        return None

def get_to_reset():
    global to_reset 
    global reset_time
    if to_reset:
        reset_time_copy = reset_time
        to_reset = not to_reset
        reset_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return True, reset_time_copy
    return to_reset, reset_time

def change_reset(time: str) -> None:
    global to_reset
    global reset_time
    to_reset = True
    reset_time = time 
