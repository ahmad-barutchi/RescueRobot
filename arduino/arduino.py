from pymongo import MongoClient
import serial
import time
from datetime import datetime

device = 'COM3'  # this will have to be changed to the serial port you are using
try:
    print("Trying...", device)
    arduino = serial.Serial(device, 9600)
except Exception as e:
    arduino = ""
    print("Failed to connect on", device, ", Error: ", e)

try:
    conn = MongoClient("localhost", 27017)
    print("Connected successfully to mongoDB!!!")
except Exception as e:
    conn = ""
    print("Could not connect to MongoDB", e)

# database
db = conn.RobotData

# Created or Switched to collection names: my_gfg_collection
collections = []
collection = db.collection_names(include_system_collections=False)
if not collection:
    coll = "Seance1"
    print("Seance1 created")
else:
    for col in collection:
        col = col[6:]
        collections.append(int(col))
    print(collections)
    next_session = int(max(collections)) + 1
    next_session = str(next_session)
    coll = "Seance" + next_session
    print("collection on MongoDB: ", coll)

collection_db = db[coll]
frame = {}
year = 0
month = 0
date = 0
hour = 0
minutes = 0
seconds = 0

try:
    for x in range(555):
        time.sleep(1)
        data = arduino.readline()  # read the data from the arduino
        data = data[0:-2]
        data = data.decode('ascii')
        if '\\x' in data:
            print("corrupted data!! bytes or bytearray")
            break
        pieces = data.split(" ")  # split the data by the space
        print(pieces)
        if (None or '') in pieces or len(pieces) < 9 or len(pieces) > 9:
            print("corrupted data!!")
            break

        tm = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        year = tm[0:4]
        month = tm[5:7]
        date = tm[8:10]
        hour = tm[11:13]
        minutes = tm[14:16]
        seconds = tm[17:19]
        if pieces[7] == 'y' or pieces[8] == 'y':
            origin = "Human" if pieces[7] == 'y' else "Fire"
        else:
            origin = "None"
        pieces[0] = float(pieces[0])
        pieces[1] = float(pieces[1])
        pieces[2] = float(pieces[2])
        pieces[3] = float(pieces[3])
        pieces[5] = float(pieces[5])
        pieces[6] = float(pieces[6])
        frame = {
            "year": year,
            "month": month,
            "date": date,
            "hour": hour,
            "minutes": minutes,
            "seconds": seconds,
            "datetime": year + '/' + month + '/' + date + ' ' + hour + ':' + minutes + ':' + seconds,
            "temp": pieces[0],
            "temp2": pieces[1],
            "ambTemp": pieces[2],
            "humidity": pieces[3],
            "pos": pieces[4],
            "humanProb": pieces[5],
            "fireProb": pieces[6],
            "human": pieces[7],
            "fire": pieces[8],
            "origin": origin
        }
        # Here we are going to insert the data into the Database
        try:
            rec = collection_db.insert_one(frame)
        except Exception as e:
            print("Pymongo insert one got error: ", e)
except serial.SerialException as e:
    print("Failed to get data from Arduino! Error: ", e)
