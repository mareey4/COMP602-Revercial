# imports
import pyrebase
import createAccPage
from datetime import date
from user import User

config = {
    "databaseURL": "https://revercial-43fe3-default-rtdb.firebaseio.com/",
    "serviceAccount": "serviceAccountKey.json",
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
storage = firebase.storage()

# For test adding a user to the database
# first_name = "Maria"
# surname = "Paule"
# name = surname + "_" + firstName

# Functions
def save_new_user(new_user: User, formatted_date):
    data = {"Name": new_user.first_name, "Surname": new_user.surname, "Username": new_user.username,"Date of Birth": formatted_date, 
            "Email": new_user.email, "Password": new_user.password}
    
    name = new_user.surname + "_" + new_user.first_name
    
    db.child("Users").child(name).set(data)

# def update_profile():
#     print("Profile updated.")

def get_profile_data(name):
    user = db.child("Users").child(name).get()

    return user

def remove_profile(user: User):
    name = user.surname + "_" + user.first_name

    db.child("Users").child(name).remove()

# def save_profile_pic():
    # Code here

# def get_profile_pic():
    # Code here

# def save_media_post():
    # Code here

# def get_media_post():
    # Code here
