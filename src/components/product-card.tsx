'use client';

import { cn } from '@/lib/utils';
import type { Package, Product } from '@/types';

import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle
} from './ui/card';
import { useCart } from '@/context/cart-context';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from './ui/dialog';
import { Badge } from './ui/badge';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
	product: Product;
	variant?: 'default' | 'switchable';
	isAddedToCart?: boolean;
	showCartButton?: boolean;
	onSwitch?: () => Promise<void>;
}

export function ProductCard({
	product,
	variant = 'default',
	isAddedToCart = false,
	onSwitch,
	className,
	showCartButton = true,
	...props
}: ProductCardProps) {
	const { addToCart, cartItems } = useCart();

	const handleAddToCart = (pack: Package, product: Product) => {
		addToCart(pack, product);
	};

	const isProductInCart = cartItems.some((item) => {
		if (item.product.id === product.id) {
			return item.product.id === product.id;
		}
	});

	React.useEffect(() => {
		if (isProductInCart) {
			console.log(isProductInCart);
		}
	}, [isProductInCart]);

	return (
		<Card
			className={cn(
				'relative h-full rounded-3xl shadow-sm hover:shadow-md hover:shadow-green-200 bg-white p-2',
				className
			)}
			{...props}
		>
			{isProductInCart && <CartBadge />}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={product.imageUrl}
				alt={product.title}
				className='object-cover h-48 w-96 rounded-2xl'
				loading='lazy'
			/>
			<Badge className='absolute right-4 top-[150px] justify-center hover:bg-red-600 bg-red-600 text-white font-bold text-base rounded-2xl p-2'>
				{`₹${product?.marketPrice}`}
			</Badge>
			<CardContent className='grid gap-2.5 p-2'>
				<CardTitle className='text-base'>
					{product.title}
					{product?.description && (
						<CardDescription className='line-clamp-2'>
							{product?.description}
						</CardDescription>
					)}
				</CardTitle>
			</CardContent>
			{showCartButton && (
				<CardFooter className='p-1'>
					<div className='flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between'>
						<Dialog>
							<DialogTrigger asChild>
								<Button
									size='sm'
									className='h-8 w-full rounded-xl bg-green-500 hover:bg-green-600'
								>
									Add to cart
								</Button>
							</DialogTrigger>
							<DialogContent className='sm:max-w-md w-10/12 rounded-lg'>
								<DialogHeader>
									<DialogTitle>
										Available Packages
									</DialogTitle>
									<DialogDescription>
										Select the quantity of the package you
										want to add to your cart.
									</DialogDescription>
								</DialogHeader>
								<ToggleGroup
									variant='outline'
									type='single'
									className='overflow-auto'
									size={'lg'}
								>
									{product.packages.map((pack, index) => (
										<DialogClose key={index}>
											<ToggleGroupItem
												value={String(pack.quantity)}
												onClick={() => {
													handleAddToCart(
														pack,
														product
													);
												}}
											>
												<span className='inline'>
													{`${pack.quantity}${pack.unit}\n₹${pack.price}`}
												</span>
											</ToggleGroupItem>
										</DialogClose>
									))}
								</ToggleGroup>
							</DialogContent>
						</Dialog>
					</div>
				</CardFooter>
			)}
		</Card>
	);
}

const CartBadge = () => {
	return (
		<Badge
			className='absolute -right-2 -top-2 justify-center hover:bg-yellow-400 bg-yellow-400 text-black rounded-full p-2'
			style={{ background: '#ffde08' }}
		>
			In Cart
		</Badge>
	);
};
