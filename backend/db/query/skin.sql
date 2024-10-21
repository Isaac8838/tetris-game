-- name: CreateSkin :one
INSERT INTO skins (
    owner,
    skin_id,
    default_skin
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetDefaultSkin :one
SELECT * FROM skins
WHERE owner = $1 AND default_skin IS TRUE
LIMIT 1;

-- name: UpdateSkin :one
UPDATE skins
SET
    default_skin = COALESCE(sqlc.arg(default_skin), default_skin)
WHERE
    owner = sqlc.arg(owner) AND skin_id = sqlc.arg(skin_id)
RETURNING *;

-- name: ListSkins :many
SELECT * FROM skins
WHERE owner = $1
ORDER BY skin_id ASC;