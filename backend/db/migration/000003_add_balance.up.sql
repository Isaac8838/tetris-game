CREATE TABLE "balances" (
  "owner" varchar PRIMARY KEY NOT NULL,
  "balance" bigint,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "scores" ("owner");

CREATE INDEX ON "achievements" ("owner");

CREATE INDEX ON "balances" ("owner");

ALTER TABLE "balances" ADD FOREIGN KEY ("owner") REFERENCES "users" ("username") ON DELETE CASCADE;