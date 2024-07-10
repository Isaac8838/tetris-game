import { createContext, useContext } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
const TableContext = createContext();
const Table = ({ children, cols }) => {
    return (
        <TableContext.Provider value={cols}>
            <div className=" w-[70%] max-h-[75%] h-[68%] border-4 border-violet-700 rounded-lg flex flex-col gap-4 bg-purple-950 overflow-auto relative">
                {children}
            </div>
        </TableContext.Provider>
    );
};

const Header = ({ titles }) => {
    const cols = useContext(TableContext);
    const style = {
        gridTemplateColumns: cols,
    };

    return (
        <div className="grid py-8 bg-violet-950" style={style}>
            {titles.map((title, i) => (
                <div key={i} className="text-center text-white text-2xl">
                    {title}
                </div>
            ))}
        </div>
    );
};

const RankBody = ({ data, rank }) => {
    const cols = useContext(TableContext);
    const style = {
        gridTemplateColumns: cols,
    };
    const date = new Date(data.created_at);

    // 提取月份（0-11，所以需要加1）和日期
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 格式化成你想要的形式
    const formattedDate = `${month}/${day}`;

    return (
        <div
            className="grid py-4 text-white bg-violet-900 text-xl"
            style={style}
        >
            <div className="text-center py-2">#{rank}</div>
            <div className="text-center py-2">{data.owner}</div>
            <div className="text-center py-2">{data.score}</div>
            <div className="text-center py-2">{data.level}</div>
            <div className="text-center py-2">{formattedDate}</div>
        </div>
    );
};

const Footer = ({ page, setPage }) => {
    const handlePre = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    return (
        <div className="mt-5 flex gap-9 items-center">
            <span disabled={page === 1} onClick={handlePre}>
                <HiOutlineChevronLeft className=" text-white bg-black cursor-pointer text-3xl rounded" />
            </span>
            <div className=" text-3xl">{page}</div>
            <span onClick={handleNext}>
                <HiOutlineChevronRight className=" text-white bg-black cursor-pointer text-3xl rounded" />
            </span>
        </div>
    );
};

Table.Header = Header;
Table.RankBody = RankBody;
Table.Footer = Footer;
export default Table;
