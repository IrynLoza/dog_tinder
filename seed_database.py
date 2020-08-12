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

for i in range(10):
    user_name = fake.user_name()
    password = fake.password() 
    email = fake.email()

    user = crud.create_user(user_name, password, email) 
     

# fake = Faker(['en_US'])
# for _ in range(10):
#     print(fake.name())