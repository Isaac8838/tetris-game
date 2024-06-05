package utils

const (
	NoRecord    = 0
	Score10     = 1
	Score100    = 2
	Score1000   = 3
	Score10000  = 4
	Score100000 = 5
	Level5      = 6
	Level10     = 7
	Level15     = 8
	Level20     = 9
	Level25     = 10
)

const (
	ScoreOffset = 1
	LevelOffset = 6
	ScoreRange  = 5
	LevelRange  = 10
)

var Achievements = map[int32]int64{
	NoRecord:    0,
	Score10:     10,
	Score100:    100,
	Score1000:   1000,
	Score10000:  10000,
	Score100000: 100000,
	Level5:      5,
	Level10:     10,
	Level15:     15,
	Level20:     20,
	Level25:     25,
}
