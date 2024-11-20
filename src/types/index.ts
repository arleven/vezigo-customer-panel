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

export type Package = {
	_id: string;
	quantity: number;
	unit: string;
	price: number;
};

export interface Product {
	id: string;
	title: string;
	currency: string;
	organic: boolean;
	description: string;
	category: string;
	marketPrice: string;
	packages: [Package];
	imageUrl: string;
}

export interface Zone {
	id: string;
	title: string;
	deliveryCost: string;
}

export interface Config {
	_id: string;
	heading: string;
	vegetablesDescription: string;
	fruitsDescription: string;
	minimumOrderValue: string;
}

export interface OrderItem {
	product: Product;
	pack: Package;
	unit: string;
	price: string;
	quantity: number;
}

export interface Order {
	id: string;
	userDetails: {
		name: string;
		phoneNumber: string;
		address: string;
		notes: string;
	};
	geo: {
		lat: number;
		lng: number;
	};
	items: [OrderItem];
	billAmount: string;
	deliveryAmount: string;
	createdAt: string;
	orderId: string;
}

export interface CartItem {
	pack: Package;
	product: Product;
	quantity: number;
}