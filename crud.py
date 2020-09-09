from model import db, User, Image, Like, Dislike, Match, connect_to_db
from random import choice, randint
from passlib.hash import argon2
import requests
import json

#***CREATE USER AND GET USER DATA***
def create_user(user_name, password, email, breed, location, gender,
                summary, preferences):
    """Create and return a new user."""
    hashed = argon2.hash(password)
    user = User(user_name=user_name, password=hashed, email=email, breed=breed, 
                location=location, gender=gender, summary=summary,
                preferences=preferences)

    db.session.add(user)
    db.session.commit()

    return user

def update_user_by_id(id, data):
    """Update user information by id, update in database 
    and return updated user"""

    updated_user = db.session.query(User).filter(User.user_id == id)\
       .update({
           User.user_name: data['user_name'], 
           User.summary: data['summary'],
           User.email: data['email'],
           User.breed: data['breed'],
           User.location: data['location'],
           User.preferences: data['preferences']
       })
    
    db.session.commit()

    return updated_user   
    
def update_user_password_by_id(user_id, password):
    """Update user password by id, update in database 
    and return the new user password"""

    new_password = db.session.query(User).filter(User.user_id == user_id)\
       .update({User.password: password})
    
    db.session.commit()

    return new_password    


def get_users():
    """Get all users objects"""

    return User.query.all()


def get_user_by_ids(id_list):
    """Get and return all users"""
    # in - method get the list of id
    return db.session.query(User).filter(User.user_id.in_(id_list)).all()


def get_user_by_id(user_id):
    """Get and return user object by id"""

    return User.query.get(user_id)


def get_user_img_by_id(user_id):
    """Get and return the first user image by id"""

    return Image.query.filter(Image.user_id == user_id).first()


def get_user_imgs_by_id(user_id):
    """Get and return all user images by id"""

    return Image.query.filter(Image.user_id == user_id).all()


def get_user_by_user_name(user_name):
    """Get and return user object by user name"""

    return User.query.filter(User.user_name == user_name).one()    


def get_user_by_email(email):
    """Get and return user object by email"""

    return User.query.filter(User.email == email).one() 

 
def get_breeds():
    """Get and return all breeds from API"""

    breeds = json.loads(requests.get('https://dog.ceo/api/breeds/list/all').content)

    return list(breeds['message'].keys())


#***CREATE IMAGE AND GET IMAGE DATA***
def create_image(image_url, user_id):
    """Create and return an image.""" 

    image = Image(image_url=image_url, user_id=user_id)

    db.session.add(image)
    db.session.commit()

    return image   


def get_images():
    """Get and return all images"""

    return Image.query.all()


def get_random_image_by_breed(breed):
    """Get and return random image by breed"""

    imgs_url = json.loads(requests.get(f'https://dog.ceo/api/breed/{breed}/images/random').content)
    
    return imgs_url['message']   


def update_image_by_id(image_id, url):
    """Update user image by id, update in database 
    and return the updated image"""
    
    new_image = db.session.query(Image).filter(Image.image_id == image_id)\
       .update({Image.image_url: url})
    
    db.session.commit()

    return new_image


#***CREATE LIKE AND GET LIKE DATA***
def create_like(user_id, target_user_id):
    """Create and return a like.""" 

    like = Like(user_id=user_id, target_user_id=target_user_id)

    db.session.add(like)
    db.session.commit()

    return like


def get_likes():
    """Get and return all likes"""

    return Like.query.all()


def get_likes_by_user(user_id):
    """Get and return likes by user"""

    return Like.query.filter(Like.user_id == user_id).all()


def get_likes_by_target_id(user_id, target_user_id):
    """Get and return likes by user"""

    return Like.query.filter((Like.user_id == target_user_id) & (Like.target_user_id == user_id)).all()  


#***CREATE DISLIKE AND GET DISLIKE DATA***
def create_dislike(user_id, target_user_id):
    """Create and return a dislike.""" 

    dislike = Dislike(user_id=user_id, target_user_id=target_user_id)

    db.session.add(dislike)
    db.session.commit()

    return dislike

 
def get_dislikes():
    """Get and return all dislikes"""

    return Dislike.query.all()


def get_dislikes_by_user(user_id):
    """Get and return dislikes by user"""
    
    return Dislike.query.filter(Dislike.user_id == user_id).all()


#***CREATE MATCH AND GET MATCH DATA***
def create_match(user_id, target_user_id):
    """Create and return a chat.""" 

    match = Match(user_id=user_id, target_user_id=target_user_id)

    db.session.add(match)
    db.session.commit()

    return match


def get_matches(user_id):
    """Get chats"""

    return Match.query.filter((Match.user_id == user_id) | (Match.target_user_id == user_id)).all() 




if __name__ == '__main__':
    from server import app
    connect_to_db(app)
  