import datetime
import flask
from flask import Flask, jsonify, request
from pymongo import MongoClient
from pymongo.errors import OperationFailure, PyMongoError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

conn = ""
try:
    conn = MongoClient("localhost", 27017)
    print("Connected successfully to mongoDB!!!")
except OperationFailure as e:
    print("Could not connect to MongoDB")


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "AXenN65T!lfe44deoJR"
# Pymongo database and collection
db = conn.app_database
user = db["User"]


@app.route("/register", methods=["POST"])
def register():
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
        print(password)
        user_info = dict(first_name=first_name, email=email, role=role,
                         password=generate_password_hash(password, method='sha256'))
        user.insert_one(user_info)
        token = create_access_token(identity=email, fresh=False, expires_delta=datetime.timedelta(minutes=540))
        return jsonify(message="User added successfully", token=token), 201


@app.route("/login", methods=["POST"])
def login():
    bool_login = False
    # Form request fields
    email = request.json["email"]
    password = request.json["password"]

    current_user = user.find_one({"email": email})
    identity = {"email": email}
    if current_user:
        bool_login = check_password_hash(current_user['password'], password)
    if bool_login:
        identity['role'] = current_user['role']
        # token is valid for 540 minutes = 9 hours. i.e: 8am-17am
        token = create_access_token(identity=identity, fresh=False, expires_delta=datetime.timedelta(minutes=540))
        return jsonify(message="Login Succeeded!", token=token), 200
    else:
        return jsonify(message="Bad Email or Password"), 401


@app.route("/account/<email>", methods=['GET'])
def get_profile(email):
    user_info = user.find_one({"email": email})
    profile = {
        "name": user_info['first_name'],
        "email": user_info['email'],
    }
    response = flask.jsonify(profile)
    return response


@app.route("/accounts", methods=['GET'])
@jwt_required()
def get_profiles():
    profiles = []
    identity = get_jwt_identity()
    check_ban(identity)
    users = user.find()
    for user_info in users:
        mdp = user_info['password'][:50]
        profile = {
            "email": user_info['email'],
            "name": user_info['first_name'],
            "role": user_info['role'],
            "mdp": mdp,
        }
        profiles.append(profile)

    response = flask.jsonify(profiles)
    return response


@app.route("/del_user/<email>", methods=['DELETE'])
@jwt_required()
def del_user(email):
    user.delete_one({"email": email})
    return "Deleted!", 200


@app.route("/mod_user/<email>", methods=['PUT'])
@jwt_required()
def mod_user(email):
    name = request.args.get("name")
    print("name: ", name)
    role = request.args.get("role")
    print("Role: ", role)
    password = request.args.get("password")
    password = generate_password_hash(str(password), method='sha256')
    print("Password: ", password)

    user_upd_args = {
        "first_name": name,
        "role": role,
        "password": password,
    }
    user_upd_items = {}
    for key, value in user_upd_args.items():
        if value is not None:
            print("items: ", key, ":", value)
            user_upd_items.update({key: value})
    print(user_upd_items)
    upd = {"$set": user_upd_items}
    user.update_one({"email": email}, upd)
    return "Modified!", 200


@app.route("/password", methods=['POST'])
@jwt_required()
def update_password():
    identity = get_jwt_identity()
    password = request.json["password"]
    query = {"email": identity['email']}
    new_query = {"$set": {"password": generate_password_hash(password, method='sha256')}}
    try:
        user.update_one(query, new_query)
        return jsonify(message="Password updated"), 200
    except PyMongoError as err:
        print("Pymongo error code: ", err)
        print("Error while password updating for: ", identity['email'])
        return jsonify(message="Error while password updating"), 422


db = conn.RobotData


@app.route("/get-seance/<seance_id>", methods=['GET'])
@jwt_required()
def get_seance(seance_id):
    collection = db[seance_id]
    cursor = collection.find()
    presets = []

    for record in cursor:
        preset = {
            "temp": float(record["temp"]),
            "temp2": float(record["temp2"]),
            "humidity": float(record["humidity"]),
            "pos": record["pos"],
            "human": record["human"],
            "fire": record["fire"],
            "year": record["year"],
            "month": record["month"],
            "date": record["date"],
            "hour": record["hour"],
            "minutes": record["minutes"],
            "seconds": record["seconds"]
        }
        presets.append(preset)
    response = flask.jsonify(presets)
    return response


@app.route("/session_info/<seance_id>", methods=['GET'])
@jwt_required()
def get_session_info(seance_id):
    temp = request.args.get('temp_like')
    temp2 = request.args.get('temp2_like')
    humidity = request.args.get('humidity_like')
    origin = request.args.get('origin_like')
    date = request.args.get('date_like')
    pos = request.args.get('pos_like')
    session_info_args = {
        "temp": temp,
        "temp2": temp2,
        "humidity": humidity,
        "origin": origin,
        "date": date,
        "pos": pos,
    }
    session_info_items = {}
    for key, value in session_info_args.items():
        if value is not None:
            value = str(value)
            session_info_items.update({key: {"$regex": value}})
    collection = db[seance_id]
    cursor = collection.find(session_info_items)
    presets = []
    for record in cursor:
        if record["human"] == 'y' or record["fire"] == 'y':
            origin = "Human" if record["human"] == 'y' else "Fire"
            preset = {
                "origin": origin,
                "date": record["year"] + '/' + record["month"] + '/' + record["date"] + ' '
                + record["hour"] + ':' + record["minutes"] + ':' + record["seconds"],
                "temp": float(record["temp"]),
                "temp2": float(record["temp2"]),
                "humidity": float(record["humidity"]),
                "pos": record["pos"],
            }
            presets.append(preset)
    response = flask.jsonify(presets)
    return response


@app.route("/all_sessions_man", methods=['GET'])
@jwt_required()
def all_sessions_man():
    collections_sorted_filter = []
    session_name = request.args.get('name_like')
    collections_sorted = get_all_sessions()
    if session_name is not None:
        collections_sorted = [i for i in collections_sorted if i.startswith(session_name)]
    presets = []
    for col in collections_sorted:
        collection = db[col]
        start = collection.find_one()
        end_cursor = collection.find()
        end = {}
        for end_cursor_item in end_cursor:
            end = end_cursor_item
        preset = {
            "name": col,
            "start": start["year"] + '/' + start["month"] + '/' + start["date"] + ' '
            + start["hour"] + ':' + start["minutes"] + ':' + start["seconds"],
            "end": end["year"] + '/' + end["month"] + '/' + end["date"] + ' '
            + end["hour"] + ':' + end["minutes"] + ':' + end["seconds"]
        }
        presets.append(preset)

    response = flask.jsonify(presets)
    return response


@app.route("/del-seance/<seance_id>", methods=['DELETE'])
def del_seance(seance_id):
    collection = db[seance_id]
    collection.drop()
    return "Deleted!", 200


@app.route("/mod-seance/<seance_id>/<new_seance_id>", methods=['POST'])
def mod_seance(seance_id, new_seance_id):
    collection = db[seance_id]
    collection.rename(new_seance_id)
    return "Modified!", 200


@app.route("/all-sessions", methods=['GET'])
def all_sessions():
    collections_sorted = get_all_sessions()
    response = flask.jsonify(collections_sorted)
    return response


def to_number(value):
    if '.' in value:
        return float(value)
    else:
        return int(value)


def check_ban(identity):
    if identity['role'] != "admin":
        query = {"email": identity['email']}
        new_query = {"$set": {"password": "Banned", "role": "Banned: /accounts as user"}}
        try:
            user.update_one(query, new_query)
            return jsonify(message="Sign in again please!"), 200
        except PyMongoError as err:
            print("Pymongo error code: ", err)
            print("Error while role hacking!!! password can't banned for: ", identity['email'])
            return jsonify(message="Dont get banned please!"), 422


def get_all_sessions():
    collections_sorted = []
    collections = []
    collection = db.collection_names(include_system_collections=False)
    for col in collection:
        col = col[6:]
        collections.append(int(col))
    collections.sort()
    for col in collections:
        collections_sorted.append("Seance" + str(col))
    return collections_sorted


if __name__ == "__main__":
    print('Api start ! ')
    app.run(debug=True)
