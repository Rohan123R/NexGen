from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from flask import Flask, request, jsonify
from bcrypt import gensalt, hashpw,checkpw
from dotenv import load_dotenv
from flask_cors import CORS
import io
from flask import Flask, request, jsonify, send_file
import os
import tensorflow as tf
import numpy as np
import PIL.Image
import matplotlib.pyplot as plt
import matplotlib as mpl
import tensorflow_hub as hub
import base64

load_dotenv()

mongoURI = "mongodb+srv://rohan182004:rohan098@sportsapi.g4gt9hs.mongodb.net/?retryWrites=true&w=majority&appName=sportsapi"
app = Flask(__name__)
CORS(app)
dbDetails = None
dbUserDetails = None  # Corrected variable name

def dbConnect():
    global client, dbDetails, dbUserDetails
    
    try:
        client = MongoClient(mongoURI)
        dbDetails = client.NeuralStyleTransfer
        dbUserDetails = dbDetails.Userdetails
        print("Successfully connected to the database!")
    except ConnectionFailure as e:
        print({"Connection Error": e})

dbConnect()

@app.route('/signup', methods=["POST"])
def signup():
    print("On signup page")
    if request.method == 'POST':
        credentials = request.json
        username = credentials["username"]
        pwd = credentials["password"]
        salt = gensalt()
        hashedPwd = hashpw(pwd.encode('utf-8'), salt)
        email = credentials["email"]
        mobileNo = credentials["mobile_no"]
        authCreds = {"username": username, "password": hashedPwd, "email": email, "mobile_no": mobileNo}

    existing_user = dbUserDetails.find_one({"$or": [{"username": username}, {"email": email}, {"mobile_no": mobileNo}]})
    if existing_user:
        return jsonify({"error": "Username, email, or mobile number already exists"}), 400

    result = dbUserDetails.insert_one(authCreds)
    user_id = result.inserted_id
    invCreds = {"items": [], "user_id": user_id}

    dbUserDetails.insert_one(invCreds)

    return jsonify({"message": "User created successfully"}), 201





@app.route('/Login', methods=["POST"])
def Login():
    print("On login page")
    if request.method == "POST":
        credentials = request.json
        username = credentials["username"]
        pwd = credentials["password"]

        user = dbUserDetails.find_one({"username": username})
        if user:
            print("userfound")
            user_id = user["_id"]
        else:
            return jsonify({"error":"User not found","user_id":""}), 404
        if user:
            userPwd = user["password"]
            if checkpw(pwd.encode('utf-8'),userPwd):

                return jsonify({"message": "Login successful",
                                "user_id":str(user_id)
                                }), 200
            else:
                return jsonify({"error": "Incorrect password"}), 401
        else:
            return jsonify({"error": "User not found"}), 404






os.environ['TFHUB_MODEL_LOAD_FORMAT'] = 'COMPRESSED'
mpl.rcParams['figure.figsize'] = (12, 12)
mpl.rcParams['axes.grid'] = False

def tensor_to_image(tensor):
    tensor = tensor * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor) > 3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)



import os

@app.route('/processimage', methods=['POST'])
def stylize_image():
    if request.method == "POST":
        content_image_path = "./assets/dog.jpg"
        style_image_path = "./assets/starry_night.jpg"

        # Load content image
        content_img = tf.image.decode_image(tf.io.read_file(content_image_path), channels=3)
        content_img = tf.image.convert_image_dtype(content_img, tf.float32)
        content_img = tf.image.resize(content_img, (512, 512))[tf.newaxis, :]

        # Load style image
        style_img = tf.image.decode_image(tf.io.read_file(style_image_path), channels=3)
        style_img = tf.image.convert_image_dtype(style_img, tf.float32)
        style_img = tf.image.resize(style_img, (512, 512))[tf.newaxis, :]

        # Load style transfer model
        hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

        # Stylize the content image with the style image
        stylized_image = hub_model(tf.constant(content_img), tf.constant(style_img))[0]

        # Convert the stylized image tensor to a PIL image
        stylized_pil_image = tensor_to_image(stylized_image)

        # Convert the stylized image to base64-encoded string
        buffered = io.BytesIO()
        stylized_pil_image.save(buffered, format="PNG")
        base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # Return the base64-encoded stylized image in the response
        return jsonify({"stylized_image": base64_image})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

