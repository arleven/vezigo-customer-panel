import axios from 'axios';
import React from 'react';
import { z } from 'zod';
import { detect } from 'detect-browser';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiUrl, links, siteConfig } from '@/config/site-config';

import GoogleMapsComponent from '../google-maps';
import { Icons } from '../icons';
import { CartItem } from '@/types';
const { googleMap } = siteConfig;

const formSchema = z.object({
	name: z.string().min(2, 'Your name is required').max(50),
	phone: z.string().min(2, 'Your phone is required').max(50),
	altPhone: z.string().min(2, 'Your alternate phone is required').max(50),
	address: z.string().min(2, 'Your address is required').max(200),
	notes: z.string().max(200).trim().optional()
});

const newLineChar = '%0a';

const generateWhatsAppUrl = (
	orderId: string,
	values: z.infer<typeof formSchema>,
	isSafari: boolean,
	isIos: boolean
) => {
	const mainMessage = `Hey There! I wanted to place a new order.${newLineChar}${newLineChar}Order ID: ${orderId}${newLineChar}Name: ${values.name}${newLineChar}Number: ${values.phone}${newLineChar}Alt. Phone Number: ${values.altPhone}${newLineChar}Address: ${values.address}${newLineChar}Notes: ${values.notes}${newLineChar}Order: ${links.siteAddress}/orders/${orderId}`;

	if (isSafari || isIos) {
		return `${links.safariWhatsAppApiUrl}?phone=+${siteConfig.adminPhoneNumber}?text=${mainMessage}`;
	} else {
		return `${links.regularWhatsAppApiUrl}/${siteConfig.adminPhoneNumber}?text=${mainMessage}`;
	}
};

export default function CartForm(props: any) {
	const browser = detect();
	const router = useRouter();
	const [loading, setLoading] = React.useState<boolean>(false);
	const [selectedPosition, setSelectedPosition] = React.useState(
		googleMap.defaultLatLong
	);
	const [address, setAddress] = React.useState('');
	const [isSafari, setIsSafari] = React.useState(false);
	const [isIos, setIsIos] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			phone: '',
			altPhone: '',
			address: '',
			notes: ''
		}
	});

	React.useEffect(() => {
		switch (browser && browser.name) {
			case 'safari':
				setIsSafari(true);
				break;
			case 'ios':
				setIsIos(true);
				break;
			case 'chrome':
				console.log('chrome');
				break;
			case 'firefox':
				console.log('firefox');
				break;
			default:
				console.log('browser not supported');
		}
	}, []);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			console.log('cartItems', props.cartItems);

			const items = props.cartItems.map((item: CartItem) => {
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
				billAmount: props.cartAmount,
				userDetails: {
					name: values.name,
					altPhoneNumber: values.altPhone,
					phoneNumber: values.phone,
					address: values.address,
					notes: values.notes
				},
				geo: selectedPosition
			};

			console.log('orderDetails', orderDetails);

			const res: any = await axios.post(`${apiUrl}/orders`, orderDetails);
			const response = await res.data;

			if (response.code === 201) {
				const whatsAppUrl = generateWhatsAppUrl(
					response.data.id,
					values,
					isSafari,
					isIos
				);
				props.emptyCart();
				setTimeout(() => {
					window.open(whatsAppUrl, '_blank');
				});
				router.push(`${links.siteAddress}/orders/${response.data.id}`);
				setTimeout(() => {
					router.push(
						`${links.siteAddress}/orders/${response.data.id}`
					);
					location.reload();
				}, 1000);

				/* window.open(whatsAppUrl, '_blank');
				window.open(`${links.siteAddress}/orders/${response.data.id}`); */
			}
		} catch (error: any) {
			if (error?.response) {
				console.log('error', error?.response?.data?.message);
			}
		}
		setLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
				<DialogHeader>
					<DialogTitle>Enter Your Details</DialogTitle>
					<DialogDescription>
						Anyone who has this order link will be able to view
						this.
					</DialogDescription>
				</DialogHeader>
				<div className='w-full'>
					<GoogleMapsComponent
						selectedPosition={selectedPosition}
						setSelectedPosition={setSelectedPosition}
						address={address}
						setAddress={setAddress}
					/>
				</div>
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
										disabled={loading}
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
										disabled={loading}
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
									Alternate Phone Number
								</FormLabel>
								<FormControl>
									<Input
										placeholder='9876543210'
										type='number'
										{...field}
										className='h-8 text-base'
										disabled={loading}
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
										disabled={loading}
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
								<FormLabel className='text-xs'>Notes</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder='Something about the order you want to add...'
										disabled={loading}
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
	);
}
