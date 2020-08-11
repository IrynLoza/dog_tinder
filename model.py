from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_to_db(flask_app, db_uri='postgresql:///ratings', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    user_name = db.Column(db.String, unique=True, nullable=False) 
    password = db.Column(db.String, nullable=False)                               
    email = db.Column(db.String, unique=True, nullable=False)
    breed = db.Column(db.String, nullable=True)
    location = db.Column(db.String, nullable=True)
    gender = db.Column(db.String, nullable=True)
    summary = db.Column(db.Text, nullable=True)
    preferences = db.Column(db.Text, nullable=True)


    def __repr__(self):
        return f'<User user_id={self.user_id} user_name={self.user_name} email={self.email}>' 
       

class Image(db.Model):
    """A user images."""

    __tablename__ = "images"

    image_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    image_url = db.Column(db.String, nullable=False) 

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('User', backref='images')
    

    def __repr__(self):
        return f'<User image_id={self.image_id} image_url={self.image_url}>' 
       

class Like(db.Model):
    """A user likes."""

    __tablename__ = "likes"

    like_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user_id_of_liked_user = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    current_user = db.relationship('User', backref='likes')
    liked_user = db.relationship('User', backref='likes')


    def __repr__(self):
        return f'<User like_id={self.like_id} user_id={self.user_id} liked_user={self.user_id_of_liked_user}>' 

class Dislike(db.Model):
    """A user dislikes."""

    __tablename__ = "dislikes"

    dislike_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user_id_of_disliked_user = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    cur_user = db.relationship('User', backref='dislikes')
    disliked_user = db.relationship('User', backref='dislikes')    
    

    def __repr__(self):
        return f'<User dislike_id={self.dislike_id} user_id={self.user_id} disliked_user={self.user_id_of_disliked_user}>' 
 


if __name__ == '__main__':
    from server import app

    connect_to_db(app)