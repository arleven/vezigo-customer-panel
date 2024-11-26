import Image from 'next/image';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold text-center mb-8'>
				About Sabjiking.in
			</h1>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Our Story</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid md:grid-cols-2 gap-6'>
						<div>
							<p className='text-lg mb-4'>
								Welcome to Sabjiking.in, your trusted online
								store for fresh fruits and vegetables in
								Jodhpur!
							</p>

							<p className='text-base mb-4'>
								At Sabjiking, we’re passionate about bringing
								the freshest, highest-quality produce right to
								your doorstep. Whether you’re stocking up on
								seasonal fruits, daily veggies, or exotic
								ingredients for a special recipe, we’ve got you
								covered.
							</p>

							<p className='text-base mb-4'>
								Our mission is simple: to save you time, offer
								unbeatable convenience, and ensure your family
								enjoys the healthiest and freshest foods
								available. Every item is handpicked, carefully
								packed, and delivered with love—because your
								health matters to us.
							</p>

							<p className='text-base mb-4'>
								Say goodbye to long grocery lines and hello to
								the ease of shopping with Sabjiking.in. Explore,
								click, and enjoy the freshness of nature without
								stepping out of your home.
							</p>

							<p className='italic'>
								Sabjiking — Royal freshness, right at your
								doorstep!
							</p>
						</div>
						<div className='relative h-64 md:h-auto'>
							<Image
								src='https://images.unsplash.com/photo-1604750658560-7d8041c18311?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
								alt=''
								layout='fill'
								objectFit='cover'
								className='rounded-lg'
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* <OurTeam /> */}

			{/* <GetInTouch /> */}
		</div>
	);
}

const OurTeam = () => {
	return (
		<Card className='mb-8'>
			<CardHeader>
				<CardTitle>Our Team</CardTitle>
				<CardDescription>
					Meet the people behind our success
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
					{[
						{
							name: 'John Doe',
							role: 'CEO',
							image: '/placeholder.svg?height=100&width=100'
						},
						{
							name: 'Jane Smith',
							role: 'CTO',
							image: '/placeholder.svg?height=100&width=100'
						},
						{
							name: 'Mike Johnson',
							role: 'Lead Developer',
							image: '/placeholder.svg?height=100&width=100'
						},
						{
							name: 'Sarah Brown',
							role: 'Designer',
							image: '/placeholder.svg?height=100&width=100'
						}
					].map((member) => (
						<div key={member.name} className='text-center'>
							<Avatar className='w-24 h-24 mx-auto mb-2'>
								<AvatarImage
									src={member.image}
									alt={member.name}
								/>
								<AvatarFallback>
									{member.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<h3 className='font-semibold'>{member.name}</h3>
							<p className='text-sm text-gray-500'>
								{member.role}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

const GetInTouch = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Get in Touch</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='mb-4'>
					We&apos;d love to hear from you! Whether you have a question
					about our services, want to join our team, or just want to
					say hello, don&apos;t hesitate to reach out.
				</p>
				<div className='flex flex-col md:flex-row justify-between items-center'>
					<div className='mb-4 md:mb-0'>
						<p className='font-semibold'>Email:</p>
						<p>info@sabjiking.in</p>
						<p className='font-semibold mt-2'>Phone:</p>
						<p>+1 (123) 456-7890</p>
					</div>
					<Button
						size='lg'
						className='rounded-xl bg-green-500 hover:bg-green-600'
					>
						Contact Us
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
