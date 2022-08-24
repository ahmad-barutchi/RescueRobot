from vpython import *
import numpy as np
import serial

ad = serial.Serial('COM5', 9600)
roomWidth = 999
roomDepth = 1700
roomHeight = 999

deltaX = .3
deltaY = .3
deltaZ = .3

xPos = -400
yPos = 0
zPos = 0

scene.range = 50
toRad = 2 * np.pi / 360
toDeg = 1 / toRad
scene.forward = vector(-1, -1, -1)

scene.width = 1520  # 1500
scene.height = 680  # 680

startBox = box(length=9, width=9, height=9, opacity=.4, pos=vector(-400, 0, 0, ), color=color.red)

xarrow = arrow(lenght=5, shaftwidth=.1, color=color.red, axis=vector(1, 0, 0))
yarrow = arrow(lenght=5, shaftwidth=.1, color=color.green, axis=vector(0, 1, 0))
zarrow = arrow(lenght=5, shaftwidth=.1, color=color.blue, axis=vector(0, 0, 1))

frontArrow = arrow(length=7, shaftwidth=.1, color=color.purple, axis=vector(1, 0, 0))
upArrow = arrow(length=4, shaftwidth=.1, color=color.magenta, axis=vector(0, 1, 0))
sideArrow = arrow(length=4, shaftwidth=.1, color=color.orange, axis=vector(0, 0, 1))

bBoard = box(length=15, width=2, height=2, opacity=.6, pos=vector(0, 0, 0, ), color=color.red)
myObj = compound([bBoard, xarrow, yarrow, zarrow, frontArrow, upArrow, sideArrow])

wallThickness = .1

floor = box(pos=vector(0, -roomHeight / 2, 0), size=vector(roomWidth, wallThickness, roomDepth), opacity=.8,
            color=color.white)
backWall = box(pos=vector(0, 0, -roomDepth / 2), size=vector(roomWidth, roomHeight, wallThickness), opacity=.8,
               color=color.white)
leftWall = box(pos=vector(-roomWidth / 2, 0, 0), size=vector(wallThickness, roomHeight, roomDepth), opacity=.8,
               color=color.white)

while True:
    while ad.inWaiting() == 0:
        pass

    dataPacket = ad.readline()
    # print(dataPacket)
    dataPacket = str(dataPacket, 'utf-8')
    # print(dataPacket)
    splitPacket = dataPacket.split(",")
    # print(splitPacket)
    roll = float(splitPacket[3]) * toRad
    pitch = float(splitPacket[4]) * toRad
    yaw = float(splitPacket[5]) * toRad + np.pi
    roll = -1 * roll
    yaw = -1 * yaw

    # print("Roll=", "{:.2f}".format(roll * toDeg), " Pitch=", "{:.2f}".format(pitch * toDeg),
    #      "Yaw=", "{:.2f}".format(yaw * toDeg))
    rate(40)
    k = vector(cos(yaw) * cos(pitch), sin(pitch), sin(yaw) * cos(pitch))
    y = vector(0, 1, 0)
    s = cross(k, y)
    v = cross(s, k)
    vrot = v * cos(roll) + cross(k, v) * sin(roll)

    frontArrow.axis = k
    sideArrow.axis = cross(k, vrot)
    upArrow.axis = vrot
    myObj.axis = k
    myObj.up = vrot
    sideArrow.length = 2
    frontArrow.length = 4
    upArrow.length = 1

    if float(splitPacket[0]) <= 0:
        rollX = -1
    else:
        rollX = 1

    if float(splitPacket[1]) <= 0:
        rollY = -1
    else:
        rollY = 1

    if float(splitPacket[1]) <= 0:
        rollZ = -1
    else:
        rollZ = 1

    xPos += deltaX * float(splitPacket[0]) + deltaX * rollX
    yPos += deltaY * float(splitPacket[1]) + deltaY * rollY
    zPos += deltaZ * float(splitPacket[2]) + deltaZ * rollZ
    # print(roll, pitch, yaw)
    myObj.pos = vector(xPos, yPos, zPos * -1)

    print("{:.2f}".format(myObj.pos.x + 400), "{:.2f}".format(myObj.pos.y), "{:.2f}".format(myObj.pos.z))
