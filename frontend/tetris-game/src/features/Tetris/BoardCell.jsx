import "styles/tetriscell.css";

const BoardCell = ({ cell }) => {
    return <div className={`tetriscell ${cell.className}`} />;
};

export default BoardCell;
