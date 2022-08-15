import datetime
import flask
from flask import Flask, jsonify, request
from pymongo import MongoClient
from pymongo.errors import OperationFailure, PyMongoError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import re

# DATABASE
# connection to database server (MongoDB) [PORT=27017(DEFAULT), HOST=localhost]
try:
    conn = MongoClient("localhost", 27017)
    print("Connected successfully to mongoDB!!!")
except OperationFailure as e:
    conn = ""
    print("Could not connect to MongoDB")

# Pymongo connection to database and collection
db = conn.app_database
user = db["User"]

# Initiate Flask application
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
api_prefix = "/api/v1"

# Json web token (JWT)
jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = "AXenN65T!lfe44deoJR"

# Regular expressions for injection security
email_regex = '^[a-z0-9]+[\\._]?[a-z0-9]+[@]\\w+[.]\\w{2,3}$'
password_regex = r'[A-Za-z0-9@#$%^&+=]{4,}'  # set last 4 to 8 for 8 char
name_regex = r'[A-Za-z0-9 ]{4,}'  # set last 4 to 8 for 8 char


@app.route(api_prefix + "/register", methods=["POST"])
def register():
    """
    Method to signup a user, this method receive the request body with the ``email, first_name, password``
    then check regex of body request variables, after that pymongo check if email exists and returns
    http status code 409 if that's the case.
    Else it will hash the password with sha512, and insert user data into the database, create token identity
    with [email, role] parameters, and return JSON object with message and token as response with hhtp status code 201

    :return:
        The message and token encoded as JSON with http status code 201 as Flask response.
    """
    email = request.json['email']
    if check_email_reg(email):
        return jsonify(message="Please respect email regex!"), 403
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
        if check_password_reg(password) or check_name_reg(first_name):
            return jsonify(message="Please respect regex!"), 403
        user_info = dict(first_name=first_name, email=email, role=role,
                         password=generate_password_hash(password, method='sha512'))
        user.insert_one(user_info)
        identity = {"email": email, "role": role}
        token = create_access_token(identity=identity, fresh=False, expires_delta=datetime.timedelta(minutes=540))
        return jsonify(message="User added successfully", token=token), 201


@app.route(api_prefix + "/login", methods=["POST"])
def login():
    bool_login = False
    # Form request fields
    email = request.json["email"]
    password = request.json["password"]
    if check_password_reg(password) or check_email_reg(email):
        return jsonify(message="Please respect regex!"), 403
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


# !!!!!!!!! To delete ################
@app.route(api_prefix + "/account/<email>", methods=['GET'])
def get_profile(email):
    user_info = user.find_one({"email": email})
    profile = {
        "name": user_info['first_name'],
        "email": user_info['email'],
    }
    response = flask.jsonify(profile)
    return response


@app.route(api_prefix + "/accounts", methods=['GET'])
@jwt_required()
def get_profiles():
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again and take contact with administration btw."), 422
    email = request.args.get("email_like")
    name = request.args.get("name_like")
    role = request.args.get("role_like")
    user_search_args = {
        "email": email,
        "first_name": name,
        "role": role,
    }
    user_search_items = {}
    for key, value in user_search_args.items():
        if value is not None:
            user_search_items.update({key: {"$regex": value}})
    profiles = []
    users = user.find(user_search_items)
    for user_info in users:
        mdp = user_info['password'][:20]
        profile = {
            "email": user_info['email'],
            "name": user_info['first_name'],
            "role": user_info['role'],
            "mdp": mdp,
        }
        profiles.append(profile)

    response = flask.jsonify(profiles)
    return response, 200


@app.route(api_prefix + "/mod_user/<email>", methods=['PUT'])
@jwt_required()
def mod_user(email):
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again and take contact with administration btw."), 422
    name = request.args.get("name")
    role = request.args.get("role")
    password = request.args.get("password")
    if password is not None:
        password = generate_password_hash(str(password), method='sha512')
    user_upd_args = {
        "first_name": name,
        "role": role,
        "password": password,
    }
    user_upd_items = {}
    for key, value in user_upd_args.items():
        if value is not None:
            user_upd_items.update({key: value})
    upd = {"$set": user_upd_items}
    user.update_one({"email": email}, upd)
    return "Modified!", 200


@app.route(api_prefix + "/password", methods=['POST'])
@jwt_required()
def update_password():
    identity = get_jwt_identity()
    password = request.json["password"]
    if check_password_reg(password):
        return jsonify(message="Please respect regex!"), 403
    query = {"email": identity['email']}
    new_query = {"$set": {"password": generate_password_hash(password, method='sha512')}}
    try:
        user.update_one(query, new_query)
        return jsonify(message="Password updated"), 200
    except PyMongoError as err:
        print("Pymongo error code: ", err)
        print("Error while password updating for: ", identity['email'])
        return jsonify(message="Error while password updating"), 422


@app.route(api_prefix + "/del_user/<email>", methods=['DELETE'])
@jwt_required()
def del_user(email):
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again and take contact with administration btw."), 422
    user.delete_one({"email": email})
    return "Deleted!", 200


# Sessions routes
db = conn.RobotData


@app.route(api_prefix + "/get_seance/<seance_id>", methods=['GET'])
@jwt_required()
def get_seance(seance_id):
    collection = db[seance_id]
    cursor = collection.find()
    presets = []

    for record in cursor:
        preset = {
            "temp": float(record["temp"]),
            "temp2": float(record["temp2"]),
            "ambTemp": float(record["ambTemp"]),
            "humidity": float(record["humidity"]),
            "pos": record["pos"],
            "humanProb": float(record["humanProb"]),
            "fireProb": float(record["fireProb"]),
            "origin": record["origin"],
            "year": record["year"],
            "month": record["month"],
            "date": record["date"],
            "hour": record["hour"],
            "minutes": record["minutes"],
            "seconds": record["seconds"]
        }
        presets.append(preset)
    response = flask.jsonify(presets)
    return response, 200


@app.route(api_prefix + "/session_info/<seance_id>", methods=['GET'])
@jwt_required()
def get_session_info(seance_id):
    temp = request.args.get('temp_like')
    temp2 = request.args.get('temp2_like')
    amb_temp = request.args.get('ambTemp_like')
    humidity = request.args.get('humidity_like')
    human_prob = request.args.get('humanProb_like')
    fire_prob = request.args.get('fireProb_like')
    origin = request.args.get('origin_like')
    date = request.args.get('date_like')
    pos = request.args.get('pos_like')
    session_info_args = {
        "temp": temp,
        "temp2": temp2,
        "ambTemp": amb_temp,
        "humidity": humidity,
        "humanProb": human_prob,
        "fireProb": fire_prob,
        "origin": origin,
        "datetime": date,
        "pos": pos,
    }
    session_info_items = {}
    for key, value in session_info_args.items():
        if value is not None:
            session_info_items.update({key: {"$regex": value}})
    collection = db[seance_id]
    cursor = collection.find(session_info_items)
    presets = []
    for record in cursor:
        if record["origin"] == "None":
            record["origin"] = None
        if record["origin"] is not None:
            preset = {
                "origin": record["origin"],
                "date": record["datetime"],
                "temp": float(record["temp"]),
                "temp2": float(record["temp2"]),
                "ambTemp": float(record["ambTemp"]),
                "humidity": float(record["humidity"]),
                "humanProb": float(record["humanProb"]),
                "fireProb": float(record["fireProb"]),
                "pos": record["pos"],
            }
            presets.append(preset)
    response = flask.jsonify(presets)
    return response, 200


@app.route(api_prefix + "/all_sessions_man", methods=['GET'])
@jwt_required()
def all_sessions_man():
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again, and take contact with administration btw."), 422
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
        try:
            name = start["name"]
        except Exception:
            name = ""
        print(name)
        #             "session_name": start["name"],
        for end_cursor_item in end_cursor:

            end = end_cursor_item
        preset = {
            "name": col,
            "session_name": name,
            "start": start["datetime"],
            "end": end["datetime"]
        }
        presets.append(preset)

    response = flask.jsonify(presets)
    return response, 200


@app.route(api_prefix + "/create_seance/<seance_id>", methods=['POST'])
@jwt_required()
def create_seance(seance_id):
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again and take contact with administration btw."), 422
    collection = db[seance_id]
    frame = {
        "year": "2022",
        "month": "09",
        "date": "06",
        "hour": "10",
        "minutes": "45",
        "seconds": "15",
        "datetime": "2022" + '/' + "09" + '/' + "06" + ' ' + "10" + ':' + "45" + ':' + "15",
        "temp": "23.2",
        "temp2": "22.9",
        "ambTemp": "23.8",
        "humidity": "39",
        "pos": "50.461416,3.957607",
        "humanProb": "5.4",
        "fireProb": "0",
        "human": "n",
        "fire": "n",
        "origin": "None"
    }
    collection.insert_one(frame)
    return "Created!", 200


@app.route(api_prefix + "/del_seance/<seance_id>", methods=['DELETE'])
@jwt_required()
def del_seance(seance_id):
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again and take contact with administration btw."), 422
    collection = db[seance_id]
    collection.drop()
    return "Deleted!", 200


@app.route(api_prefix + "/mod_seance/<seance_id>", methods=['POST'])
@jwt_required()
def mod_seance(seance_id):
    identity = get_jwt_identity()
    res = check_ban(identity)
    if res:
        return jsonify(message="Not authorized! Please sign in again and take contact with administration btw."), 422
    collection = db[seance_id]

    new_seance_id = request.args.get("name")
    name = request.args.get("session_name")

    if name is not None:
        session_name_upd_args = {
            "name": name,
        }
        upd = {"$set": session_name_upd_args}
        first = collection.find_one()
        collection.update_one(first, upd)

    if new_seance_id is not None:
        collection.rename(new_seance_id)
    return "Modified!", 200


@app.route(api_prefix + "/all_sessions", methods=['GET'])
@jwt_required()
def all_sessions():
    collections_sorted = get_all_sessions()
    response = flask.jsonify(collections_sorted)
    return response, 200


def to_number(value):
    if '.' in value:
        return float(value)
    else:
        return int(value)


def check_ban(identity):
    if identity['role'] != "admin":
        query = {"email": identity['email']}
        new_query = {"$set": {"password": "Banned", "role": "Banned: user is not admin!"}}
        try:
            user.update_one(query, new_query)
            return True
        except PyMongoError as err:
            print("Pymongo error code: ", err)
            print("Error while role hacking!!! password can't banned for: ", identity['email'])
            return True
    else:
        return False


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


def check_email_reg(email):
    if re.search(email_regex, email):
        return False
    else:
        return True


def check_password_reg(password):
    if re.fullmatch(password_regex, password):
        return False
    else:
        return True


def check_name_reg(name):
    if re.fullmatch(name_regex, name):
        return False
    else:
        return True


if __name__ == "__main__":
    print('Api start ! ')
    app.run(debug=True)
