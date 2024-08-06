'use client';

import { createContext, useContext, useState } from 'react';
import { type CartItem, Product } from '@/types';
import { useEffect } from 'react';
import { apiUrl } from '@/config/site-config';
import axios from 'axios';

interface CartContextValue {
	cartItems: CartItem[];
	addToCart: (product: Product) => void;
	removeFromCart: (productId: string) => void;
	updateCartItemQuantity: (productId: string, quantity: number) => void;
	cartTotal: number;
	cartAmount: number;
	cartCount: number;
	data: Product[];
}

const CartContext = createContext<CartContextValue>({
	cartItems: [],
	addToCart: () => {},
	removeFromCart: () => {},
	updateCartItemQuantity: () => {},
	cartTotal: 0,
	cartAmount: 0,
	cartCount: 0,
	data: []
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
			totalAmount += Number(item.quantity) * Number(item.product.price);
		});

		setCartAmount(totalAmount);
	}, [cartItems]);

	const addToCart = (product: Product) => {
		const existingCartItemIndex = cartItems.findIndex(
			(item) => item.product.id === product.id
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
			setCartItems([...cartItems, { product, quantity: 1 }]);
		}
	};

	const removeFromCart = (productId: string) => {
		const updatedCartItems = cartItems.filter(
			(item) => item.product.id !== productId
		);
		setCartItems(updatedCartItems);
	};

	const updateCartItemQuantity = (productId: string, quantity: number) => {
		const existingCartItemIndex = cartItems.findIndex(
			(item) => item.product.id === productId
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
		(total, item) => total + Number(item.product.price) * item.quantity,
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
				updateCartItemQuantity,
				cartTotal,
				cartCount,
				data,
				cartAmount
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
