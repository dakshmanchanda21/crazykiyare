from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid
from db import db, Trade
from encryption import encrypt, decrypt

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trades.db'
db.init_app(app)

# ✅ Remove @app.before_first_request
# Instead, create tables at startup
# @app.before_first_request  ❌  <-- remove this
# def create_tables():
#     db.create_all()

@app.route("/buy", methods=["POST"])
def buy():
    data = request.json
    user_id = data["user_id"]
    algo = data.get("algorithm", "AES")
    asset = data.get("asset", "BTC")
    quantity = float(data.get("quantity", 1))

    c_id = f"{user_id}_{uuid.uuid4()}"
    encrypted_cid = encrypt(c_id, algo)

    trade = Trade(
        c_id=c_id,
        encrypted_cid=encrypted_cid,
        algorithm=algo,
        asset=asset,
        quantity=quantity
    )
    db.session.add(trade)
    db.session.commit()

    return jsonify({
        "c_id": c_id,
        "encrypted": encrypted_cid,
        "algorithm": algo,
        "asset": asset,
        "quantity": quantity,
        "timestamp": trade.timestamp
    })


@app.route("/sell", methods=["POST"])
def sell():
    data = request.json
    c_id = data["c_id"]
    trade = Trade.query.filter_by(c_id=c_id).first()

    if not trade or trade.status == "cached":
        return jsonify({"error": "Trade not found or already sold."}), 404

    trade.status = "cached"
    db.session.commit()
    return jsonify({"message": "Trade moved to cache."})

@app.route("/cache", methods=["GET"])
def cache():
    cached_trades = Trade.query.filter_by(status="cached").all()
    result = [{
        "c_id": t.c_id,
        "algorithm": t.algorithm,
        "timestamp": t.timestamp,
        "decrypted": decrypt(t.encrypted_cid, t.algorithm)
    } for t in cached_trades]
    return jsonify(result)

@app.route("/active", methods=["GET"])
def get_active_trades():
    trades = Trade.query.filter_by(status="active").all()
    result = [{
        "c_id": t.c_id,
        "algorithm": t.algorithm,
        "asset": t.asset,
        "quantity": t.quantity,
        "timestamp": t.timestamp
    } for t in trades]
    return jsonify(result)


if __name__ == "__main__":
    with app.app_context():
        print("🔥 Dropping all tables...")
        db.drop_all()
        print("✅ Recreating all tables...")
        db.create_all()
    app.run(debug=True)
