import Spinner from "./Spinner";

const SubmitBTN = ({ children, isPending }) => {
    return (
        <button
            type="submit"
            className="bg-black rounded-xl py-1 flex justify-center items-center"
            disabled={isPending}
        >
            <p className=" text-white text-xl ">{children}</p>
            {/* <Spinner width={"20"} /> */}
            {isPending && <Spinner width={"20"} />}
        </button>
    );
};

export default SubmitBTN;
