from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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

    owner = db.relationship('Like', backref='owner_id', foreign_keys = 'Like.user_id')
    target = db.relationship('Like', backref='target_id', foreign_keys = 'Like.target_user_id')

    owner = db.relationship('Dislike', backref='dislike_owner_id', foreign_keys = 'Dislike.user_id')
    target = db.relationship('Dislike', backref='dislike_target_id', foreign_keys = 'Dislike.target_user_id')
   


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

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('User', backref='images')
    

    def __repr__(self):
        return f'<Image id={self.image_id} url={self.image_url}>' 

# test1 = User(user_name='ted', password='test', email='test@gmail.com')       

class Like(db.Model):
    """A user likes."""

    __tablename__ = "likes"

    like_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)  
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))


    def __repr__(self):
        return f'<Like id={self.like_id}>' 

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
 


if __name__ == '__main__':
    from server import app

    connect_to_db(app)