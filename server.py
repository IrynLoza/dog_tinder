from flask import Flask, render_template, request, flash, session, redirect, jsonify
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required

from model import connect_to_db
from random import choice, randint

import json
import crud
import os

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = 'dev'
app.config['JWT_SECRET_KEY'] = os.environ['SECRET_KEY']
app.jinja_env.undefined = StrictUndefined

jwt = JWTManager(app)

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


@app.route("/api/random-user")
@jwt_required
def get_random_user():
    """Get random user from database"""

    current_id = get_jwt_identity()['user_id']
    ignore_list = [current_id]

    # TODO 
    # 1 create the query with join and combine two functions
    # 2 get count all records from users and use in randint
    likes = crud.get_likes_by_user(current_id)
    for like in likes:
        ignore_list.append(like.target_user_id)

    dislikes = crud.get_dislikes_by_user(current_id)
    for dislike in dislikes:
        ignore_list.append(dislike.target_user_id) 

    while True:
        user_id = randint(1,101)   
        if user_id not in ignore_list:
            break 

    user = crud.get_user_by_id(user_id)
    user_img = crud.get_user_img_by_id(user_id)
    response = user.serialize()
    response['user_img'] = user_img.serialize()
 

    return jsonify(response)


@app.route("/api/like", methods=['POST'])
@jwt_required
def get_likes():
    """Get likes from current user""" 
    data = request.get_json()
    
    target_id = data['target_id']
    current_user_id = get_jwt_identity()['user_id']

    crud.create_like(current_user_id, target_id)

    #check if target_id have ever liked current_id
    #if yes - store to match
    is_like = crud.get_likes_by_target_id(target_id, current_user_id)
    
    if is_like:
        #place where match create
        crud.create_match(current_user_id, target_id)
  
    return jsonify({'status': 'ok'})

@app.route("/api/dislike", methods=['POST']) 
@jwt_required
def get_dislikes():
    """Get dislikes from current user"""  
    data = request.get_json()

    target_id = data['target_id']
    current_user_id = get_jwt_identity()['user_id']

    crud.create_dislike(current_user_id, target_id)
   
    return jsonify({'status': 'ok'})


@app.route("/api/matches")
@jwt_required
def get_match():
    """"""
    
    current_id = get_jwt_identity()['user_id']

    #get all matches for current user
    matches_list = crud.get_matches(current_id)
    
    #create unique list with current user matches
    #if current user = match.user_id = add data to target_user_id column
    #else opposite 
    user_id_list = []
    for match in matches_list:
        if match.user_id == current_id:
            user_id_list.append(match.target_user_id)
        else:
            user_id_list.append(match.user_id)

    #remove all duplicates id's
    user_id_set = set(user_id_list)

    matches = crud.get_user_by_ids(list(user_id_set))
    result = []
    for match in matches:
        user_img = crud.get_user_img_by_id(match.user_id)
        user = match.serialize()
        user['user_img'] = user_img.serialize()
        result.append(user)


    return jsonify(result) 

@app.route("/api/users/<user_id>")
@jwt_required
def get_user_by_id(user_id):
    """"""

    user = (crud.get_user_by_id(user_id)).serialize()
    user_img = crud.get_user_img_by_id(user_id)
    user['user_img'] = user_img.serialize()

    return jsonify(user)
  
    
if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)