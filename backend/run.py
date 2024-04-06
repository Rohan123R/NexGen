from flask import Flask
from flask_cors import CORS
from dotenv import *
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

load_dotenv()

env_var = dotenv_values(".env")
mongoURI ="mongodb+srv://rohan182004:rohan098@sportsapi.g4gt9hs.mongodb.net/?retryWrites=true&w=majority&appName=sportsapi"

dbDetails = None
dbUserAuth = None


def dbConnect():
    global client, dbDetails, dbUserDetails
    
    try:
        client = MongoClient(mongoURI)
        dbDetails = client.NeuralStyleTransfer  # Connecting to the NeuralStyleTransfer database
        dbUserDetails = dbDetails.Userdetails  # Accessing the Userdetails collection within NeuralStyleTransfer
        dbUserDetails.insert_one({
            'name': 'rohan',
            'password': 111,
        })
        print("Document inserted successfully!")
    except ConnectionFailure as e:
        print({"Connection Error": e})

dbConnect()



