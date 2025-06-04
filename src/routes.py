from flask import Blueprint, request, jsonify, render_template
from src.models import PayloadData
from src.schemas import DataType
from src.service import store_vals_in_db, get_state, change_state, get_current_utc_time, get_payload_data, get_to_reset, change_reset, get_wod_data, get_attitude_data

routes_bp = Blueprint("routes_bp", __name__)


@routes_bp.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@routes_bp.route("/data", methods=["POST"])
def receive_data():
    time_utc = request.json.get("time_utc")
    data = request.json.get("data")
    data_type = request.json.get("data_type")

    if not data or not data_type or not time_utc:
        return jsonify({"error": "Missing data or data_type"}), 400

    try:
        DataType(data_type)
    except ValueError:
        return jsonify({"error": "Invalid data type"}), 400

    if store_vals_in_db(data, data_type, time_utc):
        return jsonify({"status": "saved into db successfully"}), 200
    else:
        return jsonify({"status": "failed to save into db"}), 400
    
@routes_bp.route("/state", methods=["GET"])
def get_current_state():
    print("Request received! Getting state!")
    return jsonify({"status":"success", "state":get_state()}), 200

@routes_bp.route("/state", methods=["POST"])
def change_current_state():
    data = request.get_json()
    if "state" in data:
        change_state(data["state"])
        return jsonify({"message": "Number updated"}), 200
    return jsonify({"error": "No value provided"}), 400

@routes_bp.route("/utc_time", methods=["GET"])
def get_utc_time():
    return jsonify({"status":"success", "utc_time":get_current_utc_time()})

@routes_bp.route("/payload", methods=["GET"])
def get_most_recent_payload():
    payload_data = get_payload_data()
    return jsonify({"status":"success", "payload_data":payload_data})

@routes_bp.route("/to_reset", methods=["GET"])
def to_reset():
    to_reset, reset_time = get_to_reset()
    return jsonify({"status":"success", "to_reset":to_reset, "reset_time":reset_time}), 200

@routes_bp.route("/to_reset", methods=["POST"])
def change_to_reset():
    data = request.get_json()

    if "time" in data:
        change_reset(data["time"])
        return jsonify({"message":"to reset successfully changed"})
    return jsonify({"error": "No value provided"}), 400

@routes_bp.route("/wod", methods=["GET"])
def get_most_recent_wod():
    wod_data = get_wod_data()
    return jsonify({"status":"success", "WOD_data":wod_data})

@routes_bp.route("/attitude", methods=["GET"])
def get_most_recent_attitude():
    attitude_data = get_attitude_data()
    return jsonify({"status":"success", "attitude_data":attitude_data})