import { useSelector } from "react-redux";

const Stats = () => {
    const { score, level, lines } = useSelector((state) => state.tetris.stats);
    return (
        <div className=" absolute bottom-0 left-[110%] flex flex-col gap-3 h-[35%]">
            <StatsBox label={"Score"} value={score} />
            <StatsBox label={"Level"} value={level} />
            <StatsBox label={"Lines"} value={lines} />
        </div>
    );
};

const StatsBox = ({ label, value }) => {
    return (
        <div className="h-[30%] px-4 flex items-center border-4 border-violet-600 rounded-md bg-gray-600 gap-2">
            <div className="text-lg text-white">{label}:</div>
            <div className="text-lg text-white">{value}</div>
        </div>
    );
};

export default Stats;
