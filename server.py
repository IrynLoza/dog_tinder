from flask import Flask, render_template, request, flash, session, redirect, jsonify
from flask_jwt import JWT, jwt_required, current_identity
from model import connect_to_db
import json
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined

@app.route("/")
def root():
    """Show the main page"""

    return render_template("base.html")

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
            return jsonify({'status': 'ok'})
    return jsonify({'status': 'ERROR', 'message': 'Username or passwor is not correct'})

   

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)