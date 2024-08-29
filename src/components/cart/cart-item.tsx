'use client';

import * as React from 'react';
import { Icons } from '../icons';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { CartItemActions } from './update-cart';

interface CartItemProps {
	item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
	const formattedPrice = formatPrice(
		Number(item.pack.price) * item.quantity,
		item.product.currency
	);

	const unitCalculationLabel = `${item.pack.quantity} ${item.pack.unit} x ${item.quantity} = ${formattedPrice}`;

	return (
		<div className='flex items-center space-x-4'>
			<div className='relative h-16 w-16 overflow-hidden rounded'>
				<Image
					src={item.product.imageUrl}
					alt={item.product.title}
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					fill
					className='absolute object-cover'
					loading='lazy'
				/>
			</div>
			<div className='flex flex-1 flex-col gap-1 self-start text-sm'>
				<span className='sm:text-base text-sm line-clamp-1'>
					{item.product.title}
				</span>
				<span className='sm:text-base text-sm line-clamp-1 text-muted-foreground'>
					{unitCalculationLabel}
				</span>
				{/* <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
					{item.product.category}
				</span> */}
				<CartItemActions item={item} />
			</div>
		</div>
	);
}
