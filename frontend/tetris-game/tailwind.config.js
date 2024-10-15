/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                custom: {
                    orange_bg: "#F86F03",
                    orange_text: "#FFA900",
                    purple_border: "#7C00FE",
                    purple_content: "#1C1678",
                    white_text: "#FFF6F4",
                    red_bg: "#CD113B",
                    blue_border: "#1259DF",
                    blue_bg: "#141C62",
                    blue1_bg: "#000DFF",
                    blue2_bg: "#0059FF",
                    green_bg: "#1ABA50",
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        plugin(function ({ addUtilities }) {
            const newUtilities = {
                ".text-shadow-sm": {
                    "text-shadow": "1px 1px 2px rgba(0, 0, 0, 0.5)",
                },
                ".text-shadow": {
                    "text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.5)",
                },
                ".text-shadow-lg": {
                    "text-shadow": "3px 3px 6px rgba(0, 0, 0, 0.5)",
                },
                ".text-shadow-none": {
                    "text-shadow": "none",
                },
            };
            addUtilities(newUtilities);
        }),
    ],
};
