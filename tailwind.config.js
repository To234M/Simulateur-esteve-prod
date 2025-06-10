/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        'w-1': 1,
        'w-4': 4,
        'h-1': 1,
        'h-3': 3,
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.aspect-w-1': {
          position: 'relative',
          paddingBottom: 'calc(1 / 1 * 100%)',
        },
        '.aspect-w-4': {
          position: 'relative',
          paddingBottom: 'calc(3 / 4 * 100%)',
        },
        '.aspect-h-1': {
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        },
        '.aspect-h-3': {
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        },
      });
    },
  ],
};