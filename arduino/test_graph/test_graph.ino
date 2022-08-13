// Human and Fire variables
float human_temp_prob = 0.0;
float fire_temp_prob = 0.0;
float human_min_temp = 29.0;
float human_mid_temp = 36.0;
float human_max_temp = 42.0;
float fire_min_temp = 42.0;
float fire_max_temp = 99.0;
float min_global_temp = -20.0;
float human_prob = 0.0;
float fire_prob = 0.0;

bool human_detected;
bool fire_detected;

void setup() {
  Serial.begin(9600);
}

// Get state of Human, Fire detected with probability.
void get_state(float temp_head, float temp_rear, float humidity){
    human_prob = 0.0;
    fire_prob = 0.0;
    // None detected case
    if (temp_head < human_min_temp && temp_rear < human_min_temp) {
        human_temp_prob = map(temp_head, min_global_temp, human_min_temp, 0.1, 30.0);
        human_temp_prob += map(temp_rear, min_global_temp, human_min_temp, 0.1, 30.0);
        human_temp_prob = human_temp_prob / 2.0;
        // Mathematically: human_prob = (0->30) * (1/100->100/100) = 0-30%  MinValue= 0*0/100 = 0, MaxValue = 30*1
        human_prob = human_temp_prob * humidity / 100.0;
        human_detected = false;
        fire_detected = false;
    }

    // Fire detected case
    else if(temp_head > human_max_temp || temp_rear > human_max_temp) {
        if (temp_head > temp_rear) {
            fire_temp_prob = map(temp_head, fire_min_temp, fire_max_temp, 50.0, 99.9);
        } else {
            fire_temp_prob = map(temp_rear, fire_min_temp, fire_max_temp, 50.0, 99.9);
        }
        humidity = map(humidity, 1.0, 100.0, 99.9, 1.0);
        // Mathematically: fire_prob = (50->100) * (100/100->1/100) = 50-100%, Min_value=50*1= 50%, Max_value=100*1= 100%
        fire_prob = fire_temp_prob * humidity /100.0;
        if (fire_prob > 30.0){
            fire_detected = true;
        }
    }

    // Human detected case
    else {
        if (temp_head > temp_rear) {
            if (temp_head < human_mid_temp){
                human_temp_prob = map(temp_head, human_min_temp, human_mid_temp, 50.0, 100.0);
            } else {
                human_temp_prob = map(temp_head, human_mid_temp, human_max_temp, 100.0, 50.0);
            }
        } else {
            if (temp_rear < human_mid_temp){
                human_temp_prob = map(temp_rear, human_min_temp, human_mid_temp, 50.0, 100.0);
            } else {
                human_temp_prob = map(temp_rear, human_mid_temp, human_max_temp, 100.0, 50.0);
            }
        }
        // Mathematically: human_prob = (50->100) * (1/100->100/100) = 50-100%, Min_value=50*1= 50%, Max_value=100*1= 100%
        human_prob = human_temp_prob * humidity / 100.0;
        if (human_prob > 30.0){
            human_detected = true;
        }
    }
    Serial.print(human_prob);
    Serial.print(" ");
    Serial.print(fire_prob);
    Serial.print(" ");
}

void loop() {
  human_detected = false;
  fire_detected = false;
  for (int humidity = 0; humidity <= 100; humidity+=9) {
    for (int temp2 = 0; temp2 <= 100; temp2+=9) {
      for (int temp = 0; temp <= 100; temp+=9) {
        Serial.print(temp);
        Serial.print(" ");
        Serial.print(temp2);
        Serial.print(" ");
        Serial.print(0);
        Serial.print(" ");
        Serial.print(humidity);
        Serial.print(" ");
        Serial.print("pos");
        Serial.print(" ");
        get_state(temp, temp2, humidity);
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
      }
    }
  }
  // 9 > 1728 (racine cubique de 1728 = 12)
  // 4 > 17576 (racine cubique de 17576 = 26)
}
