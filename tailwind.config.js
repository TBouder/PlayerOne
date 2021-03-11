const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './pages/**/*.js',
    './components/**/*.js'
  ],
  darkMode: false,
  theme: {
    colors: {
      gray: colors.blueGray,
      teal: colors.teal,
      green: colors.green,
      red: colors.red,
      white: colors.white,
    },
    minWidth: {
      '0': '0',
      '2': '0.5rem',
      '4': '1rem',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    extend: {
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      height: {
        '50vh': '50vh',
      },
      screens: {
        '3xl': '1800px',
      },
      animation: {
          "slide-fwd-center": "slide-fwd-center 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
          "wobble-hor-bottom": "wobble-hor-bottom 0.8s ease both",
          flip: "flip 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both",
          heartbeat: "heartbeat 1.5s ease  infinite both",
          "pulsate-fwd": "pulsate-fwd 0.5s ease both",
          shake: "shake 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both"
      },
      keyframes: {
          "slide-fwd-center": {
              "0%": {transform: "translateZ(0)"},
              to: {transform: "translateZ(160px)"}
          },
          "wobble-hor-bottom": {
            "0%,to": {transform: "translateX(0%)", "transform-origin": "50% 50%"},
            "15%": {transform: "translateX(-30px) rotate(-6deg)"},
            "30%": {transform: "translateX(15px) rotate(6deg)"},
            "45%": {transform: "translateX(-15px) rotate(-3.6deg)"},
            "60%": {transform: "translateX(9px) rotate(2.4deg)"},
            "75%": {transform: "translateX(-6px) rotate(-1.2deg)"}
          },
          heartbeat: {
              "0%": {transform: "scale(1)", "transform-origin": "center center", "animation-timing-function": "ease-out"},
              "10%": {transform: "scale(.91)", "animation-timing-function": "ease-in"},
              "17%": {transform: "scale(.98)", "animation-timing-function": "ease-out"},
              "33%": {transform: "scale(.87)", "animation-timing-function": "ease-in"},
              "45%": {transform: "scale(1)", "animation-timing-function": "ease-out"}
          },
          "pulsate-fwd": {
              "0%,to": {transform: "scale(1)"},
              "50%": {transform: "scale(1.02)"}
          },
          flip: {
            "0%": {transform: 'rotateY(0)'},
            to: {transform: 'rotateY(-180deg)'}
          },
          shake: {
            "0%,to": {transform: "rotate(0deg)", "transform-origin": "50% 50%"},
            "10%,90%": {transform: "rotate(1deg)"},
            "20%,40%,60%": {transform: "rotate(-2deg)"},
            "30%,50%,70%": {transform: "rotate(2deg)"},
            "80%": {transform: "rotate(-1deg)"}
          }
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
        backgroundColor: ['group-focus'],
        opacity: ['group-hover', 'group-focus'],
        display: ['group-hover'],
        animation: ['hover']
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
