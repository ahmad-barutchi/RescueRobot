import flask
from flask import Flask
from pymongo import MongoClient

try:
    conn = MongoClient("localhost", 27017)
    print("Connected successfully to mongoDB!!!")
except:
    print("Could not connect to MongoDB")

# database
db = conn.RobotData

# Created or Switched to collection names: my_gfg_collection
collection = db.Seance3

app = Flask(__name__)


@app.route("/get-temp", methods=['GET'])
def get_temp():
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


@app.route("/get-seance/<seance_id>", methods=['GET'])
def get_seance(seance_id):
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


@app.route("/all-sessions", methods=['GET'])
def all_sessions():
    collection = db.collection_names(include_system_collections=False)
    print(collection)
    response = flask.jsonify(collection)
    return response


if __name__ == "__main__":
    print('Api start ! ')
    app.run(debug=True)

