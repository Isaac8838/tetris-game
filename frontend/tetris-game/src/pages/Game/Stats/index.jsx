import './index.css';

const Stats = ({ stats }) => {
    return (
        <div className="stats">
            <div className="statsTitle">Score</div>
            <div className="statsContent">{stats.score}</div>
            <div className="statsTitle">Level</div>
            <div className="statsContent">{stats.level}</div>
            <div className="statsTitle">Lines</div>
            <div className="statsContent">{stats.line}</div>
        </div>
    );
};
export default Stats;
