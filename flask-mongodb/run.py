import flask
from flask import Flask, jsonify, request
from pymongo import MongoClient
from pymongo.errors import OperationFailure
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token

try:
    conn = MongoClient("localhost", 27017)
    print("Connected successfully to mongoDB!!!")
except OperationFailure as e:
    print("Could not connect to MongoDB")


app = Flask(__name__)
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "AXenonON65T!lfe44deoJR"


@app.route("/register", methods=["POST"])
def register():
    # database
    db = conn.app_database
    # collection
    user = db["User"]
    email = request.json['email']
    admin = user.find_one()
    role = "user"
    if not admin:
        role = "admin"
    test = user.find_one({"email": email})
    if test:
        return jsonify(message="User Already Exist"), 409
    else:
        first_name = request.json["fullName"]
        password = request.json["password"]
        user_info = dict(first_name=first_name, email=email, role=role,
                         password=generate_password_hash(password, method='sha256'))
        user.insert_one(user_info)
        return jsonify(message="User added sucessfully"), 201


@app.route("/login", methods=["POST"])
def login():
    bool_login = False
    # database
    db = conn.app_database
    # collection
    user = db["User"]
    if request.is_json:
        email = request.json["email"]
        password = request.json["password"]
    else:
        email = request.json["email"]
        password = request.json["password"]

    test = user.find_one({"email": email})

    if test:
        bool_login = check_password_hash(test['password'], password)
    if bool_login:
        token = create_access_token(identity=email)
        return jsonify(message="Login Succeeded!", token=token), 200
    else:
        return jsonify(message="Bad Email or Password"), 401


@app.route("/account/<email>", methods=['GET'])
def get_profile(email):
    profile = {}
    # database
    db = conn.app_database
    # collection
    user = db["User"]
    user_info = user.find_one({"email": email})
    profile = {
        "name": user_info['first_name'],
        "email": user_info['email'],
    }
    response = flask.jsonify(profile)
    return response


@app.route("/get-seance/<seance_id>", methods=['GET'])
def get_seance(seance_id):
    db = conn.RobotData
    collection = db[seance_id]
    cursor = collection.find()
    valeur = []
    for record in cursor:
        valeur.append(record["temp"])
        valeur.append(record["temp2"])
        valeur.append(record["humidity"])
        valeur.append(record["pos"])
        valeur.append(record["human"])
        valeur.append(record["fire"])
        valeur.append(record["year"])
        valeur.append(record["month"])
        valeur.append(record["date"])
        valeur.append(record["hour"])
        valeur.append(record["minutes"])
        valeur.append(record["seconds"])
    i = 0
    count = 0
    items = len(valeur)
    items /= 12
    items = int(items)
    items = range(0, items)

    presets = {}
    for item in items:
        preset = {
            "temp": float(valeur[i + 0]),
            "temp2": float(valeur[i + 1]),
            "humidity": float(valeur[i + 2]),
            "pos": valeur[i + 3],
            "human": valeur[i + 4],
            "fire": valeur[i + 5],
            "year": valeur[i + 6],
            "month": valeur[i + 7],
            "date": valeur[i + 8],
            "hour": valeur[i + 9],
            "minutes": valeur[i + 10],
            "seconds": valeur[i + 11]
        }
        presets[count] = preset
        i += 12
        count += 1
    response = flask.jsonify(presets)
    return response


@app.route("/del-seance/<seance_id>", methods=['DELETE'])
def del_seance(seance_id):
    db = conn.RobotData
    collection = db[seance_id]
    collection.drop()
    return "Deleted!", 200


@app.route("/mod-seance/<seance_id>/<new_seance_id>", methods=['POST'])
def mod_seance(seance_id, new_seance_id):
    db = conn.RobotData
    collection = db[seance_id]
    collection.rename(new_seance_id)
    return "Modified!", 200


@app.route("/all-sessions", methods=['GET'])
def all_sessions():
    db = conn.RobotData
    collections_sorted = []
    collections = []
    collection = db.collection_names(include_system_collections=False)
    for col in collection:
        col = col[6:]
        collections.append(int(col))
    collections.sort()
    for col in collections:
        collections_sorted.append("Seance" + str(col))
    response = flask.jsonify(collections_sorted)
    return response


if __name__ == "__main__":
    print('Api start ! ')
    app.run(debug=True)
