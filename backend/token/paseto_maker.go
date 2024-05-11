package token

import (
	"strings"
	"time"

	"aidanwoods.dev/go-paseto"
	"github.com/google/uuid"
)

type PasetoMaker struct {
	symmetricKey paseto.V4SymmetricKey
}

func NewPasetoMaker() Maker {
	key := paseto.NewV4SymmetricKey()

	maker := &PasetoMaker{
		symmetricKey: key,
	}

	return maker
}

func (maker *PasetoMaker) CreateToken(username string, duration time.Duration) (string, *Payload, error) {
	payload, err := NewPayload(username, duration)
	if err != nil {
		return "", payload, err
	}

	token := paseto.NewToken()

	token.Set("id", payload.ID)
	token.Set("username", payload.Username)
	token.SetIssuedAt(payload.IssuedAt)
	token.SetExpiration(payload.ExpiredAt)

	EncryptToken := token.V4Encrypt(maker.symmetricKey, nil)
	return EncryptToken, payload, nil
}

func (maker *PasetoMaker) VerifyToken(token string) (*Payload, error) {
	parser := paseto.NewParser()
	parser.AddRule(paseto.NotExpired())
	parsedToken, err := parser.ParseV4Local(maker.symmetricKey, token, nil)
	if err != nil {
		if strings.Contains(err.Error(), "expired") {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	payload, err := getPayloadFromToken(parsedToken)
	if err != nil {
		return payload, ErrInvalidToken
	}

	return payload, nil
}

func getPayloadFromToken(t *paseto.Token) (*Payload, error) {
	id, err := t.GetString("id")
	if err != nil {
		return nil, err
	}

	username, err := t.GetString("username")
	if err != nil {
		return nil, err
	}

	issuedAt, err := t.GetIssuedAt()
	if err != nil {
		return nil, err
	}

	expiredAt, err := t.GetExpiration()
	if err != nil {
		return nil, err
	}

	payload := &Payload{
		ID:        uuid.MustParse(id),
		Username:  username,
		IssuedAt:  issuedAt,
		ExpiredAt: expiredAt,
	}

	return payload, nil
}
