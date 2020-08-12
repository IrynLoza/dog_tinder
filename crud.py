from model import db, User, Image, Like, Dislike, connect_to_db

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


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
  