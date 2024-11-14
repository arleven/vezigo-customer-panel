'use client';

import { useEffect } from 'react';
import CartSheet from '../cart/cart-sheet';
import { StaticImageData } from 'next/image';
import { siteConfig } from '@/config/site-config';
import { MainNav } from '@/components/layouts/main-nav';
import { MobileNav } from '@/components/layouts/mobile-nav';

import vezigoLogo from '../../assets/vezigo.png';
import sabjiKingLogo from '../../assets/sabjiking.png';
import { Combobox } from '../combobox';

const SiteHeader = () => {
	const vezigoDomain = process.env.NEXT_PUBLIC_DOMAIN_VEZIGO as string;
	const sabjiKingDomain = process.env.NEXT_PUBLIC_DOMAIN_SABJI_KING as string;

	let image: StaticImageData = sabjiKingLogo;
	let title: string = 'Sabji King';

	useEffect(() => {
		const origin = window.location.origin;
		console.log('Portal:', window.location.origin);
		if (origin === vezigoDomain) {
			image = vezigoLogo;
			title = 'Vezigo';
		}

		if (origin === sabjiKingDomain) {
			image = sabjiKingLogo;
			title = 'Sabji King';
		}
	}, []);

	return (
		<header
			className='sticky top-0 z-10 w-full border-b'
			style={{ background: '#ffde08' }}
		>
			<div className='container flex h-16 items-center'>
				<MainNav
					mainNavItems={siteConfig.mainNav}
					image={image}
					title={title}
				/>
				<MobileNav
					mainNavItems={siteConfig.mainNav}
					image={image}
					title={title}
				/>
				<div className='flex flex-1 items-center justify-end space-x-4'>
					<nav className='flex items-center space-x-2'>
						{/* <Combobox /> */}
						<CartSheet />
					</nav>
				</div>
			</div>
		</header>
	);
};

export default SiteHeader;
