from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    from app import models
    CORS(app)
    from app.routes.products import products_bp
    app.register_blueprint(products_bp)


    from app.routes.health import health_bp
    app.register_blueprint(health_bp)
    from app.routes.customers import customers_bp
    app.register_blueprint(customers_bp)     

    return app