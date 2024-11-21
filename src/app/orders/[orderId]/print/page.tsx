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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import sabjiKingLogo from '@/assets/sabjiking-transparent.png';
import sabjiKingQr from '@/assets/sabji-king-web-qr.png';

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
		dateStyle: 'medium'
		// timeStyle: 'medium'
	});

	const billAmount = formatPrice(Number(order.billAmount), 'INR');

	const deliveryCost = formatPrice(Number(order.deliveryAmount), 'INR');

	const netTotal = formatPrice(
		Number(order.billAmount) + Number(order.deliveryAmount ?? 0),
		'INR'
	);

	return (
		<html lang='en'>
			<body
				className='flex flex-col relative min-h-screen'
				style={{ backgroundColor: '#ffde08' }}
			>
				<div className='gap-12 p-4'>
					<main className='flex flex-1 flex-col'>
						<div className='flex items-center'>
							<div>
								<Image
									src={sabjiKingLogo}
									width={150}
									height={150}
									className='rounded'
									alt='Sabji King Logo'
								/>
							</div>
							<div className='ml-auto'>
								<Image
									src={sabjiKingQr}
									width={70}
									height={70}
									className='rounded ml-auto'
									alt='Sabji King QR'
								/>
								<h4 className='mt-4 text-right'>
									Scan the code above order again.{' '}
								</h4>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							<div className='flex flex-col gap-2'>
								<Card>
									<CardHeader>
										<CardTitle className='text-center text-lg -m-4'>
											Retail Invoice
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='flex items-center gap-4'>
											<div className='font-semibold text-base'>
												Order ID: {order.orderId}
											</div>
											<div className='font-semibold text-base ml-auto'>
												Ordered at: {orderDate}
											</div>
										</div>
										<Table className='mt-4'>
											<TableHeader>
												<TableRow className='hover:bg-inherit'>
													<TableHead className='max-w-[150px] px-0 text-sm'>
														Particulars
													</TableHead>
													<TableHead className='text-right text-sm'>
														Quantity
													</TableHead>
													<TableHead className='text-right text-sm'>
														Rate
													</TableHead>
													<TableHead className='text-right text-sm'>
														Amount
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{order?.items.map(
													(
														item: any,
														index: number
													) => (
														<TableRow
															className='hover:bg-inherit'
															key={index}
														>
															<TableCell className='py-1 text-sm p-0'>
																{
																	item.product
																		.title
																}{' '}
																{`(${item.pack.quantity}${item.pack.unit})`}
															</TableCell>
															<TableCell className='py-1 text-sm text-right'>
																{item.quantity}
																{item.unit}
															</TableCell>
															<TableCell className='py-1 text-sm text-right'>
																{formatPrice(
																	Number(
																		item
																			.pack
																			.price
																	),
																	'INR'
																)}
															</TableCell>
															<TableCell className='py-1 text-sm text-right'>
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
												<TableRow className='hover:bg-inherit'>
													<TableCell></TableCell>
													<TableCell></TableCell>
													<TableCell className='py-1 text-sm'>
														Gross Total
													</TableCell>
													<TableCell className='py-1 text-sm text-right'>
														{billAmount}
													</TableCell>
												</TableRow>
												<TableRow className='hover:bg-inherit'>
													<TableCell></TableCell>
													<TableCell></TableCell>
													<TableCell className='py-1 text-sm'>
														Delivery Cost
													</TableCell>
													<TableCell className='py-1 text-sm text-right'>
														{deliveryCost}
													</TableCell>
												</TableRow>
												<TableRow className='hover:bg-inherit'>
													<TableCell></TableCell>
													<TableCell></TableCell>
													<TableCell className='py-1 text-sm'>
														Net Total
													</TableCell>
													<TableCell className='py-1 text-sm text-right'>
														{netTotal}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</CardContent>
									<div className='md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6'>
										<CustomerDetailsCard order={order} />
									</div>
								</Card>
							</div>
						</div>
					</main>
				</div>
			</body>
		</html>
	);
}

const CustomerDetailsCard = (props: { order: Order }) => {
	return (
		<div className='grid gap-x-2 gap-y-2 lg:mx-0 lg:max-w-none grid-cols-3'>
			<Card className='rounded-xl border-0'>
				<CardHeader className='py-0 flex flex-row items-center space-y-0'>
					<CardTitle className='text-lg'>Customer Details</CardTitle>
				</CardHeader>
				<CardContent className='text-sm'>
					<div className='grid gap-1'>
						<div>{props.order.userDetails.name}</div>
						<div>{props.order.userDetails.phoneNumber}</div>
					</div>
				</CardContent>
			</Card>
			<Card className='rounded-xl border-0'>
				<CardHeader className='py-0 '>
					<CardTitle className='text-lg'>Address</CardTitle>
				</CardHeader>
				<CardContent className='text-sm'>
					<div>{props.order.userDetails.address ?? ''}</div>
				</CardContent>
			</Card>
			<Card className='rounded-xl border-0'>
				<CardHeader className='py-0 '>
					<CardTitle className='text-lg'>Notes</CardTitle>
				</CardHeader>
				<CardContent className='text-sm'>
					{props.order.userDetails.notes}
				</CardContent>
			</Card>
		</div>
	);
};
