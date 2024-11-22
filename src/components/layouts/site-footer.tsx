import { Shell } from '../Shells/shell';
import { siteConfig } from '@/config/site-config';
import Link from 'next/link';

const stats = [
	{
		id: 1,
		name: 'Quickly deliver at your doorstep',
		value: 'Free and next day delivery'
	},
	{
		id: 2,
		name: 'Hygienic high-quality products',
		value: '100% Satisfaction Guarantee'
	},
	{ id: 3, name: 'Unbeatable daily offers', value: 'Great daily deals' }
];

export default function SiteFooter() {
	return (
		<footer className='w-full'>
			<div className='py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-2 lg:px-4'>
					<dl className='grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3'>
						{stats.map((stat) => (
							<div
								key={stat.id}
								className='mx-auto flex max-w-xs flex-col gap-y-4 border-2 rounded-2xl p-8'
							>
								<dt className='text-sm text-gray-700'>
									{stat.name}
								</dt>
								<dd className='order-first text-2xl font-semibold tracking-tight text-gray-900'>
									{stat.value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>

			<Shell as='div'>
				<section className='text-muted-foreground'>
					<div className='justify-center gap-x-6 flex mb-4'>
						<h2 className='text-2xl'>
							{siteConfig.footer[1].title}
						</h2>
					</div>
					<span className='space-y-3'>
						Fresh fruits and vegetables should be a part of
						everyone&apos;s meal, some products are hard to find in
						the market and not possible for everyone to shop fresh
						fruits and vegetables due to various reasons and
						personal situations but now it is possible for everyone
						to shop equally or according to their need whenever and
						wherever.
					</span>
				</section>
			</Shell>

			{/* <Shell as='div'>
				<section className=' text-sm text-muted-foreground'>
					<ul className='justify-center gap-x-6 flex'>
						{siteConfig.footer.map((item) => (
							<div key={item.title} className='space-y-3'>
								<li>
									<Link href={item.href} target='_blank'>
										{item.title}
									</Link>
								</li>
							</div>
						))}
					</ul>
				</section>
			</Shell> */}
		</footer>
	);
}
