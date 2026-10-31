
from flask import Blueprint, request, jsonify
from app import db
from app.models import Customer

customers_bp = Blueprint("customers", __name__)


# GET: Fetch all customers
@customers_bp.route("/api/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.order_by(Customer.id.desc()).all()

    return jsonify([
        {
            "id": c.id,
            "company_name": c.company_name,
            "contact_person": c.contact_person,
            "email": c.email,
            "phone": c.phone,
            "address": c.address,
            "tax_number": c.tax_number,
            "user_id": c.user_id
        }
        for c in customers
    ]), 200


# GET: Fetch one customer
@customers_bp.route("/api/customers/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    customer = db.session.get(Customer, customer_id)

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    return jsonify({
        "id": customer.id,
        "company_name": customer.company_name,
        "contact_person": customer.contact_person,
        "email": customer.email,
        "phone": customer.phone,
        "address": customer.address,
        "tax_number": customer.tax_number,
        "user_id": customer.user_id
    }), 200


# POST: Create customer
@customers_bp.route("/api/customers", methods=["POST"])
def create_customer():
    data = request.get_json(silent=True) or {}

    required = ["company_name", "email"]

    if any(not data.get(field) for field in required):
        return jsonify({
            "error": "company_name and email are required"
        }), 400

    customer = Customer(
        company_name=data["company_name"],
        contact_person=data.get("contact_person"),
        email=data["email"],
        phone=data.get("phone"),
        address=data.get("address"),
        tax_number=data.get("tax_number"),
        user_id=data.get("user_id")
    )

    try:
        db.session.add(customer)
        db.session.commit()

        return jsonify({
            "message": "Customer created successfully",
            "id": customer.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# PUT: Update customer
@customers_bp.route("/api/customers/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    customer = db.session.get(Customer, customer_id)

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    data = request.get_json(silent=True) or {}

    fields = [
        "company_name", "contact_person", "email",
        "phone", "address", "tax_number", "user_id"
    ]

    for field in fields:
        if field in data:
            setattr(customer, field, data[field])

    try:
        db.session.commit()
        return jsonify({"message": "Customer updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE: Delete customer
@customers_bp.route("/api/customers/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    customer = db.session.get(Customer, customer_id)

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    try:
        db.session.delete(customer)
        db.session.commit()

        return jsonify({"message": "Customer deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Cannot delete customer. Related records may exist."
        }), 400
