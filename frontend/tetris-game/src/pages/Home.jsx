import React from "react";
import HomeLink from "features/Home/HomeLink";

const Home = () => {
    return (
        <div
            className="h-full bg-no-repeat bg-center bg-contain max-h-[600px] my-auto relative"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/img/Tetris-logo.png)`,
            }}
        >
            <ul className="absolute left-1/2 top-1/2 -translate-y-2 -translate-x-[50%] flex flex-col gap-[3%] h-[45%] justify-center w-44">
                <HomeLink to="/game">Start</HomeLink>
                <HomeLink to="/rank">Rank</HomeLink>
                <HomeLink to="/listScore">List Score</HomeLink>
                <HomeLink to="/achievement">Achieve</HomeLink>
            </ul>
        </div>
    );
};

export default Home;
