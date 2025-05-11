from flask import Flask, render_template, Blueprint

import src.routes as routes

app = Flask(__name__, template_folder="src/static/templates", static_folder='src/static',)

# register routes
app.register_blueprint(routes.routes_bp)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)

