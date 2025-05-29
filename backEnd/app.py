from flask import Flask, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import shortuuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urls.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)  # Enable CORS for all domains on all routes

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    long_url = db.Column(db.String(2048), nullable=False)
    short_id = db.Column(db.String(10), unique=True, nullable=False)

@app.route('/api/shorten', methods=['POST'])
def shorten_url():
    data = request.get_json()
    long_url = data.get('url')
    if not long_url:
        return jsonify({"error": "URL is required"}), 400

    # Generate unique short ID and make sure it's unique
    short_id = shortuuid.ShortUUID().random(length=6)
    while URL.query.filter_by(short_id=short_id).first():
        short_id = shortuuid.ShortUUID().random(length=6)

    new_url = URL(long_url=long_url, short_id=short_id)
    db.session.add(new_url)
    db.session.commit()
    return jsonify(short_url=f"http://short.url/{short_id}")

@app.route('/<short_id>')
def redirect_short_url(short_id):
    url = URL.query.filter_by(short_id=short_id).first_or_404()
    return redirect(url.long_url)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
