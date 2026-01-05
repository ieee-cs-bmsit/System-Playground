/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'comic-yellow': '#FFE800',
                'comic-blue': '#33DDFF',
                'comic-pink': '#FF44CC',
                'comic-cream': '#F9F4E0',
                'comic-dark': '#121212',
            },
            fontFamily: {
                'comic': ['"Bangers"', 'cursive'],
                'body': ['"Comic Neue"', 'cursive'],
            },
            boxShadow: {
                'comic': '4px 4px 0px 0px #000000',
                'comic-lg': '8px 8px 0px 0px #000000',
                'comic-hover': '2px 2px 0px 0px #000000',
            },
            backgroundImage: {
                'halftone-dots': 'radial-gradient(circle, #000 1px, transparent 1px)',
                'halftone-dots-white': 'radial-gradient(circle, #fff 1px, transparent 1px)',
            },
            backgroundSize: {
                'halftone': '20px 20px',
            }
        },
    },
    plugins: [],
}
