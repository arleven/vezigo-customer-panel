'use client';

import axios from 'axios';
import { apiUrl } from '@/config/site-config';
import { type CartItem, Package, Product } from '@/types';
import { createContext, useContext, useState, useEffect } from 'react';

interface CartContextValue {
	cartItems: CartItem[];
	cartTotal: number;
	cartAmount: number;
	cartCount: number;
	data: Product[];
	freeDelivery: boolean;
	deliveryCost: number;
	billAmount: number;
	minimumOrderValue: number;
	addToCart: (pack: Package, product: Product) => void;
	removeFromCart: (productId: string) => void;
	emptyCart: () => void;
	updateCartItemQuantity: (productId: string, quantity: number) => void;
	updateDeliveryCost: (cost: number) => void;
	updateMinimumOrderValue: (value: number) => void;
}

const CartContext = createContext<CartContextValue>({
	cartItems: [],
	cartTotal: 0,
	cartAmount: 0,
	cartCount: 0,
	data: [],
	freeDelivery: false,
	deliveryCost: 0,
	billAmount: 0,
	minimumOrderValue: 199,
	addToCart: () => {},
	removeFromCart: () => {},
	emptyCart: () => {},
	updateCartItemQuantity: () => {},
	updateDeliveryCost: () => {},
	updateMinimumOrderValue: () => {}
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
	const [deliveryCost, setDeliveryCost] = useState<number>(0);
	const [billAmount, setBillAmount] = useState<number>(0);
	const [totalBillAmount, setTotalBillAmount] = useState<number>(0);
	const [minimumOrderValue, setMinimumOrderValue] = useState<number>(0);

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

	useEffect(() => {
		let tba = 0;
		cartItems.forEach((item: any) => {
			tba += Number(item.quantity) * Number(item.pack.price);
			setTotalBillAmount(tba);
		});

		setCartAmount(tba);

		if (totalBillAmount >= minimumOrderValue) {
			setFreeDelivery(true);
		} else {
			setFreeDelivery(false);
		}

		if (totalBillAmount > 0) {
			if (totalBillAmount < minimumOrderValue) {
				setBillAmount(cartAmount + deliveryCost);
			} else {
				setBillAmount(cartAmount);
			}
		}
	}, [cartItems, cartAmount, deliveryCost]);

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

	const updateDeliveryCost = (cost: number) => {
		setDeliveryCost(cost);
	};

	const updateMinimumOrderValue = (value: number) => {
		console.log('value', value);

		setMinimumOrderValue(value);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				cartTotal,
				cartCount,
				data,
				cartAmount,
				freeDelivery,
				deliveryCost,
				billAmount,
				minimumOrderValue,
				addToCart,
				removeFromCart,
				emptyCart,
				updateCartItemQuantity,
				updateDeliveryCost,
				updateMinimumOrderValue
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
