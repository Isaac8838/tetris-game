const Input = ({ Icon, register, Iid, type = "text", validateRule }) => {
    return (
        <div className="relative">
            <label
                htmlFor="username"
                className=" absolute left-3 top-1/2 -translate-y-1/2 text-xl
"
            >
                <Icon />
            </label>

            <input
                id={Iid}
                placeholder={Iid}
                type={type}
                {...register(Iid, validateRule)}
                className=" focus:outline-none rounded-xl py-1 pl-10 w-full text-2xl"
            />
        </div>
    );
};

export default Input;
