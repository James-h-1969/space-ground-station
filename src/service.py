from src.schemas import DataType
from src.models import PayloadData
from src.database import db
from datetime import datetime


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
    # elif data_type == DataType.ATTITUDE_DATA: TODO. write new data for these 

    # elif data_type == DataType.WOD_DATA:
    #     ...

    try:
        db.session.add(new_data)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
