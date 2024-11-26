import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

import React from 'react';

const ContactUs = () => {
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold text-center mb-8'>
				Contact SabjiKing
			</h1>
			<Card>
				<CardHeader>
					<CardTitle>Get in Touch</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						Have a question or need help with your royal delivery of
						freshness? The King’s court is always open to serve you!
						<br />
						<br />
						Or send us a message through the contact form below, and
						we’ll respond faster than your veggies can get sliced 😃
						<br />
						<br />
						At SabjiKing, your happiness is as important as the
						freshness we deliver. Let us know how we can make your
						experience even better!
					</p>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<div className='mb-4 md:mb-0'>
							{/* <p className='font-semibold'>Email:</p>
							<p>info@sabjiking.in</p> */}
							{/* <p className='font-semibold mt-2'>Phone:</p>
							<p>+1 (123) 456-7890</p> */}
						</div>
						<Link
							href='mailto:info@sabjiking.in?subject=Inquiry for SabjiKing&body=Hello SabjiKing Team,'
							className='p-2 rounded-xl text-gray-100 bg-green-500 hover:bg-green-600'
						>
							Contact Us
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ContactUs;
