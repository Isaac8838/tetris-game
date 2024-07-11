const SubmitBTN = ({ children }) => {
    return (
        <button
            type="submit"
            className="bg-black rounded-xl py-1 flex justify-center items-center relative"
        >
            <p className=" text-white text-xl ">{children}</p>
        </button>
    );
};

export default SubmitBTN;
