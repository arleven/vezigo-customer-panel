import { Metadata } from 'next';

interface OrdersLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'Sabji King | Orders',
	description: 'Discover the best and fresh vegetables for all your needs'
};

export default function OrdersLayout({ children }: OrdersLayoutProps) {
	return <>{children}</>;
}
