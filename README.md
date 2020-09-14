# DogTinder
Dating full stack web App for dogs.

### Tech stack 
**Client side:** JavaScript, React, React Hooks, React Router, Bootstrap, HTML, CSS

**Server side:** Python, Flask, SQLAlchemy, PostgreSQL, Socket.io, PASSlib, JWT

### Demo
Click on image to redirect on Youtube video

<a href="https://youtu.be/p8IwqtxmfNA" target="_blank"><img src="https://res.cloudinary.com/dogtinder/image/upload/v1600112143/dogTinder/login_f9id9b.png" 
alt="IMAGE ALT TEXT HERE" width="240" height="200" border="10" /></a>

### Setup

Install the dependencies from requirements.txt using pip3 install:
```
pip3 install requirements.txt
```

Seed database
```
python3 seed_database.py
```

Create user:
```
python3 -i crud.py

>>>create_user('user_name', 'password', 'user_name@gmail.com', 'corgi', '96543', 'female',
                'summary', 'preferences');
```

Create 3 user images, run the following command 3 times with different image url:
```
python3 -i crud.py

>>>create_image('image_url', 101)                
```

Create secret key for JWT and PASSlib:
```
export 'SECRET KEY'=YOUR PASSWORD
```

Run server:
```
python3 server.py
```

Open App in localHost and enjoy dogTinder!

### Features 

## Login
![alt text](https://res.cloudinary.com/dogtinder/image/upload/v1600112143/dogTinder/login_f9id9b.png)

## User profile
![alt text](https://res.cloudinary.com/dogtinder/image/upload/v1600112144/dogTinder/Screen_Shot_2020-09-14_at_10.50.38_AM_vkhlsk.png)

## Like or skip users
![alt text](https://res.cloudinary.com/dogtinder/image/upload/v1600112146/dogTinder/Screen_Shot_2020-09-14_at_10.50.07_AM_jbd5dw.png)

## Matches
![alt text](https://res.cloudinary.com/dogtinder/image/upload/v1600112147/dogTinder/Screen_Shot_2020-09-14_at_10.50.22_AM_cagyof.png)

## Match user details
![alt text](https://res.cloudinary.com/dogtinder/image/upload/v1600112148/dogTinder/Screen_Shot_2020-09-14_at_10.50.57_AM_wbz0th.png)

## Chat
![alt text](https://res.cloudinary.com/dogtinder/image/upload/v1600112144/dogTinder/Screen_Shot_2020-09-14_at_10.53.53_AM_wxfwth.png)

Please, share DogTinder with your fluffy friends! 

