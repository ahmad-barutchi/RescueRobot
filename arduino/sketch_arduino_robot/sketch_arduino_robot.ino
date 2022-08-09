#include <Servo.h>
#include <IRremote.h>
#include <Adafruit_MLX90614.h>
#include <i2cmaster.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include "DHT.h"
#define DHTPIN 8
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// initiating Mlx IR thermometer sensor
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// Remote control config
int receiverPin = 9;
int BeeperPin = 12;
int trigPin = A2;
int echoPin = A3;

// GPS config
static const int RXPin = 11, TXPin = 10;// Here we make pin 11 as RX of arduino & pin 10 as TX of arduino 
static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps; // create GPS object
SoftwareSerial ss(RXPin, TXPin);

// IR Reciever
IRrecv irrecv(receiverPin);
decode_results results;

// Declaring servo motors
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;
Servo servo6;
Servo servo7;

// Declaring variables for servo positions
float position_angle2;
float position_angle3;
float position_angle4;
float position_angle5;
float position_angle6;

float amplitude=50; //angle maximum
float period=800; //T en milliseconde
float phase2=0;
float phase3=PI/3;
float phase4=2*PI/3;
float phase5=3*PI/3;
float phase6=4*PI/3;
float offset2=90;
float offset3=90;
float offset4=90;
float offset5=90;
float offset6=90;

// Declaring some variables.. 
float temp_head;
float temp_rear;
long duration; // variable for the duration of sound wave travel
float distance; // variable for the distance measurement

float dis;
float dis1;
float dis2;
float dis3;
int direction_value;

// interval between accepted IR signals
int interval = 400;
// Tracks the time since last event fired
unsigned long previousMillis=0;

bool stop_auto;
bool auto_bool;
boolean direction_bool = false;
unsigned long last_case;

bool human_detected;
bool fire_detected;
String gpsLat;
String gpsLong;
String gpsPos;
int gpsLatr;
int gpsLongr;
float humidity = 40.0;
float lastHumidity = 40.0;
float ambTemp = 25.0;
float lastAmbTemp = 25.0;

void setup() {
  dht.begin(); // initialize the sensor

  Serial.begin(9600);
  // ss.begin(GPSBaud); // connect gps sensor

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(echoPin, INPUT); // Sets the echoPin as an INPUT

  pinMode(BeeperPin, OUTPUT);

  irrecv.enableIRIn(); // Start the receiver

  servo2.attach(2);
  servo3.attach(3);
  servo4.attach(4);
  servo5.attach(5);
  servo6.attach(6);
  servo7.attach(7);

  mlx.begin();
}

void avancer() {
  position_angle2 = amplitude*sin(2*PI*millis()/period+phase2)+offset2;
  servo2.write(position_angle2);
  delay(99);

  position_angle3 = amplitude*sin(2*PI*millis()/period+phase3)+offset3;
  servo3.write(position_angle3);
  delay(99);

  position_angle4 = amplitude*sin(2*PI*millis()/period+phase4)+offset4;
  servo4.write(position_angle4);
  delay(99);

  position_angle5 = amplitude*sin(2*PI*millis()/period+phase5)+offset5;
  servo5.write(position_angle5);
  delay(99);

  position_angle6 = amplitude*sin(2*PI*millis()/period+phase6)+offset6;
  servo6.write(position_angle6);
  delay(99);
}

void i_form() {
  servo2.write(90);
  servo3.write(90);
  servo4.write(90);
  servo5.write(90);
  servo6.write(90);
}

void zigzag_form() {
  servo2.write(50);
  servo3.write(150);
  servo4.write(50);
  servo5.write(150);
  servo6.write(50); 
}

void inversed_zigzag_form() {
  servo2.write(130);
  servo3.write(50);
  servo4.write(130);
  servo5.write(50);
  servo6.write(130); 
}

void turn_left() {
  servo2.write(120);
  servo3.write(120);
  servo4.write(120);
  servo5.write(130);
  servo6.write(130);
}

void turn_right() {
  servo2.write(60);
  servo3.write(60);
  servo4.write(60);
  servo5.write(50);
  servo6.write(50);
}

float ReadTemp(byte address) {
  int data_low = 0;
  int data_high = 0;
  int pec = 0;
  byte MLXAddress = address<<1;
  
  i2c_start_wait(MLXAddress + I2C_WRITE);
  i2c_write(0x07);
  i2c_rep_start(MLXAddress + I2C_READ);
  data_low = i2c_readAck();
  data_high = i2c_readAck();
  pec = i2c_readNak();
  i2c_stop();
  
  float temp = 0x0000;
  temp = (float)(((data_high & 0x007F) << 8) + data_low);
  temp = (temp * 0.02) - 273.16;
  return temp;
}

float getDistance() {
  // Clears the trigPin condition
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
  
  return distance;
}

int getDirection() {
  servo7.write(30);
  delay(666);
  dis1 = getDistance();

  servo7.write(90);
  delay(666);
  dis2 = getDistance();

  servo7.write(150);
  delay(333);
  servo7.write(30);
  dis3 = getDistance();
  Serial.println("distances: ");
  Serial.print(dis1);
    Serial.print(", ");
  Serial.print(dis2);
    Serial.print(", ");
  Serial.print(dis3);
    Serial.print(", ");
  float dis = max(max(dis1, dis2), dis3);
  if (dis == dis1) {
    Serial.print("Left");
    return 0; // Left
  }
  else if (dis == dis2) {
    Serial.print("Ahead");
    return 1; //Ahead
  } else {
    Serial.print("Right");
    return 2; // Right
  }
  Serial.println("");
}

void get_state(float temp_head, float temp_rear, float humidity, float ambTemp){
  if (temp_head < 29 && temp_rear < 29) {
    human_detected = false;
    fire_detected = false;
    noTone(BeeperPin);
  }

  // make 1khz on pin 13 for 1 ms for head sensor.
  else if ((temp_head > 29 && temp_head < 42) || (temp_rear > 29 && temp_rear < 42)){
    analogWrite(BeeperPin, 255);
    delay(9);
    analogWrite(BeeperPin, 0);
    human_detected = true;
  }

  else {
    analogWrite(BeeperPin, 255);
    delay(99);
    analogWrite(BeeperPin, 0);
    fire_detected = true;
  }
}

void auto_mode(float temp_head, float temp_rear) {
  for (int x = 0; x < 9; x++) {
    avancer();
  }
  direction_value = getDirection();
  switch (direction_value) {
  case 0:
    turn_left();
    delay(400);
    break;
  case 1:
    zigzag_form();
    delay(100);
    break;
  case 2:
    turn_right();
    break;
  }
}

void loop() {
  human_detected = false;
  fire_detected = false;
  
  while (ss.available() > 0){
    if (gps.encode(ss.read())){
    }
  }
  unsigned long currentMillis = millis();
  
  // Get head IR thermometer value.
  temp_head = ReadTemp(0x55);

  // Get rear IR thermometer value.
  temp_rear = ReadTemp(0x56);

  // read humidity
  humidity = dht.readHumidity();
  // read ambiante temperature as Celsius
  ambTemp = dht.readTemperature();
  
  // get state (human or fire detected)
  get_state(temp_head, temp_rear, humidity, ambTemp);
  
  Serial.print(temp_head);
  Serial.print(" ");
  Serial.print(temp_rear);
  Serial.print(" ");

  if (isnan(ambTemp)) {
    Serial.print(lastAmbTemp);
  } else {
    lastAmbTemp = ambTemp;
    Serial.print(ambTemp);
  }
  Serial.print(" ");

  if (isnan(humidity)) {
    Serial.print(lastHumidity);
  } else {
    lastHumidity = humidity;
    Serial.print(humidity);
  }
  Serial.print(" ");
  gpsPos = "";
  gpsLat = "50.4614";
  gpsLatr = random(9,19);
  gpsLat.concat(gpsLatr);
  gpsLong = "3.95760";
  gpsLongr = random(0,9);
  gpsLong.concat(gpsLongr);
  gpsPos.concat(gpsLat);
  gpsPos.concat(",");
  gpsPos.concat(gpsLong);
  Serial.print(gpsPos);
  
  // Serial.print(gps.location.lat(), 6);
  // Serial.print(",");
  // Serial.print(gps.location.lng(), 6);
  Serial.print(" ");
  if (human_detected) {
    Serial.print("y");
  }
  else {
    Serial.print("n");
  }
  Serial.print(" ");

  if (fire_detected) {
    Serial.print("y");
  }
  else {
    Serial.print("n");
  }
  Serial.println();
  
  irrecv.decode(&results); // IR signal received?
  
  switch(results.value) {
    case 0xFFA25D: // "POWER"
      Serial.println("POWER");
      auto_mode(temp_head, temp_rear);
      last_case = 0xFFA25D;
      break;
    case 0xFFE21D: // "FUNC/STOP"      break;
    case 0xFF629D: // "VOL+"           break;
    case 0xFF22DD: // "FAST BACK"      break;
    case 0xFF02FD: // "PAUSE"          break;
    case 0xFFC23D: // "FAST FORWARD"   break;
    case 0xFFE01F: // "DOWN"           break;
    case 0xFFA857: // "VOL-"           break;
    case 0xFF906F: // "UP"
      Serial.println("UP");
      avancer();
      break;
    case 0xFF9867: // "EQ"             break;
    case 0xFFB04F: // "ST/REPT"        break;
    case 0xFF6897: // "0"
      Serial.println("0");
      getDirection();
      delay(1000);
      break;
    case 0xFF30CF: // "1"
    Serial.println("1");
      zigzag_form();
      break;
    case 0xFF18E7: // "2"
    Serial.println("2");
      inversed_zigzag_form();
      break;
    case 0xFF7A85: // "3"
    Serial.println("3");
      turn_left();
      break;
    case 0xFF10EF: // "4"
    Serial.println("4");
      turn_right();
      last_case = 0xFF10EF;
      break;
    case 0xFF38C7: // "5"              break;
    case 0xFF5AA5: // "6"              break;
    case 0xFF42BD: // "7"              break;
    case 0xFF4AB5: // "8"              break;
    case 0xFF52AD: // "9"              
      if(last_case != 0xFF52AD){
      }
      last_case = 0xFF52AD;
      break;
  }
  
  if ((unsigned long)(currentMillis - previousMillis) >= interval){
    previousMillis = currentMillis;
    irrecv.resume(); // receive the next value
  }
  delay(990);
}
