import { Metadata } from 'next';

interface AboutUsLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'Sabjiking | About Us',
	description: 'Online Vegetable and Fruit Delivery store in Jodhpur'
};

export default function AboutUsLayout({ children }: AboutUsLayoutProps) {
	return <>{children}</>;
}
