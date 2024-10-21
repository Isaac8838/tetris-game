DB_URL=postgresql://root:root@postgres:5432/tetris-game?sslmode=disable
CI_DB_URL=postgresql://root:root@localhost:5432/tetris-game?sslmode=disable

migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up

migrateup1:
	migrate -path db/migration -database "$(DB_URL)" -verbose up 1	

migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down

migratedown1:
	migrate -path db/migration -database "$(DB_URL)" -verbose down 1

cimigrateup:
	migrate -path db/migration -database "$(CI_DB_URL)" -verbose up	

# Need to manually modify force version
migratedirty:
	migrate -path db/migration/ -database $(DB_URL) force 3

sqlc:
	sqlc generate

server:
	go run main.go

mockdb:
	mockgen -package mockdb -destination db/mock/dbqtx.go github.com/isaac8838/tetris-game/db/sqlc DBQTx

mockapi:
	mockgen -package mockapi -destination api/mock/helper.go github.com/isaac8838/tetris-game/api Helper

test:
	go test -v -cover -short ./...

.PHONY: migrateup migratedown migrateup1 migratedown1 cimigrateup sqlc server mock test