from flask import Blueprint, request, jsonify, render_template
from src.models import PayloadData
from src.schemas import DataType
from src.service import store_vals_in_db

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
        return jsonify({"status": "saved into db successfully"})
    else:
        return jsonify({"status": "failed to save into db"})
