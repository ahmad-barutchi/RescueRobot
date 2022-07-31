import pymongo
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from pymongo import MongoClient

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")
# database
db = client["app_database"]
# collection
user = db["User"]

app = Flask(__name__)
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "this-is-secret-key"


@app.route("/dashboard")
@jwt_required
def dashboard():
    return jsonify(message="Welcome! to the Data Science Learner")


@app.route("/register", methods=["POST"])
def register():
    print(request.json)
    print("/register API")
    email = request.json['email']
    print(email)
    # test = User.query.filter_by(email=email).first()
    test = user.find_one({"email": email})
    if test:
        return jsonify(message="User Already Exist"), 409
    else:
        first_name = request.json["fullName"]
        print(first_name)
        password = request.json["password"]
        print(password)
        user_info = dict(first_name=first_name, email=email, password=password)
        user.insert_one(user_info)
        return jsonify(message="User added sucessfully"), 201


@app.route("/login", methods=["POST"])
def login():
    if request.is_json:
        email = request.json["email"]
        password = request.json["password"]
    else:
        email = request.json["email"]
        password = request.json["password"]

    test = user.find_one({"email": email, "password": password})
    if test:
        token = create_access_token(identity=email)
        return jsonify(message="Login Succeeded!", token=token), 200
    else:
        return jsonify(message="Bad Email or Password"), 401


if __name__ == '__main__':
    app.run(host="localhost", debug=True)
