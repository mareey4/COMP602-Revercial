# imports
from datetime import date

class User:
    def __init__(self, first_name, surname, username, date_of_birth, email, password):
        self.first_name = first_name
        self.surname =  surname
        self.username = username
        self.date_of_birth = date_of_birth
        self.email = email