/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {
      colors:{
        primary: "#93E9E7",
        secondary: "#20B5D9",
        base: {
          DEFAULT: "#FFFFFF",
          100: "#F6F6F6", 
          200: "#EFEFEF",
          300: "#D2D3D3", 
          400: "#B1B2B2", 
          500: "#8E9090", 
          600: "#797A7B", 
          700: "#57595A", 
          800: "#363939", 
          900: "#1F2223", 
        },

      },
      fontFamily: {
        nunitoRegular: ["Nunito-Regular"],
        nunitoMedium: ["Nunito-Medium"],
        nunitoSemiBold: ["Nunito-SemiBold"],
        nunitoBold: ["Nunito-Bold"],
        nunitoExtraBold: ["Nunito-ExtraBold"],

        robotoRegular: ["Roboto-Regular"],
        robotoMedium: ["Roboto-Medium"],
        robotoBold: ["Roboto-Bold"],
      }
    },
    fontSize: {
      h1: ['40px', { lineHeight: '50px'}],
      h2: ['32px', { lineHeight: '40px' }],
      h3: ['24px', { lineHeight: '30px' }],
      h4: ['18px', { lineHeight: '22.5px' }],
      h5: ['14px', { lineHeight: '17.5px' }],
      b1r: ['16px', { lineHeight: '24px' }],
      b1b: ['16px', { lineHeight: '24px' }],
      b2r: ['14px', { lineHeight: '21px' }],
      b2b: ['14px', { lineHeight: '21px' }],
      b3r: ['12px', { lineHeight: '18px' }],
      b3b: ['12px', { lineHeight: '18px' }],
      l1r: ['16px', { lineHeight: '20px' }],
      l1b: ['16px', { lineHeight: '20px' }],
      l2r: ['14px', { lineHeight: '17.5px'}],
      l2b: ['14px', { lineHeight: '17.5px'}],
      l3r: ['12px', { lineHeight: '15px'}],
      l3b: ['12px', { lineHeight: '15px'}]
  },
  plugins: [],
}
}
