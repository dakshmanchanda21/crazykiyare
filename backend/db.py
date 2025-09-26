from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    c_id = db.Column(db.String(255), unique=True)
    encrypted_cid = db.Column(db.Text)
    algorithm = db.Column(db.String(10))
    asset = db.Column(db.String(20))          # <-- new
    quantity = db.Column(db.Float)            # <-- new
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(10), default='active')  # active / cached
