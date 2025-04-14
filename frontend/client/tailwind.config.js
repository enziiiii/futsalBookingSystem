/** @type {import('tailwindcss').Config} */

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			zentry: [
  				'zentry',
  				'sanf-serif'
  			],
  			general: [
  				'general',
  				'sanf-serif'
  			],
  			'circular-web': [
  				'circular-web',
  				'sanf-serif'
  			],
  			'robert-medium': [
  				'robert-medium',
  				'sanf-serif'
  			],
  			'robert-regular': [
  				'robert-regular',
  				'sanf-serif'
  			]
  		},
  		colors: {
  			blue: {
  				'50': '#DFDFF0',
  				'75': '#DFDFF2',
  				'100': '#F0F2FA',
  				'200': '#010101',
  				'300': '#4FB7DD'
  			},
  			violet: {
  				'300': '#5724FF'
  			},
  			yellow: {
  				'100': '#5724FF',
  				'300': '#EDFF66'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		transitionTimingFunction: {
		'custom-ease': 'cubic-bezier(0.65, 0.05, 0.36, 1)',
		},
  	},
  },
  plugins: [],
}

