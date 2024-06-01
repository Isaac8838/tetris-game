-- name: RankByScore :many
SELECT * FROM scores
ORDER BY score DESC
LIMIT $1
OFFSET $2;

-- name: RankByLevel :many
SELECT * FROM scores
ORDER BY level DESC
LIMIT $1
OFFSET $2;