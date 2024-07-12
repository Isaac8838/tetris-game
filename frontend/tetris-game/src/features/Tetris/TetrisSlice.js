import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearUser, setToken } from "features/User/userSlice";
import { buildBoard, detectDead, nextBoard } from "utils/Board";
import { attemptMove, attemptRotate } from "utils/PlayerController";
import { calculateScore } from "utils/Stats";
import { generateTetrominoesArr } from "utils/Tetromino";
import { createScoreAPI, renewTokenAPI } from "utils/WebAPI";
const temp_Tetrominoes = generateTetrominoesArr();

const initialState = {
    board: buildBoard(10, 20),
    tetromino: {
        tetromino: temp_Tetrominoes.pop(),
        position: { column: 4, row: 0 },
        collide: false,
        fastDrop: false,
    },
    tetrominoes: temp_Tetrominoes,
    hold_tetromino: { isChanged: false, tetromino: null },
    stats: {
        score: 0,
        level: 1,
        lines: 0,
    },
    isGameOver: false,
    alreadySendRecord: false,
};

export const handleKeyPress = createAsyncThunk(
    "tetris/handleKeyPress",
    async (key, { getState, dispatch }) => {
        const { tetris } = getState();
        const { board, tetromino, isGameOver } = tetris;
        if (isGameOver) return;

        switch (key) {
            case "ArrowUp":
                const rotatedTetromino = attemptRotate({ board, tetromino });
                dispatch(setTetromino(rotatedTetromino));
                break;

            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowDown":
                const [movedTetromino] = attemptMove({ board, tetromino, key });
                dispatch(setTetromino(movedTetromino));
                break;

            case " ":
                await dispatch(setTetromino({ ...tetromino, fastDrop: true }));
                await dispatch(getTetromino());
                break;

            case "AutoDown":
                const [autoMovedTetromino, collideBottom] = attemptMove({
                    board,
                    tetromino,
                    key: "AutoDown",
                });
                await dispatch(setTetromino(autoMovedTetromino));
                if (collideBottom) {
                    await dispatch(getTetromino());
                }
                break;

            case "c":
                if (!tetris.hold_tetromino.isChanged) {
                    dispatch(holdTetromino());
                }
                break;

            default:
                break;
        }
    },
);

export const handleAutoDown = createAsyncThunk(
    "tetris/handleAutoDown",
    async (_, { getState, dispatch }) => {
        const { tetris } = getState();
        const { board, tetromino } = tetris;

        const [newTetromino, collideBottom] = attemptMove({
            board,
            tetromino,
            key: "AutoDown",
        });

        await dispatch(setTetromino(newTetromino));
        if (collideBottom) {
            await dispatch(getTetromino());
        }
    },
);

export const handleSubmitRecord = createAsyncThunk(
    "tetris/handleSubmitRecord",
    async (_, { getState, dispatch }) => {
        const { tetris, user } = getState();
        const { access_token_expires_at, refresh_token } = user;
        const access_token_expires = new Date(access_token_expires_at);

        if (new Date() >= access_token_expires) {
            try {
                const newTokens = await renewTokenAPI({ refresh_token });
                if (newTokens) {
                    await dispatch(setToken(newTokens));
                }
            } catch (error) {
                await dispatch(clearUser());
                console.error(error);
                return;
            }
        }

        const access_token = getState().user.access_token;
        try {
            await createScoreAPI({ stats: tetris.stats, access_token });
        } catch (error) {
            console.error(error);
        }
    },
);

export const holdTetromino = createAsyncThunk(
    "tetris/holdTetromino",
    async (_, { getState, dispatch }) => {
        const { tetris } = getState();
        const { tetromino, hold_tetromino } = tetris;

        if (hold_tetromino.isChanged) return;

        if (hold_tetromino.tetromino) {
            const temp = {
                tetromino: tetromino.tetromino,
                position: { column: 4, row: 0 },
                collide: false,
                fastDorp: false,
            };
            await dispatch(setTetromino(hold_tetromino.tetromino));
            await dispatch(
                setHoldTetromino({ isChanged: true, tetromino: temp }),
            );
        } else {
            const temp = {
                tetromino: tetromino.tetromino,
                position: { column: 4, row: 0 },
                collide: false,
                fastDorp: false,
            };
            await dispatch(getTetromino());
            await dispatch(
                setHoldTetromino({ isChanged: true, tetromino: temp }),
            );
        }
    },
);

const tetrisSlice = createSlice({
    name: "tetris",
    initialState,
    reducers: {
        setBoard(state, action) {
            state.board = action.payload;
        },
        updateBoard(state, action) {
            const { newBoard, clearLine } = nextBoard({
                board: state.board,
                tetromino: action.payload,
            });
            state.board = newBoard;
            state.stats.lines += clearLine;
            state.stats.score += calculateScore({
                clearLine,
                level: state.stats.level,
            });
            state.stats.level = Math.floor(state.stats.lines / 10) + 1;
        },
        setTetromino(state, action) {
            state.tetromino = {
                tetromino: action.payload.tetromino,
                position: action.payload.position,
                collide: action.payload.collide,
                fastDrop: action.payload.fastDrop,
            };
        },
        getTetromino(state) {
            state.tetromino = {
                tetromino: state.tetrominoes.pop(),
                position: { column: 4, row: 0 },
                collide: false,
                fastDorp: false,
            };
            state.hold_tetromino.isChanged = false;

            const isDead = detectDead({
                board: state.board,
                tetromino: state.tetromino,
            });
            if (isDead) state.isGameOver = true;
            state.tetrominoes = generateTetrominoesArr(state.tetrominoes);
        },
        reset(state) {
            const temp_Tetrominoes = generateTetrominoesArr();
            state.board = buildBoard(10, 20);
            state.tetromino = {
                tetromino: temp_Tetrominoes.pop(),
                position: { column: 4, row: 0 },
                collide: false,
                fastDorp: false,
            };
            state.tetrominoes = temp_Tetrominoes;
            state.stats = {
                score: 0,
                level: 1,
                lines: 0,
            };
            state.isGameOver = false;
            state.alreadySendRecord = false;
        },
        setHoldTetromino(state, action) {
            state.hold_tetromino = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleKeyPress.fulfilled, (state, action) => {})
            .addCase(handleAutoDown.fulfilled, (state, action) => {})
            .addCase(handleSubmitRecord.fulfilled, (state, action) => {
                state.alreadySendRecord = true;
            })
            .addCase(holdTetromino.fulfilled, (state, action) => {});
    },
});

export const {
    updateBoard,
    setTetromino,
    getTetromino,
    setBoard,
    reset,
    setHoldTetromino,
} = tetrisSlice.actions;

export default tetrisSlice.reducer;
