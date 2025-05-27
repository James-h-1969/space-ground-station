from enum import Enum


class DataType(Enum):
    PAYLOAD_DATA = "PAYLOAD_DATA"
    WOD_DATA = "WOD_DATA"
    ATTITUDE_DATA = "ATTITUDE_DATA"

class State(Enum):
    INIT = "INIT"
    NOMINAL = "NOMINAL"
    PAYLOAD = "PAYLOAD"
    DETUMBLING = "DETUMBLING"