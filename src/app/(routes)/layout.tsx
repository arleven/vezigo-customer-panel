import SiteHeader from '@/components/layouts/site-header';
import SiteFooter from '@/components/layouts/site-footer';

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className='flex flex-col relative min-h-screen'>
				<SiteHeader />
				<main className='bg-gray-100'>{children}</main>
				{/* <SiteFooter /> */}
			</body>
		</html>
	);
}
