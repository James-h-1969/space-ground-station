from src.database import db
import json


class PayloadData(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.String(64), nullable=False)

    # Sensor values across different wavelengths
    spec_410nm = db.Column(db.Float, nullable=False)  # A
    spec_435nm = db.Column(db.Float, nullable=False)  # B
    spec_460nm = db.Column(db.Float, nullable=False)  # C
    spec_485nm = db.Column(db.Float, nullable=False)  # D
    spec_510nm = db.Column(db.Float, nullable=False)  # E
    spec_535nm = db.Column(db.Float, nullable=False)  # F
    spec_560nm = db.Column(db.Float, nullable=False)  # G
    spec_585nm = db.Column(db.Float, nullable=False)  # H
    spec_610nm = db.Column(db.Float, nullable=False)  # R
    spec_645nm = db.Column(db.Float, nullable=False)  # I
    spec_680nm = db.Column(db.Float, nullable=False)  # S
    spec_705nm = db.Column(db.Float, nullable=False)  # J
    spec_730nm = db.Column(db.Float, nullable=False)  # T
    spec_760nm = db.Column(db.Float, nullable=False)  # U
    spec_810nm = db.Column(db.Float, nullable=False)  # V
    spec_860nm = db.Column(db.Float, nullable=False)  # W
    spec_900nm = db.Column(db.Float, nullable=False)  # K
    spec_940nm = db.Column(db.Float, nullable=False)  # L

    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "spec_410nm": self.spec_410nm,
            "spec_435nm": self.spec_435nm,
            "spec_460nm": self.spec_460nm,
            "spec_485nm": self.spec_485nm,
            "spec_510nm": self.spec_510nm,
            "spec_535nm": self.spec_535nm,
            "spec_560nm": self.spec_560nm,
            "spec_585nm": self.spec_585nm,
            "spec_610nm": self.spec_610nm,
            "spec_645nm": self.spec_645nm,
            "spec_680nm": self.spec_680nm,
            "spec_705nm": self.spec_705nm,
            "spec_730nm": self.spec_730nm,
            "spec_760nm": self.spec_760nm,
            "spec_810nm": self.spec_810nm,
            "spec_860nm": self.spec_860nm,
            "spec_900nm": self.spec_900nm,
            "spec_940nm": self.spec_940nm,
        }
    
class WODData(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.String(64), nullable=False)

    mode = db.Column(db.Integer, nullable=False)
    batt_voltage = db.Column(db.Float, nullable=False)
    batt_current = db.Column(db.Float, nullable=False)
    current_3v3_bus = db.Column(db.Float, nullable=False)
    current_5v_bus = db.Column(db.Float, nullable=False)

    temp_comm = db.Column(db.Float, nullable=False)
    temp_EPS = db.Column(db.Float, nullable=False)
    temp_battery = db.Column(db.Float, nullable=False)

class AttitudeData(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.String(64), nullable=False)

    phi = db.Column(db.Float, nullable=False)
    theta = db.Column(db.Float, nullable=False)
    psi = db.Column(db.Float, nullable=False)

    phi_dot = db.Column(db.Float, nullable=False)
    theta_dot = db.Column(db.Float, nullable=False)
    psi_dot = db.Column(db.Float, nullable=False)
