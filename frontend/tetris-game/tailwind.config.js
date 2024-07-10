/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Lato", "sans-serif"],
            },
            // backgroundImage: {
            //     "tetris-logo": "url('/public/Tetris-logo.png')",
            // },
        },
    },
    plugins: [],
};
