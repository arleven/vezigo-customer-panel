import { Metadata } from 'next';

interface ProductsLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'SabjiKing | Vegetables',
	description: 'Online Vegetable and Fruit Delivery store in Jodhpur'
};

export default function ProductsLayout({ children }: ProductsLayoutProps) {
	return <>{children}</>;
}
