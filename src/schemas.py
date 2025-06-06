from enum import Enum


class DataType(Enum):
    PAYLOAD_DATA = 0x0F
    WOD_DATA = 0x0E
    ATTITUDE_DATA = 0x09

class State(Enum):
    INIT = "INIT"
    NOMINAL = "NOMINAL"
    PAYLOAD = "PAYLOAD"
    DETUMBLING = "DETUMBLING"