import flask
from flask import Flask
from pymongo import MongoClient
import serial
import time
from flask_cors import CORS, cross_origin

device = 'COM3'  # this will have to be changed to the serial port you are using
try:
    print("Trying...", device)
    arduino = serial.Serial(device, 9600)
except:
    print("Failed to connect on", device)

try:
    conn = MongoClient("localhost", 1156)
    print("Connected successfully to mongoDB!!!")
except:
    print("Could not connect to MongoDB")

# database
db = conn.RobotData

# Created or Switched to collection names: my_gfg_collection
collection = db.Data
frame = {}

try:
    for x in range(3):
        time.sleep(1)
        data = arduino.readline()  # read the data from the arduino
        data = data[0:-2]
        data = data.decode('ascii')
        pieces = data.split(" ")  # split the data by the space
        print(pieces)
        frame = {
            "temp": pieces[0],
            "temp2": pieces[1],
            "humidity": pieces[2],
            "pos": pieces[3],
            "human": pieces[4],
            "fire": pieces[5]
        }
        # Here we are going to insert the data into the Database
        try:
            rec = collection.insert_one(frame)
        except Exception as e:
            print("An exception occurred ::", e)
except:
    print("Failed to get data from Arduino!")

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, resources={r"/get-temp": {"origins": "http://localhost:5000"}})


@cross_origin(origin='http://localhost:*',headers=['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Accept', 'Accept-Language', 'X-Authorization'])
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
    i = 0
    y = len(valeur)
    y /= 6
    y = int(y)
    y = range(0, y)

    presets = {}
    for x in y:
        preset = {
            "temp": valeur[i + 0],
            "temp2": valeur[i + 1],
            "humidity": valeur[i + 2],
            "pos": valeur[i + 3],
            "human": valeur[i + 4],
            "fire": valeur[i + 5]
        }
        presets[i] = preset
        i += 1
    print("presets")
    print(presets)
    response = flask.jsonify(presets)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    print('Api start ! ')
    app.run(debug=True)
