import { Metadata } from 'next';

interface ProductsLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'Vezigo | Vegetables',
	description: 'Discover the best and fresh vegetables for all your needs'
};

export default function ProductsLayout({ children }: ProductsLayoutProps) {
	return <>{children}</>;
}
