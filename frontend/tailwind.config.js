var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: "#172017",
                    muted: "#526050",
                    soft: "#7D897B",
                },
                leaf: {
                    50: "#F2F7ED",
                    100: "#E2EBD6",
                    300: "#A4C57D",
                    500: "#618B45",
                    700: "#315529",
                    900: "#1B3117",
                },
                cream: {
                    DEFAULT: "#FBF6EE",
                    warm: "#F3E7D5",
                    soft: "#FFFDF8",
                },
                clay: {
                    DEFAULT: "#B76642",
                    dark: "#7A432D",
                },
                gold: {
                    100: "#F4E8C7",
                    300: "#DFC88D",
                    500: "#B89652",
                },
                line: {
                    DEFAULT: "#E4DDCD",
                    strong: "#C6BEAD",
                },
            },
            fontFamily: {
                sans: [
                    "Manrope",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "sans-serif",
                ],
                display: [
                    "\"Cormorant Garamond\"",
                    "Georgia",
                    "Cambria",
                    "Times New Roman",
                    "serif",
                ],
            },
            borderRadius: {
                none: "0",
                sm: "0.25rem",
                DEFAULT: "0.375rem",
                md: "0.5rem",
            },
            boxShadow: {
                xs: "0 1px 2px rgba(23, 32, 23, 0.05)",
                soft: "0 20px 48px rgba(23, 32, 23, 0.08), 0 1px 0 rgba(255, 255, 255, 0.7) inset",
                card: "0 18px 44px rgba(23, 32, 23, 0.08), 0 2px 10px rgba(23, 32, 23, 0.05)",
                lift: "0 26px 54px rgba(23, 32, 23, 0.12), 0 8px 20px rgba(23, 32, 23, 0.06)",
                float: "0 34px 90px rgba(23, 32, 23, 0.16), 0 10px 26px rgba(23, 32, 23, 0.08), 0 1px 0 rgba(255, 255, 255, 0.62) inset",
                glow: "0 0 0 1px rgba(97, 139, 69, 0.14), 0 28px 70px rgba(97, 139, 69, 0.18)",
                nav: "0 18px 50px rgba(23, 32, 23, 0.1), 0 4px 14px rgba(23, 32, 23, 0.06)",
                overlay: "0 40px 100px rgba(23, 32, 23, 0.28)",
            },
            spacing: {
                touch: "2.75rem",
            },
            transitionTimingFunction: {
                premium: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            },
            transitionDuration: {
                premium: "420ms",
            },
        },
    },
};
export default config;
