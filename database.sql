CREATE TABLE "user" (
  "user_id" SERIAL PRIMARY KEY,
  "user_name" varchar,
  "password" varchar,
  "email" varchar,
  "breed" varchar,
  "image" image,
  "location" varchar,
  "gender" varchar,
  "summary" text,
  "preferences" text
);

CREATE TABLE "image" (
  "image_id" int,
  "image_url" varchar,
  "user_id" int
);

CREATE TABLE "like" (
  "like_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "user_id_of_liked_user" int
);

CREATE TABLE "dislike" (
  "dislike_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "user_id_of_disliked_user" int
);

ALTER TABLE "user" ADD FOREIGN KEY ("user_id") REFERENCES "image" ("user_id");

ALTER TABLE "user" ADD FOREIGN KEY ("user_id") REFERENCES "like" ("user_id");

ALTER TABLE "user" ADD FOREIGN KEY ("user_id") REFERENCES "dislike" ("user_id");
