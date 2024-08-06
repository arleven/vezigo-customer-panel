export interface NavItem {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
	description?: string;
}

export interface NavItemWithChildren extends NavItem {
	items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
	items?: NavItemWithChildren[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type StoredFile = {
	id: number;
	title: string;
	image: string;
};

export type Option = {
	label: string;
	value: string;
};

export interface Product {
	id: string;
	title: string;
	currency: string;
	organic: boolean;
	description: string;
	category: string;
	price: string;
	unit: string;
	imageUrl: string;
}

export interface OrderItem {
	product: Product;
	price: string;
	quantity: number;
}

export interface Order {
	id: string;
	userDetails: {
		name: string;
		phoneNumber: string;
		address: {
			flat: string;
			floor: string;
			area: string;
			landmark: string;
		};
		notes: string;
	};
	items: [OrderItem];
	billAmount: string;
	createdAt: string;
}

export interface CartItem {
	product: Product;
	quantity: number;
}