export const opponentDatainitialState = {
    player: "no player",
    ready: 0,
    gameState: 0,
    data: {
        board: [],
        stats: {
            level: 0,
            lines: 1,
            score: 0,
        },
    },
};

export const opponentDataReducer = (state, action) => {
    // console.log("action.payload", action.payload);
    switch (action.type) {
        case "receiveOpponentData":
            return {
                ...state,
                player: action.payload.player,
                ready: action.payload.ready,
                gameState: action.payload.gameState,
                data: {
                    ...state.data,
                    ...action.payload.data,
                },
            };
        case "resetOpponentData":
            console.log("重置對手");
            return opponentDatainitialState;
        default:
            return state;
    }
};
