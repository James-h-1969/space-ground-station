from src.schemas import DataType, State
from src.models import PayloadData, WODData, AttitudeData
from src.database import db
from datetime import datetime, timezone

current_state = State.INIT

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
