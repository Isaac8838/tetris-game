import { Link } from "react-router-dom";

const HomeLink = ({ to, onClick, children }) => {
    return (
        <li className="w-full hover:bg-custom-orange_bg flex  rounded-full overflow-hidden">
            {to ? (
                <Link
                    to={to}
                    className="text-3xl text-white px-2 py-1 w-full h-full flex justify-center font-bold"
                >
                    {children}
                </Link>
            ) : (
                <button
                    className="text-3xl text-white px-2 py-1 w-full h-full flex justify-center font-bold"
                    onClick={onClick}
                >
                    {children}
                </button>
            )}
        </li>
    );
};
export default HomeLink;
