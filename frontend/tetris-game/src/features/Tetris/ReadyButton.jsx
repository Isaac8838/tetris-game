import { useReady } from "./useReady";

const ReadyButton = () => {
    const { setReady } = useReady();
    return (
        <button
            onClick={() => setReady(true)}
            className="absolute left-1/2 top-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-custom-red_bg px-10 py-2 text-3xl text-custom-white_text"
        >
            Ready
        </button>
    );
};

export default ReadyButton;
