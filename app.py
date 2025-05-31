from flask import Flask
from src.database import db

app = Flask(
    __name__, template_folder="src/static/templates", static_folder="src/static"
)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///groundstation.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

from src.routes import routes_bp

app.register_blueprint(routes_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)
