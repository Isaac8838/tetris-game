import { createContext, useContext, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
// import { FaLock, FaPlay } from "react-icons/fa";

const TableContext = createContext();
const Table = ({ children, cols }) => {
    const [showJumpTable, setShowJumpTable] = useState(false);

    return (
        <TableContext.Provider
            value={{ cols, showJumpTable, setShowJumpTable }}
        >
            {children}
        </TableContext.Provider>
    );
};
const Container = ({ children }) => {
    return (
        <div className="relative flex h-[68%] max-h-[550px] w-full flex-col gap-4 overflow-auto rounded-2xl border-8 border-custom-blue_border bg-custom-blue_border">
            {children}
        </div>
    );
};
const Header = ({ titles }) => {
    const { cols } = useContext(TableContext);
    const style = {
        gridTemplateColumns: cols,
    };

    return (
        <div className="grid bg-custom-blue_border py-8" style={style}>
            {titles.map((title, i) => (
                <div key={i} className="text-center text-2xl text-white">
                    {title}
                </div>
            ))}
        </div>
    );
};

const RankBody = ({ data, rank }) => {
    const { cols } = useContext(TableContext);
    const style = {
        gridTemplateColumns: cols,
    };
    const date = new Date(data.created_at);

    // 提取月份（0-11，所以需要加1）和日期
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${month}/${day}`;

    return (
        <div
            className="grid bg-custom-blue_bg py-4 text-xl text-white"
            style={style}
        >
            <div className="py-2 text-center">#{rank}</div>
            <div className="py-2 text-center">{data.owner}</div>
            <div className="py-2 text-center">{data.score}</div>
            <div className="py-2 text-center">{data.level}</div>
            <div className="py-2 text-center">{formattedDate}</div>
        </div>
    );
};

const ListScoreBody = ({ data }) => {
    const { cols } = useContext(TableContext);

    const style = {
        gridTemplateColumns: cols,
    };
    const date = new Date(data.created_at);

    // 提取月份（0-11，所以需要加1）和日期
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}/${month}/${day}`;

    return (
        <div
            className="grid bg-custom-blue_bg py-4 text-xl text-white"
            style={style}
        >
            <div className="py-2 text-center">#{data.id}</div>
            <div className="py-2 text-center">{data.owner}</div>
            <div className="py-2 text-center">{data.score}</div>
            <div className="py-2 text-center">{data.level}</div>
            <div className="py-2 text-center">{formattedDate}</div>
        </div>
    );
};

const RoomBody = ({ room }) => {
    const { cols } = useContext(TableContext);

    const style = {
        gridTemplateColumns: cols,
    };

    return (
        <div
            className="grid items-center bg-custom-blue_bg py-4 text-xl text-custom-white_text"
            style={style}
        >
            <div className="py-2 text-center">{room.id}</div>
            <div className="py-2 text-center">{room.room_name}</div>
            <div className="py-2 text-center">{room.owner}</div>
        </div>
    );
};

const Footer = ({ page, setPage, data_length }) => {
    const { setShowJumpTable } = useContext(TableContext);

    const handleJump = () => {
        setShowJumpTable(true);
    };

    const handlePre = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (data_length < 5) return;
        setPage(page + 1);
    };

    return (
        <div className="mt-5 flex items-center gap-9">
            <span disabled={page === 1} onClick={handlePre}>
                <HiOutlineChevronLeft className="aspect-square h-8 cursor-pointer rounded-full bg-black text-3xl text-white" />
            </span>
            <div className="text-3xl" onClick={handleJump}>
                {page}
            </div>
            <span onClick={handleNext}>
                <HiOutlineChevronRight className="aspect-square h-8 cursor-pointer rounded-full bg-black text-3xl text-white" />
            </span>
        </div>
    );
};

Table.Container = Container;
Table.Header = Header;
Table.RankBody = RankBody;
Table.ListScoreBody = ListScoreBody;
Table.Footer = Footer;
Table.RoomBody = RoomBody;

export default Table;
