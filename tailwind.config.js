/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './Views/**/*.pug', // Asegúrate de que esta ruta sea correcta
  ],
  theme: {
    extend: {
      colors: {
        negro: '#08070D',
        blanco: '#FFFFFF',
        vino: '#3D001D',
        verde: '#657153',
        rosaF: '#964A4F',
      },
    },
  },
  plugins: [],
}

