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
	flat: z.string().min(2, 'Your flat is required').max(50),
	floor: z.string().min(2, 'Your floor is required').max(50),
	area: z.string().min(2, 'Your area is required').max(50),
	landmark: z.string().max(50).trim().optional(),
	notes: z.string().max(200).trim().optional()
});

const newLineChar = '%0a';

const generateWhatsAppUrl = (
	orderId: string,
	values: z.infer<typeof formSchema>
) => {
	const mainMessage = `Hey There! I wanted to place a new order.${newLineChar}Name: ${values.name}${newLineChar}Number: ${values.phone}${newLineChar}Address: ${values.flat}, ${values.floor}, ${values.area}, ${values.landmark}${newLineChar}Notes: ${values.notes}${newLineChar}Order: ${links.siteAddress}/orders/${orderId}`;

	return `${links.whatsAppApiUrl}?phone=${siteConfig.adminPhoneNumber}&text=${mainMessage}`;
};

export default function CartSheet() {
	const { cartItems, cartAmount } = useCart();
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
			flat: '',
			floor: '',
			area: '',
			landmark: '',
			notes: ''
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const items = cartItems.map((item) => {
				const product = item.product;
				const itemDetails = {
					product: product.id,
					price: product.price,
					quantity: item.quantity
				};
				return itemDetails;
			});

			const orderDetails = {
				items,
				billAmount: cartAmount,
				userDetails: {
					name: values.name,
					phoneNumber: values.phone,
					address: {
						flat: values.flat,
						floor: values.floor,
						area: values.area,
						landmark: values.landmark
					},
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
				router.push(whatsAppUrl);
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
						aria-hidden='true'
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
				{cartItems.length >= 0 ? (
					<div className='flex flex-1 flex-col gap-5 overflow-hidden'>
						<ScrollArea className='h-full'>
							<div className='flex flex-col gap-5 pr-6 overflow-visible'>
								{cartItems.map((item) => (
									<div
										key={item.product.id}
										className='space-y-3'
									>
										<CartItem item={item} />
									</div>
								))}
							</div>
						</ScrollArea>

						<Dialog>
							<div className='flex items-center space-x-4 pl-1 pr-6'>
								<DialogTrigger asChild>
									<Button
										className='bg-green-500 hover:bg-green-600 text-white items-center w-full mb-1'
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
								<DialogContent className='sm:max-w-md'>
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
													name='flat'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Flat / House No.
																/ Building Name
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='123'
																	{...field}
																	className='h-8'
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
													name='floor'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Floor
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='Second Floor'
																	{...field}
																	className='h-8'
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
													name='area'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Area / Sector /
																Locality
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='M.G. Road'
																	{...field}
																	className='h-8'
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
													name='landmark'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-xs'>
																Nearby Landmark
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='Near School'
																	{...field}
																	className='h-8'
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
																	className='h-8'
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
																	className='h-8'
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
