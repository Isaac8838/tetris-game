import { Link } from "react-router-dom";

const HomeLink = ({ to, children }) => {
    return (
        <li className="w-full hover:bg-sky-500 flex  rounded-xl overflow-hidden">
            <Link
                to={to}
                className="text-3xl text-white px-2 py-2 w-full h-full flex justify-center"
            >
                {children}
            </Link>
        </li>
    );
};
export default HomeLink;
