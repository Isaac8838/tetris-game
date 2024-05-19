DB_URL=postgresql://root:root@postgres:5432/tetris-game?sslmode=disable

migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up

migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down

sqlc:
	sqlc generate

server:
	go run main.go

mock:
	mockgen -package mockdb -destination db/mock/dbqtx.go github.com/isaac8838/tetris-game/db/sqlc DBQTx

.PHONY: migrateup migratedown sqlc server mock