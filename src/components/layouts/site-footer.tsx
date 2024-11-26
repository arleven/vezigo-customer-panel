import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
	ExternalLinkIcon,
	Facebook,
	Instagram,
	Linkedin,
	Twitter,
	Youtube
} from 'lucide-react';

const socialLinks = [
	{
		title: 'Twitter',
		href: 'https://x.com/sabjiking',
		icon: <Twitter size={16} />
	},
	{
		title: 'Facebook',
		href: 'https://facebook.com/people/Sabjikingin/61569418040193/',
		icon: <Facebook size={16} />
	},
	{
		title: 'Instagram',
		href: 'https://instagram.com/sabjiking.in/',
		icon: <Instagram size={16} />
	},
	{
		title: 'LinkedIn',
		href: 'https://linkedin.com/in/sabjiking-jodhpur/',
		icon: <Linkedin size={16} />
	},
	{
		title: 'YouTube',
		href: 'https://youtube.com/@sabjiking.jodhpur',
		icon: <Youtube size={16} />
	}
];

export default function SiteFooter() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<Separator className='my-2' />
			<div className='container mx-auto px-4'>
				<div className='py-8 md:py-12'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div>
							<h2 className='text-lg font-semibold mb-4 inline-flex'>
								About Us
								<Link
									href='/about-us'
									className='ml-2'
									target='_blank'
								>
									<ExternalLinkIcon className='w-5' />
								</Link>
							</h2>
							<p className='text-sm text-muted-foreground mb-10'>
								Sabjiking.in is Jodhpur’s go-to online store for
								fresh fruits and vegetables, delivered right to
								your doorstep. We ensure premium quality and
								unmatched convenience to make healthy living
								easier for you.
							</p>
						</div>
						<div>
							<h2 className='text-lg font-semibold mb-4 inline-flex'>
								Contact Us
								<Link
									href='/contact-us'
									className='ml-2'
									target='_blank'
								>
									<ExternalLinkIcon className='w-5' />
								</Link>
							</h2>
							<p className='text-sm text-muted-foreground mb-10'>
								Got questions or need assistance? Reach out to
								us—we’re here to help!
							</p>
						</div>
						<div>
							<h2 className='text-lg font-semibold mb-4'>
								Connect With Us
							</h2>
							<ul className='space-y-2'>
								{socialLinks.map((socialLink) => (
									<li key={socialLink.title}>
										<Link
											href={socialLink.href}
											className='text-sm text-muted-foreground hover:text-primary flex items-center gap-2'
										>
											{socialLink.icon}
											{socialLink.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<Separator />
				<div className='pt-6 text-center text-sm text-muted-foreground'>
					© {new Date().getFullYear()} <strong>Sabjiking</strong>. All
					rights reserved.
				</div>
			</div>
		</div>
	);
}
