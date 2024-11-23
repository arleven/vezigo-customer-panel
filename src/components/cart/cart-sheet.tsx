'use client';

import { useEffect, useState } from 'react';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import Ripple from '@/components/ui/ripple';
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

import { Zone } from '@/types';

export default function CartSheet(props: { zones: Zone[] }) {
	const {
		cartItems,
		cartAmount,
		freeDelivery,
		deliveryCost,
		billAmount,
		minimumOrderValue,
		emptyCart,
		updateDeliveryCost
	} = useCart();
	const [address, setAddress] = useState('');
	const [selectedZone, setSelectedZone] = useState('');
	const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');

	useEffect(() => {
		if (typeof window !== 'undefined' && window.localStorage) {
			const localAddress = localStorage.getItem('address') as string;
			if (localAddress) {
				setAddress(JSON.parse(localAddress));
			}
		}
	}, []);

	useEffect(() => {
		window.history.pushState(null, '', window.location.href);

		const handlePopState = (event: any) => {
			window.history.pushState(null, '', window.location.href);
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	useEffect(() => {
		setSelectedDeliveryTime(deliveryTimes[0].id);
	}, []);

	const deliveryTimes = [{ id: '1', title: 'Tomorrow Morning' }];

	const getDeliveryCostById = (id: string) => {
		const zone = props.zones.find((loc) => loc.id === id);
		return zone ? Number(zone.deliveryCost) : 0;
	};

	const handleZoneChange = (value: string) => {
		setSelectedZone(value);
		const costToDeliver = getDeliveryCostById(value);
		updateDeliveryCost(costToDeliver);
	};

	const handleDeliveryTimeChange = (value: string) => {
		setSelectedDeliveryTime(value);
	};

	const deliveryLabel = `Delivery charges: ₹${deliveryCost}. Add items worth ₹${
		minimumOrderValue - cartAmount
	} or more to get free delivery!`;

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
					<SheetTitle className='flex items-center gap-2'>
						{/* <div className='flex flex-col gap-1'> */}
						<span className='mr-2'>Deliver to</span>
						<Select
							onValueChange={handleZoneChange}
							value={selectedZone}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Area' />
							</SelectTrigger>
							<SelectContent>
								{props.zones.map(
									(zone: Zone, index: number) => (
										<SelectItem
											value={zone.id}
											key={index}
											className='hover:bg-green-100 cursor-pointer'
										>
											{zone.title}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
						{/* </div>
						<div className='flex flex-col gap-1'>
							<span className='mr-2'>Deliver by</span>
							<Select
								onValueChange={handleDeliveryTimeChange}
								value={selectedDeliveryTime}
								defaultValue={deliveryTimes[0].id}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Time' />
								</SelectTrigger>
								<SelectContent>
									{deliveryTimes.map(
										(deliveryTime: any, index: number) => (
											<SelectItem
												value={deliveryTime.id}
												key={index}
												className='hover:bg-green-100 cursor-pointer'
											>
												{deliveryTime.title}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div> */}
					</SheetTitle>
				</SheetHeader>
				<Separator />
				{cartItems.length > 0 ? (
					<div className='flex flex-1 flex-col gap-2 overflow-hidden'>
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
						{selectedZone && (
							<div className='flex items-center space-x-1 pl-1 pr-7'>
								{!freeDelivery ? (
									<div className={cn('text-sm font-medium')}>
										<span className='relative inline-block'>
											<strong className='text-green-600'>
												{deliveryLabel}
											</strong>
										</span>
									</div>
								) : (
									<SparklesText
										className='text-sm'
										sparklesCount={15}
										text="Congrats! You've got free delivery 🎉"
									/>
								)}
							</div>
						)}

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
								{selectedZone ? (
									<DialogTrigger asChild>
										<Button
											className='bg-green-500 hover:bg-green-600 text-white items-center w-full mb-1 rounded-lg'
											type='button'
											disabled={
												cartAmount <= 0 || !selectedZone
											}
										>
											Checkout{' '}
											{cartAmount > 0 &&
												`(${formatPrice(
													billAmount,
													'INR'
												)})`}
										</Button>
									</DialogTrigger>
								) : (
									<div className='relative flex h-[45px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl'>
										<p className='z-10 whitespace-pre-wrap text-center text-base font-medium tracking-tighter text-white'>
											Select area first...
										</p>
										<Ripple
											numCircles={5}
											mainCircleOpacity={0.6}
										/>
									</div>
								)}
								<DialogContent className='rounded-xl lg:h-5/6 h-5/6 w-11/12 overflow-auto'>
									<div className='columns-3xs'>
										<div className='w-full aspect-square'>
											<CartForm
												cartItems={cartItems}
												cartAmount={cartAmount}
												emptyCart={emptyCart}
												close={SheetClose}
												address={address}
												setAddress={setAddress}
												selectedZone={selectedZone}
												deliveryCost={deliveryCost}
											/>
										</div>
									</div>
								</DialogContent>
							</div>
						</Dialog>
					</div>
				) : (
					<div className='flex flex-1 flex-col gap-2 overflow-hidden'>
						No products in cart
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
