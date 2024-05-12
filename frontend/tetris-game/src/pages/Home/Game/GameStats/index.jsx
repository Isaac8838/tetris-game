import React from 'react'

import './index.css'

const GameStats = ({gameStats}) => {
    const {level , points , linesCompleted , linePerLevel } = gameStats;
    const linesToLevel = linePerLevel - linesCompleted;

    return(
        <ul className='GameStats GameStats__right'>
            <li>Level</li>
            <li className='value'>{level}</li>
            <li>Level to level</li>
            <li className='value'>{linesToLevel}</li>
            <li>points</li>
            <li className='value'>{points}</li>
        </ul>
    )
}

export default React.memo(GameStats);