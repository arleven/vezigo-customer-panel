'use client';

import * as React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/cart-context';
import { CartItem } from './cart-item';
import { cn, formatPrice } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { apiUrl, links, siteConfig } from '@/config/site-config';

const formSchema = z.object({
	name: z.string().min(2, 'Your name is required').max(50),
	phone: z.string().min(2, 'Your phone is required').max(50),
	altPhone: z.string().max(50),
	address: z.string().min(2, 'Your address is required').max(200),
	notes: z.string().max(200).trim().optional()
});

const newLineChar = '%0a';

const generateWhatsAppUrl = (
	orderId: string,
	values: z.infer<typeof formSchema>
) => {
	const mainMessage = `Hey There! I wanted to place a new order.${newLineChar}Name: ${values.name}${newLineChar}Number: ${values.phone}${newLineChar}Alt. Phone Number: ${values.altPhone}${newLineChar}Address: ${values.address}${newLineChar}Notes: ${values.notes}${newLineChar}Order: ${links.siteAddress}/orders/${orderId}`;

	return `${links.whatsAppApiUrl}?phone=${siteConfig.adminPhoneNumber}&text=${mainMessage}`;
};

export default function CartSheet() {
	const { cartItems, cartAmount, emptyCart } = useCart();
	const [loading, setLoading] = React.useState<boolean>(false);
	const itemCount = cartItems.reduce(
		(total, item) => total + item.quantity,
		0
	);

	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			phone: '',
			address: '',
			notes: ''
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			console.log('cartItems', cartItems);

			const items = cartItems.map((item) => {
				return {
					pack: {
						price: item.pack.price,
						unit: item.pack.unit,
						quantity: item.pack.quantity
					},
					product: item.product.id,
					quantity: item.quantity
				};
			});

			const orderDetails = {
				items,
				billAmount: cartAmount,
				userDetails: {
					name: values.name,
					altPhoneNumber: values.altPhone,
					phoneNumber: values.phone,
					address: values.address,
					notes: values.notes
				}
			};

			const res: any = await axios.post(`${apiUrl}/orders`, orderDetails);
			const response = await res.data;

			if (response.code === 201) {
				const whatsAppUrl = generateWhatsAppUrl(
					response.data.id,
					values
				);

				window.open(whatsAppUrl, '_blank');
				router.push(`${links.siteAddress}/orders/${response.data.id}`);
			}
		} catch (error: any) {
			if (error?.response) {
				console.log('error', error?.response?.data?.message);
			}
		}
		setLoading(false);
	}

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
								<DialogContent className='sm:max-w-md w-10/12 rounded-xl'>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(
												onSubmit
											)}
											className='space-y-2'
										>
											<DialogHeader>
												<DialogTitle>
													Enter Your Details
												</DialogTitle>
												<DialogDescription>
													Anyone who has this order
													link will be able to view
													this.
												</DialogDescription>
											</DialogHeader>
											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='name'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Your Name
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='Rahul Sharma'
																	{...field}
																	className='h-8 text-base'
																	disabled={
																		loading
																	}
																/>
															</FormControl>
															<FormMessage className='text-xs' />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='phone'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Phone Number
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='9876543210'
																	type='number'
																	{...field}
																	className='h-8 text-base'
																	disabled={
																		loading
																	}
																/>
															</FormControl>
															<FormMessage className='text-xs' />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='altPhone'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Alternate Phone
																Number
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='9876543210'
																	type='number'
																	{...field}
																	className='h-8 text-base'
																	disabled={
																		loading
																	}
																/>
															</FormControl>
															<FormMessage className='text-xs' />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='address'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Address
															</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	placeholder={`Flat / House No. / Building Name\nFloor\nArea / Sector / Locality\nNearby Landmark`}
																	disabled={
																		loading
																	}
																	className='text-base'
																/>
															</FormControl>
															<FormMessage className='text-xs' />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='notes'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Notes
															</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	placeholder='Something about the order you want to add...'
																	disabled={
																		loading
																	}
																	className='text-base'
																/>
															</FormControl>
															<FormMessage className='text-xs' />
														</FormItem>
													)}
												/>
											</div>
											<DialogFooter className='sm:justify-start'>
												{/* <DialogClose asChild> */}
												<Button
													type='submit'
													className='bg-green-500 hover:bg-green-600 text-white items-center w-full mt-4'
												>
													{loading && (
														<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
													)}{' '}
													Place Order
												</Button>
												{/* </DialogClose> */}
											</DialogFooter>
										</form>
									</Form>
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
