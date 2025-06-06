/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F3FF',
          100: '#D6E0FF',
          200: '#ADC2FF',
          300: '#85A3FF',
          400: '#6690FF',
          500: '#3366FF',
          600: '#254EDB',
          700: '#1939B7',
          800: '#0F2693',
          900: '#091A7A'
        },
        accent: {
          50: '#FFF3F0',
          100: '#FFE0D6',
          200: '#FFC2AD',
          300: '#FFA385',
          400: '#FF8B66',
          500: '#FF7452',
          600: '#DB5639',
          700: '#B73B24',
          800: '#932414',
          900: '#7A1809'
        },
        success: {
          50: '#E6FFF5',
          100: '#B3FFE0',
          200: '#80FFCC',
          300: '#4DFFB8',
          400: '#1AFFA3',
          500: '#00E096',
          600: '#00BD7E',
          700: '#009A66',
          800: '#00774F',
          900: '#005537'
        },
        warning: {
          50: '#FFF8E6',
          100: '#FFEDB3',
          200: '#FFE280',
          300: '#FFD74D',
          400: '#FFCC1A',
          500: '#FFAA00',
          600: '#DB9200',
          700: '#B77A00',
          800: '#936100',
          900: '#7A5100'
        },
        error: {
          50: '#FFE8ED',
          100: '#FFD6E0',
          200: '#FFADC2',
          300: '#FF85A3',
          400: '#FF5C85',
          500: '#FF3D71',
          600: '#DB2A5E',
          700: '#B71A4A',
          800: '#930F36',
          900: '#7A0828'
        },
        neutral: {
          50: '#F7F9FC',
          100: '#EDF1F7',
          200: '#E4E9F2',
          300: '#C5CEE0',
          400: '#8F9BB3',
          500: '#6E788C',
          600: '#3F4654',
          700: '#2E3541',
          800: '#222B3C',
          900: '#1A2138'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 4px 0 rgba(0,0,0,0.1)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.1)',
        'dropdown': '0 4px 6px -1px rgba(0,0,0,0.1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};