# imports
import pyrebase

config = {
    "databaseURL": "https://revercial-43fe3-default-rtdb.firebaseio.com/",
    "apiKey": "AIzaSyBd7z644_giN5TX9lv5T1AdHfp1ilwsrbA",
    "authDomain": "revercial-43fe3.firebaseapp.com",
    "projectId": "revercial-43fe3",
    "storageBucket": "revercial-43fe3.appspot.com",
    "messagingSenderId": "277923181143",
    "appId": "1:277923181143:web:17230c5cdb451126146912",
    "measurementId": "G-4VYLQMSHKR"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

# For test adding a user to the database
firstName = "Karl"
surname = "Francisco"
name = surname + "_" + firstName
data = {"Name": firstName, "Surname": surname, "Date of Birth": "26/04/1995", "Age": 28}
db.child("Users").child(name).set(data)

# Functions
# def save_profile():
#     print("Profile saved.")

# def update_profile():
#     print("Profile updated.")
