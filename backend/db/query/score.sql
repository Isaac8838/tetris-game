-- name: CreateScore :one
INSERT INTO scores (
    owner,
    score,
    level
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: ListScores :many
SELECT * FROM scores
WHERE owner = $1
ORDER BY id DESC
LIMIT $2
OFFSET $3;
