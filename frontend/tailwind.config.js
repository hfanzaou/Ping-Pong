/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        in: {
          '0%': { "border-radius": "50%" },
          '100%': { "border-radius": "37%" },
        },
        out: {
          '0%': { "border-radius": "37%" },
          '100%': { "border-radius": "50%" },
        }
      },
      animation: {
        in: 'in 250ms forwards',
        out: 'out 250ms forwards'
      },
      colors: {
        discord1: "#1e2124",
        discord2: "#282b30",
        discord3: "#36393e",
        discord4: "#424549",
        discord5: "#7289da",
        discord6: "#f1faee"
      },
      fontFamily: {
        Inconsolata: ["Inconsolata", "monospace"]
      },
      width: {
        '99': '99%',
      },
      maxHeight: {
        '90': '90vh'
      }
    },
  },
  plugins: [],
}

