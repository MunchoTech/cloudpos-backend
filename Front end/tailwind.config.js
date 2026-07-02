/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#00D4AA',
        dark:     '#041520',
        surface:  '#0B1E30',
        card:     '#0D2137',
        border:   '#1E3A52',
        muted:    '#4A6B85',
        light:    '#8BA4BE',
        bright:   '#C8D8E8',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse at center, rgba(0,212,170,0.08) 0%, transparent 70%)',
        'card-glow':  'radial-gradient(ellipse at top left, rgba(0,212,170,0.05) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
