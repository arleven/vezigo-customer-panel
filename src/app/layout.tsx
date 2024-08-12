import '@/styles/globals.css';

import { ThemeProvider } from '@/components/theme-provider';

import type { Metadata } from 'next';
import { CartProvider } from '@/context/cart-context';

import { Poppins } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Vezigo',
	description:
		'Discover the best and fresh fruits and vegetables for all your needs'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<CartProvider>
			<html lang='en'>
				<head>
					<link
						rel='icon'
						href='/favicon.ico?refresh=1'
						sizes='any'
					/>
				</head>
				<body className={poppins.className}>
					<ThemeProvider attribute='class' defaultTheme='light'>
						{children}
					</ThemeProvider>
					<Script
						src='../components/disable-zoom.js'
						strategy='afterInteractive'
					/>
				</body>
			</html>
		</CartProvider>
	);
}
