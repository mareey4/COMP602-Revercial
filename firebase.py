# imports
import pyrebase

config = {
    "apiKey": "AIzaSyDch2JUJGJCo6jo9XemL9PO5TJLf-wYnx8",
    "authDomain": "revercial-e4094.firebaseapp.com",
    "databaseURL": "https://revercial-e4094-default-rtdb.firebaseio.com",
    "projectId": "revercial-e4094",
    "storageBucket": "revercial-e4094.appspot.com",
    "messagingSenderId": "890528169241",
    "appId": "1:890528169241:web:57e71d0f847625eb56d988",
    "measurementId": "G-JSRGENNMEJ"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database

def save_profile():
    print("Profile saved.")

def update_profile():
    print("Profile updated.")
