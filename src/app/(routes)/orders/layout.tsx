import { Metadata } from 'next';

interface OrdersLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'SabjiKing | Orders',
	description: 'Online Vegetable and Fruit Delivery store in Jodhpur'
};

export default function OrdersLayout({ children }: OrdersLayoutProps) {
	return <>{children}</>;
}
