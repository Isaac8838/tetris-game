import { useState } from 'react';

export const useStats = () => {
    const [stats, setStats] = useState({
        score: 0,
        level: 1,
        line: 0,
    });
    return [stats, setStats];
};
