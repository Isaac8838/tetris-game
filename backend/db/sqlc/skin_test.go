package db

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCreateSkin(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	skin := createRandomSkin(t, user.Username, int32(0), true)
	require.NotEmpty(t, skin)
	require.Equal(t, user.Username, skin.Owner)
}

func TestGetDefaultSkin(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	skin1 := createRandomSkin(t, user.Username, 0, true)
	skin2 := createRandomSkin(t, user.Username, 1, false)
	require.NotEmpty(t, skin1)
	require.NotEmpty(t, skin2)

	defaultSkin, err := testDBQTx.GetDefaultSkin(context.Background(), user.Username)
	require.NoError(t, err)
	require.NotEmpty(t, defaultSkin)
	require.Equal(t, skin1.Owner, defaultSkin.Owner)
	require.Equal(t, skin1.SkinID, defaultSkin.SkinID)
	require.Equal(t, skin1.DefaultSkin, defaultSkin.DefaultSkin)

}

func TestUpdateSkin(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	skin1 := createRandomSkin(t, user.Username, 0, true)
	skin2 := createRandomSkin(t, user.Username, 1, false)
	require.NotEmpty(t, skin1)
	require.NotEmpty(t, skin2)

	arg := UpdateSkinParams{
		DefaultSkin: false,
		Owner:       user.Username,
		SkinID:      skin1.SkinID,
	}

	updatedSkin1, err := testDBQTx.UpdateSkin(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, updatedSkin1)
	require.Equal(t, skin1.Owner, updatedSkin1.Owner)
	require.Equal(t, skin1.SkinID, updatedSkin1.SkinID)
	require.NotEqual(t, skin1.DefaultSkin, updatedSkin1.DefaultSkin)
}

func TestListSkins(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	skin1 := createRandomSkin(t, user.Username, 0, true)
	skin2 := createRandomSkin(t, user.Username, 1, false)
	require.NotEmpty(t, skin1)
	require.NotEmpty(t, skin2)

	skins, err := testDBQTx.ListSkins(context.Background(), user.Username)
	require.NoError(t, err)
	require.NotEmpty(t, skins)
	require.Len(t, skins, 2)
	require.Equal(t, skin1.Owner, skins[0].Owner)
	require.Equal(t, skin1.SkinID, skins[0].SkinID)
	require.Equal(t, skin1.DefaultSkin, skins[0].DefaultSkin)
	require.Equal(t, skin2.Owner, skins[1].Owner)
	require.Equal(t, skin2.SkinID, skins[1].SkinID)
	require.Equal(t, skin2.DefaultSkin, skins[1].DefaultSkin)

}

func createRandomSkin(t *testing.T, owner string, skinID int32, defaultSkin bool) Skin {
	arg := CreateSkinParams{
		Owner:       owner,
		SkinID:      skinID,
		DefaultSkin: defaultSkin,
	}
	skin, err := testDBQTx.CreateSkin(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, skin)
	return skin
}
