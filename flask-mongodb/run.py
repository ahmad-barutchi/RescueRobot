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
collections = []
collections_sorted = []
app = Flask(__name__)


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
