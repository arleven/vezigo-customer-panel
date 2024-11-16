import { Metadata } from 'next';

interface ProductsLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'Sabji King | Fruits',
	description: 'Discover the best and fresh fruits for all your needs'
};

export default function ProductsLayout({ children }: ProductsLayoutProps) {
	return <>{children}</>;
}
