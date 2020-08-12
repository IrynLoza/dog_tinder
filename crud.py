from model import db, User, Image, Like, Dislike, connect_to_db

def create_user(user_name, password, email):
    """Create and return a new user."""

    user = User(user_name=user_name, password=password, email=email)

    db.session.add(user)
    db.session.commit()

    return user


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
  