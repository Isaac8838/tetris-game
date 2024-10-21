package api

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/isaac8838/tetris-game/utils"
)

type TetrisServer struct {
	config     utils.Config
	dbqtx      db.DBQTx
	router     *gin.Engine
	tokenMaker token.Maker
	helper     Helper
}

func NewServer(config utils.Config, dbqtx db.DBQTx, helper Helper) (*TetrisServer, error) {
	tokenMaker := token.NewPasetoMaker()
	server := &TetrisServer{
		config:     config,
		dbqtx:      dbqtx,
		tokenMaker: tokenMaker,
		helper:     helper,
	}

	server.SetupRouter()
	return server, nil
}

func (server *TetrisServer) SetupRouter() {
	router := gin.Default()

	config := cors.DefaultConfig()

	config.AllowOrigins = []string{"http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:3001", server.config.AccessOrigin}

	config.AddAllowHeaders("Authorization")
	config.AllowCredentials = true

	router.Use(cors.New(config))

	router.GET("/", server.healthCheck)

	router.POST("/api/tokens/renew_access", server.renewToken)
	router.POST("/api/users", server.createUser)
	router.POST("/api/users/login", server.loginUser)
	router.GET("/api/scores", server.listScores)
	router.GET("/api/rank/scores", server.rankByScore)
	router.GET("/api/rank/levels", server.rankByLevel)
	router.GET("/api/achievements", server.listAchievements)
	router.GET("/api/skin/list_skin_prices", server.listSkinPrices)

	authRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))
	authRoutes.POST("/api/scores", server.createScore)
	authRoutes.GET("/api/users", server.userProfile)
	authRoutes.GET("/api/balance", server.getBalance)
	authRoutes.GET("/api/skin/default", server.getDefaultSkin)
	authRoutes.POST("/api/skin/purchase", server.purchaseSkin)
	authRoutes.POST("/api/skin/set_default", server.setDefaultSkin)
	authRoutes.GET("/api/skin/list_skins", server.listSkins)
	server.router = router
}

func (server *TetrisServer) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
