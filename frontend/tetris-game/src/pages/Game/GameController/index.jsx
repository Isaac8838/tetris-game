import { useEffect } from "react";

//utils
import { PlayerController, attemptMove } from "utils/PlayerController";

//hook
import { usePlayerController } from "hooks/usePlayerController";
import useInterval from "hooks/useInterval";
import { useDropTime } from "hooks/useDroptime";

const GameController = ({
    player,
    setPlayer,
    board,
    resetPlayer,
    stats,
    isGameOver,
}) => {
    const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
        stats,
        isGameOver,
    });

    const callback = () => attemptMove(player, setPlayer, board, "SlowDrop");
    useInterval({ callback, delay: dropTime });

    const [keyCodes, setKeyCodes, actionRef] = usePlayerController();

    useEffect(() => {
        if (keyCodes.length > 0 && !isGameOver) {
            const action = keyCodes[0];
            // console.log("action", action);
            PlayerController({
                action,
                player,
                setPlayer,
                board,
                resetPlayer,
                actionRef,
                pauseDropTime,
                resumeDropTime,
            });
            setKeyCodes((prev) => prev.slice(1));
        }
    }, [
        keyCodes,
        player,
        setPlayer,
        board,
        resetPlayer,
        pauseDropTime,
        resumeDropTime,
        actionRef,
        isGameOver,
        setKeyCodes,
    ]);

    return null; // 不需要返回任何内容
};

export default GameController;
