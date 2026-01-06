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
                'halftone-dots': 'radial-gradient(circle, #000 2px, transparent 2.5px)',
                'halftone-dots-white': 'radial-gradient(circle, #fff 2px, transparent 2.5px)',
                'comic-stripes': 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 50%)',
            },
            backgroundSize: {
                'halftone': '20px 20px',
                'stripes': '10px 10px',
            },
            // NEW ANIMATIONS
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            }
        },
    },
    plugins: [],
}
