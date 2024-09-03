'use client';

import { cn, formatPrice } from '@/lib/utils';
import type { Package, Product } from '@/types';

import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
import { map } from 'zod';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
	const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } =
		useCart();

	const [quantity, setQuantity] = React.useState(0);

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
			<Badge className='absolute right-4 bottom-24 justify-center hover:bg-red-600 bg-red-600 text-white font-bold text-base rounded-2xl p-2'>
				{`₹${product?.marketPrice?.toUpperCase()}`}
			</Badge>
			<CardContent className='grid gap-2.5 p-2'>
				<CardTitle className='text-base'>
					{product.title}
					<CardDescription className='line-clamp-2'>
						{product?.description}
					</CardDescription>
				</CardTitle>
			</CardContent>
			{showCartButton && (
				<CardFooter className='p-1'>
					<div className='flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between'>
						{/* {isProductInCart ? (
							<div className='w-full'>
								<div className='flex items-center space-x-1'>
									<Input
										className='h-8 w-full text-base rounded-xl'
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
										className='h-8 w-8 bg-red-500 hover:bg-red-400 text-white hover:text-white rounded-lg'
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
								className='h-8 w-full rounded-xl bg-green-500 hover:bg-green-600'
								onClick={() => {
									handleAddToCart(product);
								}}
							>
								Add to cart
							</Button>
						)} */}
						<Dialog>
							<DialogTrigger asChild>
								<Button
									size='sm'
									className='h-8 w-full rounded-xl bg-green-500 hover:bg-green-600'
									/* onClick={() => {
										handleAddToCart(product);
									}} */
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
									{product.packages.map((pack, item) => (
										<DialogClose key={item}>
											<ToggleGroupItem
												value={String(pack.quantity)}
												onClick={() => {
													/* updateCartItemQuantity(
														product.id,
														Number(pack.quantity)
													); */
													handleAddToCart(
														pack,
														product
													);
												}}
											>
												<span>
													{`${pack.quantity} ${pack.unit}`}
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
		<Badge className='absolute -right-2 -top-2 justify-center hover:bg-yellow-400 bg-yellow-400 text-black rounded-full p-2'>
			In Cart
		</Badge>
	);
};
