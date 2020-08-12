import os
import json
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

# generate locations:
# fake.address()
# fake.zipcode_in_state('CA')

# generate dog name
# fake.first_name()

breed_list = [
            'Mix', 'Welsh Corgi Pembroke', 'German Shepherd', 'Husky', 'Bulldog', 
            'St. Bernard', 'Chow Chow', 'Labradoodle', 'Beagle', 'Labrador Retriever',
            'Poodle', 'Pug', 'Border Colliie', 'Dachshund', 'Pomeranian', 'Doberman',
            'Shiba Inu', 'Rottweiler', 'Chihuahuas', 'Yorkshire Terriers'
            ]

gender_list = ['male', 'femaale']
summary_list = ['Friendly, fluffy friend', 'Adorable buddy for walk', 'Can be your best friend',
            'Couch potato', 'New dog friends lover', 'Smart cookie', 'Love treats and dogs',
            'Make your life better', 'Bring a lot of fun to your life', 'Show you the best dog park'
            ]
preferences_list = ['Looking for new friends', 'Obsessed with husky', 'Wanna play together',
                'Looking for corgi for seriouse relations', 'Join my amazing company',
                'How about shedding together?', 'Looking for you, yes, you', 
                'Let me treats and I will love you', 'Show you my favorite spot', 
                'Looking for seriouse partnership', 'Love pugs', 'Be my friend',
                'Ready for everyone' 
                ]        

for i in range(100):
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
     

# fake = Faker(['en_US'])
# for _ in range(10):
#     print(fake.name())