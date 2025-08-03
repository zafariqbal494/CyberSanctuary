import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			screens: {
				'xs': '480px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				neon: {
					green: '#00ff41',
					blue: '#0077ff',
				},
				cyber: {
					dark: '#0f0f0f',
					darker: '#080808',
					light: '#1e1e1e',
					'dark-light': '#141414',
					border: 'rgba(0, 255, 65, 0.3)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'collapsible-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-collapsible-content-height)' },
				},
				'collapsible-up': {
					from: { height: 'var(--radix-collapsible-content-height)' },
					to: { height: '0' },
				},
				'matrix-fall': {
					'0%': { transform: 'translateY(-100%)', opacity: '0' },
					'10%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0.3' },
				},
				'pulse-neon': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.8)' },
				},
				'glow': {
					'0%, 100%': { textShadow: '0 0 5px rgba(0, 255, 65, 0.5)' },
					'50%': { textShadow: '0 0 15px rgba(0, 255, 65, 0.8), 0 0 25px rgba(0, 255, 65, 0.4)' },
				},
				'fadeIn': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'collapsible-down': 'collapsible-down 0.2s ease-out',
				'collapsible-up': 'collapsible-up 0.2s ease-out',
				'matrix-fall': 'matrix-fall 8s linear infinite',
				'pulse-neon': 'pulse-neon 2s infinite',
				'glow': 'glow 2s infinite',
				'fadeIn': 'fadeIn 0.5s ease-in'
			},
			fontFamily: {
				mono: ['var(--font-mono)'],
				sans: ['var(--font-sans)']
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
