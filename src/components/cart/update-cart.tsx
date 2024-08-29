import React from 'react';
import { useCart } from '@/context/cart-context';
import { CartItem, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../icons';

interface CartItemActionsProps {
	item: CartItem;
}

export function CartItemActions({ item }: CartItemActionsProps) {
	const { updateCartItemQuantity, removeFromCart } = useCart();

	const handleQuantityChange = (qty: number) => {
		const quantity = Number(qty);
		if (quantity >= 1) {
			updateCartItemQuantity(item.pack._id, quantity);
		}
	};

	const handleRemoveClick = () => {
		removeFromCart(item.pack._id);
	};

	return (
		<div className='flex items-center space-x-1'>
			<div className='flex items-center space-x-1'>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={() => {
						handleQuantityChange(item.quantity - 1);
					}}
				>
					{'-'}
				</Button>
			</div>
			<Input
				className='h-8 w-14 text-base'
				type='number'
				min='1'
				value={item.quantity}
				onChange={(e) => {
					handleQuantityChange(Number(e.target.value));
				}}
			/>
			<Button
				variant='outline'
				size='icon'
				className='h-8 w-8'
				onClick={() => {
					handleQuantityChange(item.quantity + 1);
				}}
			>
				{'+'}
			</Button>
			<Button
				variant='outline'
				size='icon'
				className='sm:h-8 sm:w-8 h-6 w-6'
				onClick={handleRemoveClick}
			>
				<Icons.trash className='h-4 w-4' />
			</Button>
		</div>
	);
}
