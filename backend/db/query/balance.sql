-- name: CreateBalance :one
INSERT INTO balances (
    owner,
    balance
) VALUES (
    $1, $2
)
RETURNING *;

-- name: GetBalance :one
SELECT * FROM balances
WHERE owner = $1
LIMIT 1;

-- name: UpdateBalance :one
UPDATE balances
SET
    balance = COALESCE(sqlc.arg(balance), balance),
    updated_at = COALESCE(sqlc.arg(updated_at), updated_at)
WHERE 
    owner = sqlc.arg(owner)
RETURNING *;