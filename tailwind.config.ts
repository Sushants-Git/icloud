import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            borderColor: {
                custom: "#aaaaae4d"
            },
            backgroundColor: {
                appleBlue: "#0071e3",
                appleRed: "#e30000",
                appleGray: "#aaaaae26"
            },
            textColor: {
                appleBlue: "#0071e3",
                appleRed: "#e30000",
            },
            width: {
                "100": "100px",
            },
            height: {
                "44": "44px",
            },
            borderRadius: {
                custom: "12px", // Define the custom border radius
                customHalf: "10px", // Define the custom border radius
                "custom-34": "34px", // Custom name for the border radius
            },
            colors: {
                "custom-gray": "#6e6e73",
            },
            fontFamily: {
                "sf-pro": ["SF Pro Text", "sans-serif"],
            },
            fontWeight: {
                black: "900",
                bold: "700",
                regular: "400",
            },
            boxShadow: {
                custom: "0 11px 34px 0 rgba(0, 0, 0, 0.2)", // Custom box shadow
            },
            backgroundImage: {
                "custom-radial":
                    "radial-gradient(circle at 25%, hsla(0, 0%, 100%, .2), rgba(50, 50, 50, .2) 80%)",
            },
            backdropBlur: {
                "14px": "14px",
            },
        },
    },
    plugins: [],
} satisfies Config;
