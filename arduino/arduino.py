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
    collection = db["Seance1"]
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
    for x in range(350):
        time.sleep(1)
        data = arduino.readline()  # read the data from the arduino
        data = data[0:-2]
        data = data.decode('ascii')
        pieces = data.split(" ")  # split the data by the space
        print(len(pieces))
        print(pieces)
        if (None or '') in pieces or len(pieces) < 6:
            print("corrupted data!!!!!!!!")
            break

        tm = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        year = tm[0:4]
        month = tm[5:7]
        date = tm[8:10]
        hour = tm[11:13]
        minutes = tm[14:16]
        seconds = tm[17:19]
        print(year, month, date, hour, minutes, seconds)
        if pieces[4] == 'y' or pieces[5] == 'y':
            origin = "Human" if pieces[4] == 'y' else "Fire"
        else:
            origin = "None"
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
            "humidity": pieces[2],
            "pos": pieces[3],
            "human": pieces[4],
            "fire": pieces[5],
            "origin": origin
        }
        # Here we are going to insert the data into the Database
        try:
            rec = collection_db.insert_one(frame)
        except Exception as e:
            print("Pymongo insert one got error: ", e)
except serial.SerialException as e:
    print("Failed to get data from Arduino! Error: ", e)
