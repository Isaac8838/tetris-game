import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearUser, setToken } from "features/User/userSlice";
import { buildBoard, detectDead, nextBoard } from "utils/Board";
import { attemptMove, attemptRotate } from "utils/PlayerController";
import { calculateScore } from "utils/Stats";
import { generateTetrominoesArr } from "utils/Tetromino";
import { createScoreAPI, renewTokenAPI } from "WebAPI";
const temp_Tetrominoes = generateTetrominoesArr();

const initialState = {
    board: buildBoard(10, 20),
    tetromino: {
        tetromino: temp_Tetrominoes.pop(),
        position: { column: 4, row: 0 },
        collide: false,
        fastDorp: false,
    },
    tetrominoes: temp_Tetrominoes,
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
                const rotateTetromino = attemptRotate({ board, tetromino });
                dispatch(setTertromino(rotateTetromino));
                break;

            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowDown":
                const [moveTetromino, _] = attemptMove({
                    board,
                    tetromino,
                    key,
                });
                dispatch(setTertromino(moveTetromino));
                break;
            case " ":
                await dispatch(setTertromino({ ...tetromino, fastDorp: true }));
                await dispatch(getTetromino());
                break;
            case "AutoDown":
                const [newTetromino, collideBottom] = attemptMove({
                    board,
                    tetromino,
                    key: "AutoDown",
                });
                await dispatch(setTertromino(newTetromino));
                if (collideBottom) {
                    await dispatch(getTetromino());
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

        await dispatch(setTertromino(newTetromino));
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

        //token到期，嘗試更新
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
        setTertromino(state, action) {
            state.tetromino = {
                tetromino: action.payload.tetromino,
                position: action.payload.position,
                collide: action.payload.collide,
                fastDorp: action.payload.fastDorp,
            };
        },
        getTetromino(state) {
            state.tetromino = {
                tetromino: state.tetrominoes.pop(),
                position: { column: 4, row: 0 },
                collide: false,
                fastDorp: false,
            };
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleKeyPress.fulfilled, (state, action) => {})
            .addCase(handleAutoDown.fulfilled, (state, action) => {})
            .addCase(handleSubmitRecord.fulfilled, (state, action) => {
                state.alreadySendRecord = true;
            });
    },
});

export const { updateBoard, setTertromino, getTetromino, setBoard, reset } =
    tetrisSlice.actions;

export default tetrisSlice.reducer;
