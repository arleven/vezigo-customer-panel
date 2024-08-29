import '@/styles/globals.css';

import { ThemeProvider } from '@/components/theme-provider';

import type { Metadata } from 'next';
import { CartProvider } from '@/context/cart-context';

import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

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
				<body className={cn('bg-gray-100', poppins.className)}>
					<ThemeProvider attribute='class' defaultTheme='light'>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</CartProvider>
	);
}
