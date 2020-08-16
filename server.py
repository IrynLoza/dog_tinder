from flask import Flask, render_template, request, flash, session, redirect, jsonify
from flask_jwt_extended import JWTManager, create_access_token

from model import connect_to_db

import json
import crud
import os

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = 'dev'
app.config['JWT_SECRET_KEY'] = os.environ['SECRET_KEY']
app.jinja_env.undefined = StrictUndefined

jwt = JWTManager(app)

# @app.route("/")
# def root():
#     """Show the main page"""

#     return render_template("index.html")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    
    return render_template('index.html')

@app.route("/api/users")
def get_users():
    """Get users from database"""

    users = crud.get_users()
    result = []
    for user in users:
        result.append(user.serialize())
  
    return jsonify(result)

@app.route("/api/login", methods=['POST'])
def login():

    data = request.get_json()
    user = crud.get_user_by_user_name(data['userName'])
    if user:
        if user.password == data['password']:
            session['user'] = {'user_name': user.user_name, 'user_id': user.user_id}

            #create access token for user 
            #use jwt (json web token) instead of cookies
            access_token = create_access_token(identity = {'user_name': user.user_name, 'user_id': user.user_id})
            return jsonify({'status': 'ok', 'access_token': access_token})
    return jsonify({'status': 'ERROR', 'message': 'Username or passwor is not correct'})


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)