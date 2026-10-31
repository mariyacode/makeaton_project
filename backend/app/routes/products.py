
from flask import Blueprint, request, jsonify
from app import db
from app.models import Product

products_bp = Blueprint("products", __name__)


def product_json(p):
    return {
        "id": p.id,
        "name": p.name,
        "product_type": p.product_type,
        "sales_price": float(p.sales_price),
        "cost_price": float(p.cost_price),
        "description": p.description,
        "is_active": p.is_active
    }


# GET all products
@products_bp.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.order_by(Product.id.desc()).all()
    return jsonify([product_json(p) for p in products]), 200


# GET product by ID
@products_bp.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(product_json(product)), 200


# CREATE product
@products_bp.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json(silent=True) or {}

    if not data.get("name") or not data.get("product_type") or data.get("sales_price") is None:
        return jsonify({
            "error": "name, product_type and sales_price are required"
        }), 400

    product = Product(
        name=data["name"],
        product_type=data["product_type"],
        sales_price=data["sales_price"],
        cost_price=data.get("cost_price", 0),
        description=data.get("description"),
        is_active=data.get("is_active", True)
    )

    try:
        db.session.add(product)
        db.session.commit()
        return jsonify({
            "message": "Product created successfully",
            "id": product.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# UPDATE product
@products_bp.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json(silent=True) or {}

    fields = [
        "name", "product_type", "sales_price",
        "cost_price", "description", "is_active"
    ]

    for field in fields:
        if field in data:
            setattr(product, field, data[field])

    try:
        db.session.commit()
        return jsonify({"message": "Product updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE product
@products_bp.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({
            "error": "Cannot delete product because it may be linked to plans or subscriptions."
        }), 400
