from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

#Set up configurations 
def connect_to_db(flask_app, db_uri='postgresql:///tinder', echo=True):
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
                        primary_key=True,
                        )  
    user_name = db.Column(db.String, nullable=False) 
    password = db.Column(db.String, nullable=False)                               
    email = db.Column(db.String, nullable=False)
    breed = db.Column(db.String)
    location = db.Column(db.String)
    gender = db.Column(db.String)
    summary = db.Column(db.Text)
    preferences = db.Column(db.Text)

    """Create many-to-many relationship between users and likes tables, users and dislikes and 
    users and matches"""
    like_owner = db.relationship('Like', backref='owner_id', foreign_keys = 'Like.user_id')
    like_target = db.relationship('Like', backref='target_id', foreign_keys = 'Like.target_user_id')

    dislike_owner = db.relationship('Dislike', backref='dislike_owner_id', foreign_keys = 'Dislike.user_id')
    dislike_target = db.relationship('Dislike', backref='dislike_target_id', foreign_keys = 'Dislike.target_user_id')

    match_owner = db.relationship('Match', backref='match_owner_id', foreign_keys = 'Match.user_id')
    match_target = db.relationship('Match', backref='match_target_id', foreign_keys = 'Match.target_user_id')
   
   #Serialize method for making serializing objects to JSON
    def serialize(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'email': self.email,
            'breed': self.breed,
            'location': self.location,
            'gender': self.gender,
            'summary': self.summary,
            'preferences': self.preferences,
        }

    #Rerp the method take and object parameter and returns a printable representation
    def __repr__(self):
        return f'<User id={self.user_id} name={self.user_name} email={self.email} breed={self.breed}>' 


class Image(db.Model):
    """A user images."""

    __tablename__ = "images"

    image_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True,
                        )  
    image_url = db.Column(db.String, nullable=False) 

    #Create many to one relationship between images and users tables
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('User', backref='images')
    
    def serialize(self):
        return self.image_url

    def __repr__(self):
        return f'<Image id={self.image_id} url={self.image_url}>' 


class Like(db.Model):
    """A user likes."""

    __tablename__ = "likes"

    like_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    def __repr__(self):
        return f'<Like id={self.like_id} target user id={self.target_user_id}>' 


class Dislike(db.Model):
    """A user dislikes."""

    __tablename__ = "dislikes"

    dislike_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))


    def __repr__(self):
        return f'<Dislike id={self.dislike_id}>' 


class Match(db.Model):
    """A chat."""

    __tablename__ = "matches"

    match_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))


    def __repr__(self):
        return f'<Match id={self.match_id} target user id={self.target_user_id}>' 


if __name__ == '__main__':
    from server import app

    connect_to_db(app)