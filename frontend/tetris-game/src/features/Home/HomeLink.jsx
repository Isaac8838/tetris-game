import { Link } from "react-router-dom";

const HomeLink = ({ to, onClick, children }) => {
    return (
        <li className="w-full hover:bg-blue-500 flex  rounded-xl overflow-hidden">
            {to ? (
                <Link
                    to={to}
                    className="text-3xl text-white px-2 py-2 w-full h-full flex justify-center"
                >
                    {children}
                </Link>
            ) : (
                <button
                    className="text-3xl text-white px-2 py-2 w-full h-full flex justify-center"
                    onClick={onClick}
                >
                    {children}
                </button>
            )}
        </li>
    );
};
export default HomeLink;
