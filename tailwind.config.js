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
                    '300': '#6A75E1', // Azul suave claro
                    '700': '#4A52B3', // Azul suave oscuro
                },
                customWhite: {
                    '300': '#f1f5f9',
                    '500': '#FFFFFF',
                },
                customBlack: {
                    '300': '#64748b',
                    '500': '#334155',
                },
                customGray: {
                    '300': '#F3F4F6', // Light Gray for backgrounds
                    '500': '#D1D5DB', // Medium Gray for borders and secondary text
                },
                customOrange: {
                    '400': '#FFB347', // Naranja suave para resaltar
                },
                primaryText: {
                    '500': '#333333', // Primary Text Color
                },
                secondaryText: {
                    '500': '#666666', // Secondary Text Color
                },
                pastelPink: {
                    '500': '#FFD1DC', // Pastel Pink
                },
                pastelGreen: {
                    '500': '#D1FFD6', // Pastel Green
                },
                pastelYellow: {
                    '500': '#FFF9D1', // Pastel Yellow
                },
                pastelPurple: {
                    '500': '#E1D1FF', // Pastel Purple
                },

            },
        },
        plugins: [],
    }
}
