import "./index.css"

export const BoardCell = ({cell,where}) => {

    return(
        <div className={`BoardCell ${cell.className}`}>
            <div className="Sparkle"></div>
        </div>
    );
}
