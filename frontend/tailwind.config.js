/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    darkMode: "class",
    content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans]
            },
            backgroundImage: {
                home: "url('/images/home.png')"
            },
            fontSize: {
                xss: '0.7rem'
            }
        }
    },
    plugins: [require("@tailwindcss/forms")]
};
