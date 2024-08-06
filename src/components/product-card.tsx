'use client';

import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { AspectRatio } from './ui/aspect-ratio';
import { Icons } from './icons';
import { Button, buttonVariants } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from './ui/card';
import { useCart } from '@/context/cart-context';
import { Input } from './ui/input';
import { CartItemActions } from './cart/update-cart';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
	product: Product;
	variant?: 'default' | 'switchable';
	isAddedToCart?: boolean;
	onSwitch?: () => Promise<void>;
}

export function ProductCard({
	product,
	variant = 'default',
	isAddedToCart = false,
	onSwitch,
	className,
	...props
}: ProductCardProps) {
	const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } =
		useCart();

	const [quantity, setQuantity] = React.useState(1);

	const handleAddToCart = (product: Product) => {
		addToCart(product);
	};

	const isProductInCart = cartItems.some(
		(item) => item.product.id === product.id
	);

	return (
		<Card
			className={cn('h-full overflow-hidden rounded-sm', className)}
			{...props}
		>
			<Link
				aria-label={`View ${product.title} details`}
				href={`/${product.category}s/${product.id}`}
			>
				<CardHeader className='border-b p-0'>
					<AspectRatio ratio={4 / 3}>
						{product?.imageUrl?.length ? (
							<Image
								src={product.imageUrl}
								alt={product.title}
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								fill
								className='object-cover'
								loading='lazy'
							/>
						) : (
							<div
								role='img'
								className='flex h-full items-center justify-center bg-secondary'
							>
								<Icons.shoppingCart
									className='h-9 w-9 text-muted-foreground'
									aria-hidden='true'
								/>
							</div>
						)}
					</AspectRatio>
				</CardHeader>
			</Link>
			<Link
				aria-label={`View ${product.title} details`}
				href={`/${product.category}s/${product.id}`}
			>
				<CardContent className='grid gap-2.5 p-4'>
					<CardTitle className='line-clamp-1 text-base'>
						{product.title}
					</CardTitle>
					<CardDescription className='line-clamp-2'>
						{formatPrice(Number(product?.price), product?.currency)}
						/{product.unit.toUpperCase()}
					</CardDescription>
				</CardContent>
			</Link>
			<CardFooter className='p-4'>
				{variant === 'default' ? (
					<div className='flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between'>
						{/* <Link
							href={`/${product.category}s/${product.id}`}
							className={buttonVariants({
								variant: "outline",
								size: "sm",
								className: "h-8 w-full rounded-sm",
							})}
						>
							Preview
						</Link> */}
						{isProductInCart ? (
							<div className='w-full'>
								<div className='flex items-center space-x-1'>
									<Input
										className='h-8 w-full text-xs'
										type='number'
										min='1'
										value={quantity}
										onChange={(e) => {
											setQuantity(Number(e.target.value));
											updateCartItemQuantity(
												product.id,
												Number(e.target.value)
											);
										}}
									/>
									<Button
										variant='outline'
										size='icon'
										className='h-8 w-8 bg-red-500 hover:bg-red-400 text-white hover:text-white'
										onClick={() => {
											removeFromCart(product.id);
										}}
									>
										<Icons.trash className='h-4 w-4' />
									</Button>
								</div>
							</div>
						) : (
							<Button
								size='sm'
								className='h-8 w-full rounded-sm bg-green-500 hover:bg-green-600'
								onClick={() => {
									handleAddToCart(product);
								}}
							>
								Add to cart
							</Button>
						)}
					</div>
				) : (
					<Button
						size='sm'
						className='h-8 w-full rounded-sm bg-green-500 hover:bg-green-600'
						onClick={() => handleAddToCart(product)}
					>
						Add to cart
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
