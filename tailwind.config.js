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
      amber: colors.amber,
      pink: colors.pink,
      green: colors.green,
      emerald: colors.emerald,
      orange: colors.orange,
      red: colors.red,
      white: colors.white,
    },
    extend: {
      typography: {
        xl: {
          css: {
            a: {
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
      },
      colors: {
        'uniswap': {
          pink: 'rgb(255, 0, 122)',
          600: 'rgba(189, 0, 255, 0.2)',
          800: '#BD00FF',
        },
        '1inch': {
          600: 'rgba(223, 235, 255, 1)',
          800: 'rgba(85, 153, 255, 1)',
        },
        'sushiswap': {
          600: 'rgba(250, 82, 160, 0.2)',
          800: 'rgba(250, 82, 160, 1)',
        },
        'yearn': {
          600: 'rgba(0, 106, 227, 0.2)',
          800: 'rgba(0, 106, 227, 1)',
        },
        'bitcoin': {
          initial: '#f7931a',
          darker: '#DF5820',
        }
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      minWidth: {
        '0': '0',
        '2': '0.5rem',
        '4': '1rem',
        '9': '2.25rem',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      height: {
        '50vh': '50vh',
        '77.5': '310px',
      },
      screens: {
        '3xl': '1800px',
      },
      animation: {
          flip: "flip 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both",
          shake: "shake 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both",
          'slide-in-right': "slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
          'slide-out-left': "slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both",
      },
      keyframes: {
          flip: {
            "0%": {transform: 'rotateY(0)'},
            to: {transform: 'rotateY(-180deg)'}
          },
          shake: {
            "0%,to": {transform: "rotate(0deg)", "transform-origin": "50% 50%"},
            "10%,90%": {transform: "rotate(2deg)"},
            "20%,40%,60%": {transform: "rotate(-4deg)"},
            "30%,50%,70%": {transform: "rotate(4deg)"},
            "80%": {transform: "rotate(-2deg)"}
          },
          'slide-in-right': {
            '0%': {transform: 'translateX(1000px)', opacity: '0'},
            to: {transform: 'translateX(0)', opacity: '1'}
          },
          'slide-out-left': {
            '0%': {transform: 'translateX(0)', opacity: '1'},
            to: {transform: 'translateX(-1000px)', opacity: '0'}
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
        animation: ['group-hover', 'hover']
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // require('tailwind-content-placeholder')({
    //   placeholders: {
    //     height: 1.25,
    //     'line': {
    //       height: '1.25', // the height of the container in em
    //       rows: [ // This class will have 4 rows:
    //         [100],
    //         [],
    //       ]
    //     },
    //   }
    // }),
  ],
}
