package utils

import (
	"fmt"
	"math/rand"
	"strings"
)

const alphabet = "abcdefghijklmnopqrstuvwxyz"
const stringLength = 6

func CreateRandomNumber(min, max int64) int64 {
	return min + rand.Int63n(max-min+1)
}

func CreateRandomString(length int) string {
	var sb strings.Builder
	k := len(alphabet)

	for i := 0; i < length; i++ {
		c := alphabet[rand.Intn(k)]
		sb.WriteByte(c)
	}

	return sb.String()
}

func CreateRandomName() string {
	return CreateRandomString(stringLength)
}

func CreateRandomEmail() string {
	return fmt.Sprintf("%s@email.com", CreateRandomString(stringLength))
}
