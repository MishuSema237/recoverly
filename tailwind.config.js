/* eslint-disable */
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				navy: {
					50:  "#E8EDF3",
					100: "#C5D1E0",
					200: "#9FB3CB",
					300: "#7995B6",
					400: "#5478A2",
					500: "#2E5A8D",
					600: "#1F466F",
					700: "#173653",
					800: "#13233A",
					900: "#0B1626",
				},
				gold: {
					50:  "#F8F1E4",
					100: "#F1E0C2",
					200: "#E8CC9B",
					300: "#DFB874",
					400: "#D6A44E",
					500: "#C9933A",
					600: "#A6792F",
					700: "#825F24",
					800: "#5F451A",
					900: "#3B2B10",
				},
				light: {
					50:  "#FFFFFF",
					100: "#FEFEFE",
					200: "#F5F5F5",
					300: "#EAEAEA",
					400: "#DCDCDC",
					500: "#CFCFCF",
					600: "#B1B1B1",
					700: "#8F8F8F",
					800: "#6C6C6C",
					900: "#3F3F3F",
				},
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
			screens: {
				mobile: '870px'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
