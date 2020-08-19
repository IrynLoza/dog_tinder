from model import db, User, Image, Like, Dislike, Match, connect_to_db
from random import choice, randint
import requests
import json

#***CREATE USER AND GET USER DATA***
def create_user(user_name, password, email, breed, location, gender,
                summary, preferences):
    """Create and return a new user."""

    user = User(user_name=user_name, password=password, email=email, breed=breed, 
                location=location, gender=gender, summary=summary,
                preferences=preferences)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    """Get all users objects"""

    return User.query.all()


def get_user_by_ids(id_list):
    """Get users"""
    # in - method get the list of id
    return db.session.query(User).filter(User.user_id.in_(id_list)).all()
# 

# def get_users_with_images():
#     """Get all users with images"""

#     return db.session.query(User, Image).join(Image).all()
 

def get_user_by_id(user_id):
    """Get user object by id"""

    return User.query.get(user_id)

def get_user_img_by_id(user_id):

    return Image.query.get(user_id)

def get_user_by_user_name(user_name):
    """Get user object by user name"""

    return User.query.filter(User.user_name == user_name).one()    


def get_user_by_email(email):
    """Get user object by email"""

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

    return Like.query.filter((Like.user_id == user_id) | (Like.target_user_id == user_id)).all()    
   

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
  