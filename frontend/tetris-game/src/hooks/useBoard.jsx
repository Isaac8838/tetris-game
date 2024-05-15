import { useEffect, useState } from 'react'
import { buildBoard,nextBoard } from 'utils/Board'

export const useBoard = ({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared
}) => {
    const [board ,setboard] = useState(buildBoard({rows , columns}))
    
    useEffect(() => {
        setboard((previousBoard) => 
            nextBoard({
                board:previousBoard,
                player,
                resetPlayer,
                addLinesCleared
            })
        )
    },[player,resetPlayer,addLinesCleared])

    return [board ,setboard]
}