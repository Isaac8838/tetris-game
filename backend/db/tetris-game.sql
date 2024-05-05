CREATE TABLE "users" (
  "username" varchar PRIMARY KEY,
  "hashed_password" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "scores" (
  "id" bigserial PRIMARY KEY,
  "owner" varchar NOT NULL,
  "score" bigint,
  "level" int,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "scores" ADD FOREIGN KEY ("owner") REFERENCES "users" ("username");
