-- name: CreateAchievement :one
INSERT INTO achievements (
    owner,
    achievement_id
) VALUES (
    $1, $2
)
RETURNING *;

-- name: ListAchievements :many
SELECT * FROM achievements
WHERE owner = $1
ORDER BY achievement_id
LIMIT 10;

-- name: GetAchievement :one
SELECT * FROM achievements
WHERE owner = $1 AND (achievement_id >= $2 AND achievement_id <= $3)
ORDER BY achievement_id DESC
LIMIT 1;