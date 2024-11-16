import axios from 'axios';
import Image from 'next/image';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell
} from '@/components/ui/table';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { apiUrl } from '@/config/site-config';
import { Shell } from '@/components/Shells/shell';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

	const deliveryCost = formatPrice(Number(40), 'INR');

	const orderDate = new Date(order.createdAt).toLocaleString([], {
		dateStyle: 'medium',
		timeStyle: 'medium'
	});

	const billAmount = formatPrice(Number(order.billAmount), 'INR');

	return (
		<html lang='en'>
			<body className='flex flex-col relative min-h-screen bg-gray-100'>
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
													<TableHead>
														Quantity
													</TableHead>
													<TableHead>Total</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{order?.items.map(
													(
														item: any,
														index: number
													) => (
														<TableRow key={index}>
															<TableCell className='hidden md:table-cell'>
																<Image
																	src={
																		item
																			.product
																			.imageUrl
																	}
																	alt={
																		item
																			.product
																			.title
																	}
																	className='aspect-square rounded-md object-cover'
																	width={64}
																	height={64}
																/>
															</TableCell>
															<TableCell className='font-medium'>
																{
																	item.product
																		.title
																}{' '}
																{`(${item.pack.quantity}${item.pack.unit})`}
															</TableCell>
															<TableCell>
																{item.quantity}
																{item.unit}
															</TableCell>
															<TableCell>
																{formatPrice(
																	Number(
																		item
																			.pack
																			.price
																	) *
																		item.quantity,
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
								<PaymentCard
									billAmount={billAmount}
									deliveryCost={deliveryCost}
								/>
							</div>
							<div className='md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6'>
								<CustomerDetailsCard order={order} />
							</div>
						</div>
					</main>
				</Shell>
			</body>
		</html>
	);
}

const PaymentCard = (props: { billAmount: string; deliveryCost: string }) => {
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
				<div className='flex items-center'>
					<div>Delivery Cost</div>
					<div className='ml-auto'>{props.deliveryCost}</div>
				</div>
				<Separator />
				<div className='flex items-center font-medium'>
					<div>Total</div>
					<div className='ml-auto'>{props.billAmount}</div>
				</div>
			</CardContent>
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
