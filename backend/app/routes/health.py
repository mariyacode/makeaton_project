from flask import Blueprint
from sqlalchemy import text
from app import db

health_bp = Blueprint("health", __name__)

@health_bp.route("/api/health", methods=["GET"])
def health_check():
    try:
        db.session.execute(text("SELECT 1"))
        return {
            "status": "success",
            "message": "Flask backend connected to PostgreSQL!"
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500