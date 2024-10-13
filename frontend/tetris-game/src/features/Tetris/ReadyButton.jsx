import { useDispatch } from "react-redux";
import { setGameState } from "./TetrisSlice";

const ReadyButton = () => {
    // const { gameReadyHandler } = useReady();
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => dispatch(setGameState(1))}
            className="absolute left-1/2 top-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-custom-red_bg px-10 py-2 text-3xl text-custom-white_text"
        >
            Ready
        </button>
    );
};

export default ReadyButton;
