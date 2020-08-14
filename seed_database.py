import os
import requests
import json

# import cloudinary
# import cloudinary.uploader
# import cloudinary.api

from random import choice, randint
from faker import Faker

import crud
import model
import server

os.system('dropdb tinder')
os.system('createdb tinder')

model.connect_to_db(server.app)
model.db.create_all()

#Generate fake data
fake = Faker()

# #install cloudinary config
# cloudinary.config(  
#     #import api_key from sh 
#     cloudinary_key = os.environ['cloudinary_api_key'],
#     cloudinary_secret = os.environ['cloud_secret_key'],
#     cloudinary_name = os.environ['cloudinary_name']
# )

#***CREATE USERS AND IMAGES***
breed_list = crud.get_breeds()

gender_list = ['male', 'female']

summary_list = [
                'Friendly, fluffy friend', 'Adorable buddy for walk', 'Can be your best friend',
                'Couch potato', 'New dog friends lover', 'Smart cookie', 'Love treats and dogs',
                'Make your life better', 'Bring a lot of fun to your life', 
                'Show you the best dog park'
                ]

preferences_list = [
                'Looking for new friends', 'Obsessed with huskies', 'Wanna play together',
                'Looking for corgi for seriouse relations', 'Join my amazing company',
                'How about shedding together?', 'Looking for you, yes, you', 
                'Let me treats and I will love you', 'Show you my favorite spot', 
                'Looking for seriouse partnership', 'Love pugs', 'Be my friend',
                'Ready for everyone' 
                ]        

for i in range(100):
    #create 100 users
    user_name = fake.user_name()
    password = fake.password() 
    email = fake.email()
    location = fake.zipcode_in_state('CA') 
    breed = choice(breed_list)
    gender = choice(gender_list)
    summary = choice(summary_list)
    preferences = choice(preferences_list)
    
    user = crud.create_user(user_name, password, email, breed, location, gender, summary, 
                            preferences) 
     
    # create 3 images for every user
    for n in range(3):
        image_url = crud.get_random_image_by_breed(breed)
        user_id = user.user_id

        crud.create_image(image_url, user_id) 

        # # create likes for users
        # for y in range(2):
        #     user_id = user.user_id
        #     target_user = choice(crud.get_users())
        #     target_user_id = target_user.user_id
        #     if user_id % 2 == 0 and user_id != target_user_id:
        #         crud.create_like(user_id, target_user_id)

        #     # create dislikes for users    
        #     for z in range(2):
        #         user_id = user.user_id
        #         target_user = choice(crud.get_users())
        #         target_user_id = target_user.user_id
        #         if user_id % 2 != 0 and user_id != target_user_id:
        #             crud.create_dislike(user_id, target_user_id)    