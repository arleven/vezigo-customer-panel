'use client';

import axios from 'axios';
import { apiUrl } from '@/config/site-config';
import { type CartItem, Package, Product } from '@/types';
import { createContext, useContext, useState, useEffect } from 'react';

interface CartContextValue {
	cartItems: CartItem[];
	addToCart: (pack: Package, product: Product) => void;
	removeFromCart: (productId: string) => void;
	emptyCart: () => void;
	updateCartItemQuantity: (productId: string, quantity: number) => void;
	cartTotal: number;
	cartAmount: number;
	cartCount: number;
	data: Product[];
	freeDelivery: boolean;
}

const deliveryCost = 40;
const minimumOrderCost = 199;

const CartContext = createContext<CartContextValue>({
	cartItems: [],
	addToCart: () => {},
	removeFromCart: () => {},
	emptyCart: () => {},
	updateCartItemQuantity: () => {},
	cartTotal: 0,
	cartAmount: 0,
	cartCount: 0,
	data: [],
	freeDelivery: false
});

export const useCart = () => {
	return useContext(CartContext);
};

interface Props {
	children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cartAmount, setCartAmount] = useState<number>(0);
	const [freeDelivery, setFreeDelivery] = useState<boolean>(false);
	const [data, setData] = useState<Product[]>([]);

	useEffect(() => {
		// Fetch product data
		const fetchProductData = async () => {
			try {
				const productsApiUrl = `${apiUrl}/products`;
				const response = await axios.get(productsApiUrl);
				const responseData = await response.data;
				const products = responseData.data.results;
				setData(products);
			} catch (error) {
				console.error('Failed to fetch product data:', error);
			}
		};

		fetchProductData();
	}, []);

	let totalAmount: number = 0;

	useEffect(() => {
		cartItems.forEach((item: any) => {
			totalAmount += Number(item.quantity) * Number(item.pack.price);
		});

		if (totalAmount > 0 && totalAmount < minimumOrderCost) {
			setCartAmount(totalAmount + deliveryCost);
		} else {
			setCartAmount(totalAmount);
		}

		if (totalAmount >= minimumOrderCost) {
			setFreeDelivery(true);
		} else {
			setFreeDelivery(false);
		}
	}, [cartItems]);

	const addToCart = (pack: Package, product: Product) => {
		const existingCartItemIndex = cartItems.findIndex(
			(item) => item.pack._id === pack._id
		);
		if (existingCartItemIndex !== -1) {
			const existingCartItem = cartItems[existingCartItemIndex];
			const updatedCartItem = {
				...existingCartItem,
				quantity: existingCartItem.quantity + 1
			};
			const updatedCartItems = [...cartItems];
			updatedCartItems[existingCartItemIndex] = updatedCartItem;
			setCartItems(updatedCartItems);
		} else {
			setCartItems([...cartItems, { pack, product, quantity: 1 }]);
		}
	};

	const removeFromCart = (packId: string) => {
		const updatedCartItems = cartItems.filter(
			(item) => item.pack._id !== packId
		);
		setCartItems(updatedCartItems);
	};

	const emptyCart = () => {
		setCartItems([]);
	};

	const updateCartItemQuantity = (packId: string, quantity: number) => {
		const existingCartItemIndex = cartItems.findIndex(
			(item) => item.pack._id === packId
		);
		if (existingCartItemIndex !== -1) {
			const existingCartItem = cartItems[existingCartItemIndex];
			const updatedCartItem = {
				...existingCartItem,
				quantity
			};
			const updatedCartItems = [...cartItems];
			updatedCartItems[existingCartItemIndex] = updatedCartItem;
			setCartItems(updatedCartItems);
		}
	};

	const cartTotal = cartItems.reduce(
		(total, item) => total + Number(item.pack.price) * item.quantity,
		0
	);

	const cartCount = cartItems.reduce(
		(count, item) => count + item.quantity,
		0
	);

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				emptyCart,
				updateCartItemQuantity,
				cartTotal,
				cartCount,
				data,
				cartAmount,
				freeDelivery
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
