import { useSelector } from "react-redux";

const Stats = () => {
    const { score, level, lines } = useSelector((state) => state.tetris.stats);
    return (
        <div className="absolute bottom-0 left-[110%] flex h-[35%] flex-col gap-3">
            <StatsBox label={"Score"} value={score} />
            <StatsBox label={"Level"} value={level} />
            <StatsBox label={"Lines"} value={lines} />
        </div>
    );
};

const StatsBox = ({ label, value }) => {
    return (
        <div className="flex h-[30%] items-center gap-2 rounded-xl border-4 border-custom-purple_border bg-custom-purple_content px-4">
            <div className="text-xl text-white">{label}:</div>
            <div className="text-lg text-white">{value}</div>
        </div>
    );
};

export default Stats;
