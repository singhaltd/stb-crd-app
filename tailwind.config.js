module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Noto Sans Lao', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [require("daisyui"), require('tailwindcss-print-styles')],
  variants: {
    margin: ['print'],
    display: ['print']
  },
  daisyui: {
    themes: [
      {
        light: {

          "primary": "#1d4ed8",

          "secondary": "#1e40af",

          "accent": "#37CDBE",

          "neutral": "#3D4451",

          "base-100": "#FFFFFF",

          "info": "#3ABFF8",

          "success": "#16a34a",

          "warning": "#FBBD23",

          "error": "#b91c1c",
        }
      },
      "dark"
    ]
  }
}