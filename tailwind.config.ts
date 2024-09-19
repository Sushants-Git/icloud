import { withUt } from "uploadthing/tw";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default withUt({
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fill: {
                appleBlue: "#0071e3",
                appleRed: "#ff3b30",
                applePurple: "#af52de",
                appleSelectGray: "#00000052",
                appleYellow: "#F1C100"
            },
            borderColor: {
                appleGray: "#e6e6ea",
                custom: "#aaaaae4d",
            },
            backgroundColor: {
                appleBlue: "#0071e3",
                appleRed: "#e30000",
                appleSidebarblue: "#fbfbfd",
                // No i am not crazy they literally have
                // so many shades of gray
                appleNavbarGray: "#f5f5f7",
                appleGray: "#aaaaae26",
                appleGrayishBlue: "#dceefd",
                appleDarkGray: "#00000014",
                hoverGray: "#00000014",
            },
            textColor: {
                appleTableGray: "#76767b",
                appleGray: "#0000008f",
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
}) satisfies Config;
