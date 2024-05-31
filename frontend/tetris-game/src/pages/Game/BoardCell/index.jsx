import './index.css';

const BoardCell = ({ cell }) => {
    return <div className={`BoardCell ${cell.className}`}></div>;
};

export default BoardCell;
