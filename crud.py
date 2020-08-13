from model import db, User, Image, Like, Dislike, connect_to_db
import requests
import json

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

def get_user_by_id(user_id):
    """Get user object by id"""

    return User.query.get(user_id) 

def get_user_by_email(email):
    """Get user object by email"""

    return User.query.filter(User.email == email).one() 

def get_breeds():
    """"""

    breeds = json.loads(requests.get('https://dog.ceo/api/breeds/list/all').content)
    return list(breeds['message'].keys())

def create_image(image_url, user_id):
    """Create and return a new image.""" 

    image = Image(image_url=image_url, user_id=user_id)

    db.session.add(image)
    db.session.commit()

    return image   

def get_random_image_by_breed(breed):
    """"""
    imgs_url = json.loads(requests.get(f'https://dog.ceo/api/breed/{breed}/images/random').content)
    
    return imgs_url['message']   


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
  