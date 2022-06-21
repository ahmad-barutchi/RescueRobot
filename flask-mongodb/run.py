from flask import Flask
from pymongo import MongoClient

try:
    conn = MongoClient("localhost", 1235)
    print("Connected successfully!!!")
except:
    print("Could not connect to MongoDB")

# database
db = conn.RobotData

# Created or Switched to collection names: my_gfg_collection
collection = db.Data

# Insert Data
# rec_id1 = collection.insert_one(emp_rec1)
# rec_id2 = collection.insert_one(emp_rec2)

# print("Data inserted with record ids",rec_id1," ",rec_id2)

# Printing the data inserted

app = Flask(__name__)

temp = 0
temp2 = 0
humidity = 0


@app.route("/get-temp", methods=['GET'])
def getTemp():
    cursor = collection.find()
    valeur = []
    for record in cursor:
        print(record["value"])
        valeur.append(record["value"])
    print(valeur)

    preset = {
        "temp": valeur[0],
        "temp2": valeur[1],
        "humidity": valeur[2],
    }
    print("preset")
    print(preset)
    return preset

if __name__ == "__main__":
    print ('Api start ! ')
    app.run(debug=True)
