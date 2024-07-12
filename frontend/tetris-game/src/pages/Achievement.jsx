import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Spinner from "ui/Spinner";
import { listAchievementsAPI } from "utils/WebAPI";

const achievements = {
    1: {
        label: "SCORE 10達成",
        component: CoperMedal,
        achieved_at: "",
        achieve: false,
    },
    2: {
        label: "SCORE 100達成",
        component: SliverMedal,
        achieved_at: "",
        achieve: false,
    },
    3: {
        label: "SCORE 1000達成",
        component: GoldMedal,
        achieved_at: "",
        achieve: false,
    },
    4: {
        label: "SCORE 10000達成",
        component: PlatinumMedal,
        achieved_at: "",
        achieve: false,
    },
    5: {
        label: "SCORE 100000達成",
        component: DiamondMedal,
        achieved_at: "",
        achieve: false,
    },
    6: {
        label: "LEVEL 5達成",
        component: CoperLevel,
        achieved_at: "",
        achieve: false,
    },
    7: {
        label: "LEVEL 10達成",
        component: SliverLevel,
        achieved_at: "",
        achieve: false,
    },
    8: {
        label: "LEVEL 15達成",
        component: GoldLevel,
        achieved_at: "",
        achieve: false,
    },
    9: {
        label: "LEVEL 20達成",
        component: PlatinumLevel,
        achieved_at: "",
        achieve: false,
    },
    10: {
        label: "LEVEL 25達成",
        component: DiamondLevel,
        achieved_at: "",
        achieve: false,
    },
};

const Achievement = () => {
    const username = useSelector((state) => state.user.username);

    const { data, isLoading } = useQuery({
        queryKey: ["achievements"],
        queryFn: () => listAchievementsAPI({ username }),
    });

    if (isLoading) {
        return <Spinner />;
    }

    if (data) {
        for (let i = 0; i < data.length; i++) {
            achievements[data[i].achievement_id].achieve = true;
            const date = new Date(data[i].achieved_at);

            // 提取月份（0-11，所以需要加1）和日期
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const formattedDate = `${month}/${day}`;

            achievements[data[i].achievement_id].achieved_at = formattedDate;
        }
    }
    return (
        <div className=" w-[60%] max-w-[650px] h-[75%] max-h-[600px] m-auto overflow-auto border-4 border-violet-700 rounded-md bg-indigo-950 ">
            <ul className="flex flex-col gap-4">
                {Object.entries(achievements).map(([id, achievement]) => (
                    <li
                        key={id}
                        className="flex items-center gap-14 px-10  py-5  relative  bg-violet-950"
                    >
                        <div
                            className="w-24 aspect-square"
                            style={{
                                filter:
                                    achievement.achieve || "grayscale(100%)",
                            }}
                        >
                            <achievement.component />
                        </div>
                        <div
                            className=" text-3xl text-white"
                            style={{ color: !achievement.achieve && "gray" }}
                        >
                            {achievement.label}
                        </div>
                        {achievement.achieve && (
                            <div className=" absolute right-4 bottom-1 text-stone-400 ">
                                {achievement.achieved_at}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

function CoperMedal() {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                    fill="#B87333"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
                    stroke="#ffffff"
                    strokeLinecap="1.2"
                ></path>{" "}
                <path
                    d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
                <path
                    d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
            </g>
        </svg>
    );
}

function SliverMedal() {
    return (
        <svg
            width="100px"
            height="100px"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                    fill="#C0C0C0"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                ></path>{" "}
                <path
                    d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
                <path
                    d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
            </g>
        </svg>
    );
}

function GoldMedal() {
    return (
        <svg
            width="100px"
            height="100px"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                    fill="#FFD700"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                ></path>{" "}
                <path
                    d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
                <path
                    d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
            </g>
        </svg>
    );
}

function PlatinumMedal() {
    return (
        <svg
            width="100px"
            height="100px"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                    fill="#f0e99d"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                ></path>{" "}
                <path
                    d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
                <path
                    d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
            </g>
        </svg>
    );
}

function DiamondMedal() {
    return (
        <svg
            width="100px"
            height="100px"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                    fill="#7abfff"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                ></path>{" "}
                <path
                    d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
                <path
                    d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                ></path>{" "}
            </g>
        </svg>
    );
}

function CoperLevel() {
    return (
        <svg
            fill="#ffffff"
            width="100px"
            height="100px"
            viewBox="-9.28 -9.28 50.56 50.56"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            strokeWidth="0.00032"
        >
            <g
                id="SVGRepo_bgCarrier"
                strokeWidth="0"
                transform="translate(0,0), scale(1)"
            >
                <path
                    transform="translate(-9.28, -9.28), scale(3.16)"
                    fill="#B87333"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="0.128"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <defs>
                    {" "}
                    <style>{".cls-1 { fill: none; }"}</style>
                </defs>{" "}
                <path d="M26,30H6a2.0023,2.0023,0,0,1-2-2V4A2.0023,2.0023,0,0,1,6,2H26a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,26,30ZM6,4V28H26V4Z"></path>{" "}
                <rect
                    x="10"
                    y="13"
                    width="12"
                    height="2"
                    transform="translate(32 28) rotate(-180)"
                ></rect>{" "}
                <rect
                    x="12"
                    y="18"
                    width="8"
                    height="2"
                    transform="translate(32 38) rotate(-180)"
                ></rect>{" "}
                <rect
                    id="_Transparent_Rectangle_"
                    data-name="<Transparent Rectangle>"
                    className="cls-1"
                    width="32"
                    height="32"
                ></rect>{" "}
            </g>
        </svg>
    );
}

function SliverLevel() {
    return (
        <svg
            fill="#ffffff"
            width="100px"
            height="100px"
            viewBox="-11.52 -11.52 55.04 55.04"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            strokeWidth="0.00032"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-11.52, -11.52), scale(3.44)"
                    fill="#C0C0C0"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <defs>
                    {" "}
                    <style>{" .cls-1 {fill: none}   "}</style>{" "}
                </defs>{" "}
                <path d="M26,30H6a2.0023,2.0023,0,0,1-2-2V4A2.0023,2.0023,0,0,1,6,2H26a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,26,30ZM6,4V28H26V4Z"></path>{" "}
                <rect
                    x="10"
                    y="13"
                    width="12"
                    height="2"
                    transform="translate(32 28) rotate(-180)"
                ></rect>{" "}
                <rect
                    x="12"
                    y="18"
                    width="8"
                    height="2"
                    transform="translate(32 38) rotate(-180)"
                ></rect>{" "}
                <rect
                    id="_Transparent_Rectangle_"
                    data-name="<Transparent Rectangle>"
                    className="cls-1"
                    width="32"
                    height="32"
                ></rect>{" "}
            </g>
        </svg>
    );
}

function GoldLevel() {
    return (
        <svg
            fill="#ffffff"
            width="100px"
            height="100px"
            viewBox="-11.52 -11.52 55.04 55.04"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            strokeWidth="0.00032"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-11.52, -11.52), scale(3.44)"
                    fill="#FFD700"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <defs>
                    {" "}
                    <style>{" .cls-1 { fill: none; }"} </style>{" "}
                </defs>{" "}
                <path d="M26,30H6a2.0023,2.0023,0,0,1-2-2V4A2.0023,2.0023,0,0,1,6,2H26a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,26,30ZM6,4V28H26V4Z"></path>{" "}
                <rect
                    x="10"
                    y="13"
                    width="12"
                    height="2"
                    transform="translate(32 28) rotate(-180)"
                ></rect>{" "}
                <rect
                    x="12"
                    y="18"
                    width="8"
                    height="2"
                    transform="translate(32 38) rotate(-180)"
                ></rect>{" "}
                <rect
                    id="_Transparent_Rectangle_"
                    data-name="<Transparent Rectangle>"
                    className="cls-1"
                    width="32"
                    height="32"
                ></rect>{" "}
            </g>
        </svg>
    );
}

function PlatinumLevel() {
    return (
        <svg
            fill="#ffffff"
            width="100px"
            height="100px"
            viewBox="-11.52 -11.52 55.04 55.04"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            strokeWidth="0.00032"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-11.52, -11.52), scale(3.44)"
                    fill="#f7dc82"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <defs>
                    {" "}
                    <style>{" .cls-1 { fill: none; } "}</style>{" "}
                </defs>{" "}
                <path d="M26,30H6a2.0023,2.0023,0,0,1-2-2V4A2.0023,2.0023,0,0,1,6,2H26a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,26,30ZM6,4V28H26V4Z"></path>{" "}
                <rect
                    x="10"
                    y="13"
                    width="12"
                    height="2"
                    transform="translate(32 28) rotate(-180)"
                ></rect>{" "}
                <rect
                    x="12"
                    y="18"
                    width="8"
                    height="2"
                    transform="translate(32 38) rotate(-180)"
                ></rect>{" "}
                <rect
                    id="_Transparent_Rectangle_"
                    data-name="<Transparent Rectangle>"
                    className="cls-1"
                    width="32"
                    height="32"
                ></rect>{" "}
            </g>
        </svg>
    );
}

function DiamondLevel() {
    return (
        <svg
            fill="#ffffff"
            width="100px"
            height="100px"
            viewBox="-11.52 -11.52 55.04 55.04"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            strokeWidth="0.00032"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                <path
                    transform="translate(-11.52, -11.52), scale(3.44)"
                    fill="#66b5ff"
                    d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                    strokeWidth="0"
                ></path>
            </g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <defs>
                    {" "}
                    <style>{" .cls-1 { fill: none; }"} </style>{" "}
                </defs>{" "}
                <path d="M26,30H6a2.0023,2.0023,0,0,1-2-2V4A2.0023,2.0023,0,0,1,6,2H26a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,26,30ZM6,4V28H26V4Z"></path>{" "}
                <rect
                    x="10"
                    y="13"
                    width="12"
                    height="2"
                    transform="translate(32 28) rotate(-180)"
                ></rect>{" "}
                <rect
                    x="12"
                    y="18"
                    width="8"
                    height="2"
                    transform="translate(32 38) rotate(-180)"
                ></rect>{" "}
                <rect
                    id="_Transparent_Rectangle_"
                    data-name="<Transparent Rectangle>"
                    className="cls-1"
                    width="32"
                    height="32"
                ></rect>{" "}
            </g>
        </svg>
    );
}
export default Achievement;
