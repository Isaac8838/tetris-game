CREATE TABLE "achievements" (
  "owner" varchar NOT NULL,
  "achievement_id" int NOT NULL,
  "achieved_at" timestamptz NOT NULL DEFAULT (now()),
  PRIMARY KEY ("owner", "achievement_id")
);

ALTER TABLE "achievements" ADD FOREIGN KEY ("owner") REFERENCES "users" ("username") ON DELETE CASCADE;