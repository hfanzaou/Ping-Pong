/** @type {import('tailwindcss').Config} */
module.exports = {
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
        },
        fade: {
          from: { "opacity": 1 },
          to: { "opacity": 0 }
        }
      },
      animation: {
        in: 'in 250ms forwards',
        out: 'out 250ms forwards',
        fade: "fade 4s forwards"
      },
      colors: {
        discord1: "#1f2937",
        discord2: "#282b30",
        discord3: "#36393e",
        discord4: "#424549",
        discord5: "#15aabf",
        discord6: "#f1faee"
      },
      // fontFamily: {
      //   Inconsolata: ["Inconsolata", "monospace"]
      // },
      width: {
        '99': '99%',
      },
      maxHeight: {
        '90': '90vh'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

