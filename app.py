from flask import Flask
from src.database import db

app = Flask(
    __name__, template_folder="src/static/templates", static_folder="src/static"
)

# Configure the app
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///groundstation.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Register blueprints or routes
import src.routes as routes

app.register_blueprint(routes.routes_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
