CREATE TABLE "skins" (
  "owner" varchar NOT NULL,
  "skin_id" int NOT NULL,
  "default_skin" boolean NOT NULL
);

ALTER TABLE "skins" ADD FOREIGN KEY ("owner") REFERENCES "users" ("username");