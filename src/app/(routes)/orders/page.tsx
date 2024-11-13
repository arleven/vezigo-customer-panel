'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Shell } from '@/components/Shells/shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OrderPage() {
	const orders = JSON.parse(localStorage.getItem('orders'));

	return (
		<Shell as='div' className='gap-12'>
			<main className='flex flex-1 flex-col gap-4 md:gap-8'>
				<div className='flex flex-col md:grid md:grid-cols-6 gap-6'>
					<div className='md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6'>
						<Header title='Order History' size='sm' />
						{orders.map((order: any) => (
							<Link key={order.id} href={`/orders/${order.id}`}>
								<Card key={order.id}>
									<CardHeader className='-mb-5'>
										<CardTitle className='text-xl'>
											Order ID: {order.orderId}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='flex items-center space-x-4'>
											<div className='flex flex-1 flex-col gap-1 self-start text-sm'>
												<span className='sm:text-base text-sm line-clamp-1'>
													Ordered Quantity:{' '}
													{order.items.length} Items
												</span>
												<span className='sm:text-base text-sm line-clamp-1'>
													Billed Amount: ₹
													{order.billAmount}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</main>
		</Shell>
	);
}
