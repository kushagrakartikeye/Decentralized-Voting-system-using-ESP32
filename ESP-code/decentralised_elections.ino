#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

// RFID Pin Configuration for ESP32
#define SS_PIN 15   // SDA/SS pin
#define RST_PIN 4   // RST pin

// Button and LED Pins
const int buttonPins[4] = {13, 12, 14, 27};  // Button pins
const int ledPin = 2;  // LED pin

// WiFi Credentials
const char* ssid = "realme 8";
const char* password = "12345678";

// Backend Server URL
const char* serverUrl = "http://192.168.216.50:3000/vote";

// RFID and Voting Variables
MFRC522 mfrc522(SS_PIN, RST_PIN);
bool tagScanned = false;
bool buttonAllowed = false;
String currentTag = "";

void setup() {
    Serial.begin(115200);
    SPI.begin();          // Init SPI bus
    mfrc522.PCD_Init();   // Init MFRC522 module

    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");
    Serial.println(WiFi.localIP()); // Print IP Address for debugging

    // Set button pins as input with pull-up and LED as output
    for (int i = 0; i < 4; i++) {
        pinMode(buttonPins[i], INPUT_PULLUP);
    }
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);

    Serial.println("RFID Voting System with ESP32 Ready...");
}

// Function declarations
void blinkLED(int times, int delayTime);
void resetCycle();

void loop() {
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
        currentTag = getTagID();
        Serial.println("RFID Tag Scanned: " + currentTag);
        Serial.println("Press a button to vote.");
        tagScanned = true;
        buttonAllowed = true;
        blinkLED(1, 300);
        mfrc522.PICC_HaltA();
        mfrc522.PCD_StopCrypto1();
    }

    if (buttonAllowed) {
        checkButtonPress();
    }
}

String getTagID() {
    String tagID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
        tagID += String(mfrc522.uid.uidByte[i], HEX);
    }
    tagID.toUpperCase();
    return tagID;
}

void checkButtonPress() {
    for (int i = 0; i < 4; i++) {
        if (digitalRead(buttonPins[i]) == LOW) {
            delay(50);
            if (digitalRead(buttonPins[i]) == LOW) {  // Confirm button press
                Serial.println("Button " + String(i + 1) + " Pressed! Sending Vote...");
                sendVote(currentTag, i + 1);
                digitalWrite(ledPin, HIGH);
                delay(1000);
                digitalWrite(ledPin, LOW);
                resetCycle();
                break;
            }
        }
    }
}

void sendVote(String tagID, int button) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");

        String payload = "{\"tagId\":\"" + tagID + "\", \"buttonId\":" + String(button) + "}";
        Serial.println("Sending Payload: " + payload);  // Debugging

        int httpResponseCode = http.POST(payload);

        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("Server Response: " + response);
        } else {
            Serial.print("Error sending vote, HTTP Code: ");
            Serial.println(httpResponseCode);
        }
        http.end();
    } else {
        Serial.println("WiFi Disconnected! Cannot send vote.");
    }
}

// Function to reset the voting process
void resetCycle() {
    tagScanned = false;
    buttonAllowed = false;
    currentTag = "";
}

// Function to blink the LED a certain number of times
void blinkLED(int times, int delayTime) {
    for (int i = 0; i < times; i++) {
        digitalWrite(ledPin, HIGH);
        delay(delayTime);
        digitalWrite(ledPin, LOW);
        delay(delayTime);
    }
}
