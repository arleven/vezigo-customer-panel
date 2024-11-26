import { Metadata } from 'next';

interface ContactUsLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'Sabjiking | Contact Us',
	description: 'Online Vegetable and Fruit Delivery store in Jodhpur'
};

export default function ContactUsLayout({ children }: ContactUsLayoutProps) {
	return <>{children}</>;
}
