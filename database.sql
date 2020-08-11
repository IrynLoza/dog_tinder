CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "user_name" varchar,
  "password" varchar,
  "email" varchar,
  "breed" varchar,
  "location" varchar,
  "gender" varchar,
  "summary" text,
  "preferences" text
);

CREATE TABLE "images" (
  "image_id" int,
  "image_url" varchar,
  "user_id" int
);

CREATE TABLE "likes" (
  "like_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "user_id_of_liked_user" int
);

CREATE TABLE "dislikes" (
  "dislike_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "user_id_of_disliked_user" int
);

ALTER TABLE "user" ADD FOREIGN KEY ("user_id") REFERENCES "image" ("user_id");

ALTER TABLE "user" ADD FOREIGN KEY ("user_id") REFERENCES "like" ("user_id");

ALTER TABLE "user" ADD FOREIGN KEY ("user_id") REFERENCES "dislike" ("user_id");
