import "./index.css"

import { Action , actionForKey} from 'utils/Input'
import { playerController} from "utils/PlayerController"
const GameController = ({
    board,
    gameStats,
    player,
    setGameOver,
    setPlayer
}) => {
    const onKeyUp = ({ code }) => {
        const action = actionForKey(code);

        if(action === Action.Quit) {
            // setGameOver(true)
            console.log("game over")
        }
    }

    const onKeyDown = ({ code }) => {
        const action = actionForKey(code)
        handleInput({ action })
    }

    const handleInput = ({ action }) => {
        // console.log("收到",action)
        playerController({
            action,
            board,
            player,
            setPlayer,
            setGameOver
        })
    }

    return(
        <input
            className="GameController"
            type="text"
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            autoFocus
        />
    )
}

export default GameController;