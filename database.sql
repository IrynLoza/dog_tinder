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
  "image_id" SERIAL PRIMARY KEY,
  "image_url" varchar,
  "user_id" int UNIQUE
);

CREATE TABLE "likes" (
  "like_id" SERIAL PRIMARY KEY,
  "user_id" int UNIQUE, 
  "target_user_id" int UNIQUE
);

CREATE TABLE "dislikes" (
  "dislike_id" SERIAL PRIMARY KEY,
  "user_id" int UNIQUE,
  "target_user_id" int UNIQUE
);

-- ALTER TABLE "users" ADD FOREIGN KEY ("user_id") REFERENCES "images" ("user_id");

-- ALTER TABLE "users" ADD FOREIGN KEY ("user_id") REFERENCES "likes" ("user_id");

-- ALTER TABLE "users" ADD FOREIGN KEY ("user_id") REFERENCES "dislikes" ("user_id");

-- ALTER TABLE "users" ADD FOREIGN KEY ("user_id") REFERENCES "likes" ("target_user_id");

-- ALTER TABLE "users" ADD FOREIGN KEY ("user_id") REFERENCES "dislikes" ("target_user_id");
