import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { reset } from "./TetrisSlice";

const className =
    "block bg-custom-orange_bg rounded-full px-4 py-2 text-center text-xl text-custom-white_text cursor-pointer hover:bg-custom-red_bg";

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
