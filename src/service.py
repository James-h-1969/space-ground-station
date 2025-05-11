from src.schemas import DataType
from src.models import PayloadData
from app import db


def get_current_time():
    """TODO create a function that gets the current time as HH:MM:SS in UTC"""
    ...


def store_vals_in_db(data, data_type, time_utc):
    data_type = DataType(data_type)

    if data_type == DataType.PAYLOAD_DATA:
        new_data = PayloadData(timestamp=time_utc, data=data, id=1)
    # elif data_type == DataType.ATTITUDE_DATA:

    # elif data_type == DataType.WOD_DATA:
    #     ...

    print(new_data)

    try:
        db.session.add(new_data)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
