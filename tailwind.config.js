/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "uktena-grey-01": "#FBFCFB",
        "uktena-violet": "#8184F8",
        "uktena-dark-violet": "#262668",
        "uktena-light-violet": "#F3F6FF",
        "uktena-transparent-violet": "#282B4880",
        "uktena-white": "#FFFFFF",
        "uktena-01": "#F0F0F0",
         "uktena-02": "#DBDBDB",
         "uktena-03": "#B1B1B1",
        "uktena-dark": "#393939",
        "uktena-dark-transparent": "rgba(57, 57, 57, 0.5)",
        "uktena-dark-transparent-01": "rgba(0, 0, 0, 0.6)",
        "uktena-dark-transparent-02": "rgba(0, 0, 0, 0.2)",
        "uktena-dark-transparent-03": "rgba(0, 0, 0, 0.5)",
        "uktena-grey": "rgba(255, 255, 255, 0.2)",
        "uktena-red": "#AF0020",
        "uktena-light-red": "#FEE0DC",
        "uktena-red-01": "#FF3B30",
        "uktena-dark-red": "#710000",
        "uktena-green": "#198754",
        "uktena-light-green": "#E5FEDC",
        "uktena-transparent": "rgba(0,0,0,0)",
        "uktena-dark-neutro": "#505050",
        "uktena-grey-medium": "rgba(245, 245, 245, 0.5)",
        "uktena-black": "#000"
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1650px"
      },
      fontFamily: {
        poppins: ["Poppins"],
      }
    },
  },
  plugins: [],
  
}