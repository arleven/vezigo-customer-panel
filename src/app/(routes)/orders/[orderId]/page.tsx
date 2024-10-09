import Link from 'next/link';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Shell } from '@/components/Shells/shell';
import Image from 'next/image';
import { Order, OrderItem } from '@/types';
import { apiUrl, links, siteConfig } from '@/config/site-config';
import axios from 'axios';
import { formatPrice } from '@/lib/utils';
import { MessagesSquare, PrinterIcon } from 'lucide-react';

async function getOrder(orderId: string): Promise<Order> {
	try {
		const orderApiUrl = `${apiUrl}/orders/${orderId}`;
		const response = await axios.get(orderApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data;
	} catch (error) {
		console.error('Error fetching product data:', error);
		throw error;
	}
}

interface OrderPageProps {
	params: {
		orderId: string;
	};
}

export default async function OrderPage({ params }: OrderPageProps) {
	const { orderId } = params;
	const order = (await getOrder(orderId)) as Order;
	const orderDate = new Date(order.createdAt).toLocaleString([], {
		dateStyle: 'medium',
		timeStyle: 'medium'
	});

	const billAmount = formatPrice(Number(order.billAmount), 'INR');

	return (
		<Shell as='div' className='gap-12'>
			<main className='flex flex-1 flex-col gap-4 md:gap-8'>
				<div className='flex items-center gap-4'>
					<h1 className='font-semibold text-lg md:text-xl'>
						<span className='font-normal text-gray-500 dark:text-gray-400'>
							Order ID: <strong>{order.orderId}</strong>
							<br />
							Ordered by {order.userDetails.name}
						</span>
						<span className='font-normal text-gray-500 dark:text-gray-400'>
							{' '}
							on {orderDate}
						</span>
					</h1>
					<Link
						href={`/orders/${order.id}/print`}
						target='_blank'
						className='bg-slate-700 text-gray-100 p-2 rounded ml-auto'
					>
						<PrinterIcon />
					</Link>
				</div>
				<div className='flex flex-col md:grid md:grid-cols-6 gap-6'>
					<div className='md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6'>
						<Card>
							<CardHeader>
								<CardTitle>Ordered Items</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className='hidden md:table-cell' />
											<TableHead className='max-w-[150px]'>
												Item Name
											</TableHead>
											<TableHead>Quantity</TableHead>
											<TableHead>Total</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{order?.items.map(
											(item: any, index: number) => (
												<TableRow key={index}>
													<TableCell className='hidden md:table-cell'>
														<Image
															src={
																item.product
																	.imageUrl
															}
															alt={
																item.product
																	.title
															}
															className='aspect-square rounded-md object-cover'
															width={64}
															height={64}
														/>
													</TableCell>
													<TableCell className='font-medium'>
														{item.product.title}{' '}
														{`(${item.pack.quantity}${item.pack.unit})`}
													</TableCell>
													<TableCell>
														{item.quantity}
														{item.unit}
													</TableCell>
													<TableCell>
														{formatPrice(
															Number(
																item.pack.price
															) * item.quantity,
															item.product
																.currency
														)}
													</TableCell>
												</TableRow>
											)
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
						<PaymentCard billAmount={billAmount} />
					</div>
					<div className='md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6'>
						<CustomerDetailsCard order={order} />
					</div>
				</div>
			</main>
			<FloatingChatButton orderId={orderId} />
		</Shell>
	);
}

const PaymentCard = (props: { billAmount: string }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-4'>
				<div className='flex items-center'>
					<div>Mode</div>
					<div className='ml-auto'>Offline</div>
				</div>
				<Separator />
				<div className='flex items-center font-medium'>
					<div>Total</div>
					<div className='ml-auto'>{props.billAmount}</div>
				</div>
			</CardContent>
			{/* <CardFooter className='flex items-center gap-2'>
				<Button size='sm'>Collect payment</Button>
				<Button variant='outline' size='sm'>
					Send invoice
				</Button>
			</CardFooter> */}
		</Card>
	);
};

const CustomerDetailsCard = (props: { order: Order }) => {
	return (
		<Card>
			<div>
				<CardHeader className='flex flex-row items-center space-y-0'>
					<CardTitle>Customer</CardTitle>
				</CardHeader>
				<CardContent className='text-sm'>
					<div className='grid gap-1'>
						<div>{props.order.userDetails.name}</div>
						<div>{props.order.userDetails.phoneNumber}</div>
					</div>
				</CardContent>
			</div>
			<Separator />
			<div>
				<CardHeader>
					<CardTitle>Address</CardTitle>
				</CardHeader>
				<CardContent className='text-sm'>
					<div>{props.order.userDetails.address ?? ''}</div>
					<Link
						className='mt-4 p-4 bg-green-500 hover:bg-green-600 text-white rounded-md py-3 px-4 shadow-lg inline-flex items-center gap-2 font-bold'
						href={`https://maps.google.com/?q=${props.order.geo.lat},${props.order.geo.lng}`}
						target='_blank'
					>
						Open in Google Maps
					</Link>
				</CardContent>
			</div>
			<Separator />
			<div>
				<CardHeader>
					<CardTitle>Notes</CardTitle>
				</CardHeader>
				<CardContent className='text-sm'>
					{props.order.userDetails.notes}
				</CardContent>
			</div>
		</Card>
	);
};

const FloatingChatButton = (props: { orderId: string }) => {
	return (
		<div className='fixed bottom-4 right-4'>
			<Link
				className='bg-green-500 hover:bg-green-600 text-white rounded-full py-3 px-4 shadow-lg inline-flex items-center gap-2 font-bold'
				href={`${links.regularWhatsAppApiUrl}?phone=${siteConfig.adminPhoneNumber}&text=Hi, I had query about order ID: ${props.orderId}`}
			>
				<MessagesSquare className='w-6 h-6' />
				Chat
			</Link>
		</div>
	);
};
