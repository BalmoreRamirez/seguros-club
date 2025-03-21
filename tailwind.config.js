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
                customBlue: {
                    '300': '#2B34D9',
                    '700': '#030A8C',
                },
                customWhite: {
                    '300': '#f1f5f9',
                    '500': '#FFFFFF',
                },
                customBlack: {
                    '300': '#64748b',
                    '500': '#334155',
                }
            },
        },
        plugins: [],
    }
}
