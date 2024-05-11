package token

import "time"

type Maker interface {
	// Create token with username and duration
	CreateToken(username string, duration time.Duration) (string, *Payload, error)
	// Verify whether the token is vaild
	VerifyToken(token string) (*Payload, error)
}
