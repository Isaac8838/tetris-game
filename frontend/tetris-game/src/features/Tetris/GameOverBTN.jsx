import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { reset } from "./TetrisSlice";

const className =
    "block bg-sky-600 rounded-[3px] px-4 text-center cursor-pointer hover:bg-blue-700";

const GameOverBTN = ({ to, label }) => {
    const dispatch = useDispatch();

    if (to)
        return (
            <Link to={to} className={className} replace>
                {label}
            </Link>
        );

    return (
        <div className={className} onClick={() => dispatch(reset())}>
            {label}
        </div>
    );
};

export default GameOverBTN;
