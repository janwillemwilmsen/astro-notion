/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,astro}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
    ],
}