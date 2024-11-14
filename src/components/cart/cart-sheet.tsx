'use client';

import * as React from 'react';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import SparklesText from '@/components/ui/sparkles-text';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import CartForm from './cart-form';
import { CartItem } from './cart-item';
import { cn, formatPrice } from '@/lib/utils';

export default function CartSheet() {
	const { cartItems, cartAmount, emptyCart, freeDelivery } = useCart();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className={cn(
						'relative',
						cartItems.length > 0
							? 'bg-green-500 hover:bg-green-600'
							: ''
					)}
				>
					{cartItems.length > 0 && (
						<Badge
							variant='secondary'
							className='absolute -right-2 -top-2 g-6 w-6 h-6 rounded-full p-2'
						>
							{cartItems.length}
						</Badge>
					)}
					<Icons.shoppingCart
						className={cn(
							'h-4 w-4',
							cartItems.length > 0 ? 'text-white' : ''
						)}
					/>
				</Button>
			</SheetTrigger>
			<SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
				<SheetHeader className='px-1'>
					<SheetTitle>
						Cart {cartItems.length > 0 && `(${cartItems.length})`}
					</SheetTitle>
				</SheetHeader>
				<Separator />
				{cartItems.length > 0 ? (
					<div className='flex flex-1 flex-col gap-5 overflow-hidden'>
						{/* Cart Items */}
						<ScrollArea className='h-full'>
							<div className='flex flex-col gap-1 pr-6 overflow-visible'>
								{cartItems.map((item, index) => (
									<div key={item.pack._id}>
										<div className='space-y-3'>
											<CartItem item={item} />
										</div>
										{cartItems.length !== index + 1 && (
											<Separator className='mt-2' />
										)}
									</div>
								))}
							</div>
						</ScrollArea>

						{/* Order Offer */}
						<div className='flex items-center space-x-1 pl-1 pr-7'>
							{!freeDelivery ? (
								<SparklesText
									className='text-lg'
									text={`Add items worth ₹${
										240 - cartAmount
									} or more to get a discount!`}
								/>
							) : (
								<SparklesText
									className='text-lg'
									text="Congrats! You've got free delivery 🎉"
								/>
							)}
						</div>

						{/* Empty Cart Button */}
						<div className='flex items-center space-x-1 pl-1 pr-7'>
							<Button
								className='items-center w-full'
								type='button'
								variant={'outline'}
								disabled={cartAmount <= 0}
								onClick={emptyCart}
							>
								Empty Cart
							</Button>
						</div>

						{/* Checkout Button */}
						<Dialog>
							<div className='flex items-center space-x-1 pl-1 pr-7'>
								<DialogTrigger asChild>
									<Button
										className='bg-green-500 hover:bg-green-600 text-white items-center w-full mb-1 rounded-lg'
										type='button'
										disabled={cartAmount <= 0}
									>
										Checkout{' '}
										{cartAmount > 0 &&
											`(${formatPrice(
												cartAmount,
												'INR'
											)})`}
									</Button>
								</DialogTrigger>
								<DialogContent className='rounded-xl lg:h-5/6 h-5/6 w-11/12 overflow-auto'>
									<div className='columns-3xs'>
										<div className='w-full aspect-square'>
											<CartForm
												cartItems={cartItems}
												cartAmount={cartAmount}
												emptyCart={emptyCart}
												close={SheetClose}
											/>
										</div>
									</div>
								</DialogContent>
							</div>
						</Dialog>
					</div>
				) : (
					<div className='flex flex-1 flex-col gap-5 overflow-hidden'>
						No products in cart
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
