package db

import (
	"context"
	"testing"
	"time"

	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/require"
)

const stringLength = 6

func createRandomUser(t *testing.T) User {
	hashedPassword, err := utils.HashedPassword(utils.CreateRandomString(6))
	require.NoError(t, err)
	require.NotEmpty(t, hashedPassword)

	arg := CreateUserParams{
		Username:       utils.CreateRandomName(),
		HashedPassword: hashedPassword,
		Email:          utils.CreateRandomEmail(),
	}

	user, err := testDBQTx.CreateUser(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, user)

	require.Equal(t, arg.Username, user.Username)
	require.Equal(t, arg.HashedPassword, user.HashedPassword)
	require.Equal(t, arg.Email, user.Email)
	require.True(t, user.PasswordChangedAt.Time.IsZero())
	require.NotZero(t, user.CreatedAt)

	return user
}

func TestCreateUser(t *testing.T) {
	createRandomUser(t)
}

func TestGetUser(t *testing.T) {
	user1 := createRandomUser(t)
	user2, err := testDBQTx.GetUser(context.Background(), user1.Username)
	require.NoError(t, err)
	require.NotEmpty(t, user2)
	require.Equal(t, user1.Username, user2.Username)
	require.Equal(t, user1.HashedPassword, user2.HashedPassword)
	require.Equal(t, user1.Email, user2.Email)
	require.WithinDuration(t, user1.PasswordChangedAt.Time, user2.PasswordChangedAt.Time, time.Second)
	require.WithinDuration(t, user1.CreatedAt.Time, user2.CreatedAt.Time, time.Second)
}

func TestUpdateUserOnlyPassword(t *testing.T) {
	oldUser := createRandomUser(t)

	newPassword := utils.CreateRandomString(stringLength)
	newHashedPassword, err := utils.HashedPassword(newPassword)
	require.NoError(t, err)
	require.NotEmpty(t, newHashedPassword)

	updatedUser, err := testDBQTx.UpdateUser(context.Background(), UpdateUserParams{
		Username: oldUser.Username,
		HashedPassword: pgtype.Text{
			String: newHashedPassword,
			Valid:  true,
		},
	})
	require.NoError(t, err)
	require.NotEmpty(t, updateUser)
	require.NotEqual(t, oldUser.HashedPassword, updatedUser.HashedPassword)
	require.Equal(t, newHashedPassword, updatedUser.HashedPassword)
	require.Equal(t, oldUser.Username, updatedUser.Username)
	require.Equal(t, oldUser.Email, updatedUser.Email)
}

func TestUpdateUserOnlyEmail(t *testing.T) {
	oldUser := createRandomUser(t)

	newEmail := utils.CreateRandomEmail()
	require.NotEmpty(t, newEmail)

	updatedUser, err := testDBQTx.UpdateUser(context.Background(), UpdateUserParams{
		Username: oldUser.Username,
		Email: pgtype.Text{
			String: newEmail,
			Valid:  true,
		},
	})
	require.NoError(t, err)
	require.NotEmpty(t, updatedUser)
	require.NotEqual(t, oldUser.Email, updatedUser.Email)
	require.Equal(t, newEmail, updatedUser.Email)
	require.Equal(t, oldUser.Username, updatedUser.Username)
	require.Equal(t, oldUser.HashedPassword, updatedUser.HashedPassword)
}

func TestUpdateUserAllFields(t *testing.T) {
	oldUser := createRandomUser(t)

	newPassword := utils.CreateRandomString(stringLength)
	newHashedPassword, err := utils.HashedPassword(newPassword)
	require.NoError(t, err)
	require.NotEmpty(t, newHashedPassword)

	newEmail := utils.CreateRandomEmail()
	require.NotEmpty(t, newEmail)

	updatedUser, err := testDBQTx.UpdateUser(context.Background(), UpdateUserParams{
		Username: oldUser.Username,
		HashedPassword: pgtype.Text{
			String: newHashedPassword,
			Valid:  true,
		},
		Email: pgtype.Text{
			String: newEmail,
			Valid:  true,
		},
	})
	require.NoError(t, err)
	require.NotEmpty(t, updatedUser)
	require.NotEqual(t, oldUser.HashedPassword, updatedUser.HashedPassword)
	require.NotEqual(t, oldUser.Email, updatedUser.Email)
	require.Equal(t, newHashedPassword, updatedUser.HashedPassword)
	require.Equal(t, newEmail, updatedUser.Email)
	require.Equal(t, oldUser.Username, updatedUser.Username)
}

func TestDeleteUser(t *testing.T) {
	user1 := createRandomUser(t)
	err := testDBQTx.DeleteUser(context.Background(), user1.Username)
	require.NoError(t, err)

	user2, err := testDBQTx.GetUser(context.Background(), user1.Username)
	require.Error(t, err)
	require.EqualError(t, err, ErrRecordNotFound.Error())
	require.Empty(t, user2)
}
