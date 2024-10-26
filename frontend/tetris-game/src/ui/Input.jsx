const Input = ({
    Icon,
    register,
    Iid,
    type = "text",
    validateRule,
    defaultValue,
}) => {
    return (
        <div className="relative">
            <label
                htmlFor="username"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"
            >
                <Icon />
            </label>

            <input
                id={Iid}
                placeholder={Iid}
                type={type}
                defaultValue={defaultValue}
                {...register(Iid, validateRule)}
                className="w-full rounded-xl py-1 pl-10 text-2xl shadow focus:outline-none"
            />
        </div>
    );
};

export default Input;
