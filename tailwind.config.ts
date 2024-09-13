import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            width: {
                "100" : "100px"
            },
            borderRadius: {
                custom: "12px", // Define the custom border radius
                "custom-34": '34px', // Custom name for the border radius
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
                'custom': '0 11px 34px 0 rgba(0, 0, 0, 0.2)', // Custom box shadow
            },
        },
    },
    plugins: [],
} satisfies Config;
