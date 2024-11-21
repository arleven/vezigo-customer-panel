import { headers } from 'next/headers';
import CartSheet from '../cart/cart-sheet';
import { StaticImageData } from 'next/image';
import { apiUrl, siteConfig } from '@/config/site-config';
import { MainNav } from '@/components/layouts/main-nav';
import { MobileNav } from '@/components/layouts/mobile-nav';

import vezigoLogo from '../../assets/vezigo.png';
import sabjiKingLogo from '../../assets/sabjiking.png';
import { Combobox } from '../combobox';
import { Zone } from '@/types';
import axios from 'axios';

async function getZones(sort?: string): Promise<Zone[]> {
	try {
		const zonesApiUrl = `${apiUrl}/zones`;
		const response = await axios.get(zonesApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data.results;
	} catch (error) {
		console.error('Error fetching zones:', error);
		return [];
	}
}

const SiteHeader = async () => {
	const vezigoDomain = process.env.NEXT_PUBLIC_DOMAIN_VEZIGO as string;
	const sabjiKingDomain = process.env.NEXT_PUBLIC_DOMAIN_SABJI_KING as string;

	let image: StaticImageData = sabjiKingLogo;
	let title: string = 'Sabjiking';

	const headersList = headers();
	const host = headersList.get('X-Forwarded-Host');

	if (host === vezigoDomain) {
		image = vezigoLogo;
		title = 'Vezigo';
	}

	if (host === sabjiKingDomain) {
		image = sabjiKingLogo;
		title = 'Sabjiking';
	}

	const zones = (await getZones()) as Zone[];

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
						<CartSheet zones={zones} />
					</nav>
				</div>
			</div>
		</header>
	);
};

export default SiteHeader;
