package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// using bcrypt to hash password and return hashed password and error
func HashedPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("unable to hash password: %w", err)
	}
	return string(hashedPassword), nil
}

// check the provided password is correct or not
func CheckPassword(hashedPassword string, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
