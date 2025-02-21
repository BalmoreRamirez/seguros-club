/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
        },
        extend: {
            colors: {
                customGreen: {
                    '300': '#A7F3D0',
                    '500': '#6EE7B7',
                    '700': '#34D399',
                },
                customOrange: {
                    '300': '#FEB47B',
                    '500': '#FE8F2D',
                    '700': '#FB923C',
                },
                customNavy: {
                    '300': '#1E293B',
                    '500': '#011627',
                    '700': '#0F172A',
                },
                customBlue: {
                    '300': '#1E40AF',
                    '500': '#172554',
                    '700': '#1E3A8A',
                },
            },
        },
        plugins: [],
    }
}