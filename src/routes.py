from flask import Blueprint, request, jsonify

routes_bp = Blueprint('routes_bp', __name__)

@routes_bp.route("/data", methods=["POST"])
def receive_data():
    data = request.get_json()
    store.update_data(data)
    return jsonify({"status":"success"})

@routes_bp.route('/api/payload_data')
def get_payload_data():
    if store.get_data():
        return jsonify(store.get_data()[-1]["payload_data"])
    else:
        return []
    
@routes_bp.route('/api/wod_data')
def get_wod_data():
    if store.get_data():
        return jsonify(store.get_data()[-1]["wod_data"])
    else:
        return []

@routes_bp.route('/api/status')
def status():
    return jsonify({"connected": store.is_connected()})