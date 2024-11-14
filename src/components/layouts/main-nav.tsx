'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { MainNavItem } from '@/types';
import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import vezigoLogo from '../../assets/vezigo.png';

interface MainNavProps {
	mainNavItems?: MainNavItem[];
}

export function MainNav({ mainNavItems }: MainNavProps) {
	return (
		<div className='hidden gap-6 lg:flex'>
			<Link
				aria-label='home'
				href='/'
				className='hidden items-center space-x-2 lg:flex'
			>
				{/* <Icons.shoppingCart className='h-6 w-6' aria-hidden='true' /> */}
				{/* <Avatar>
					<AvatarImage src='https://github.com/shadcn.png' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar> */}

				<Image
					src={vezigoLogo}
					width={50}
					height={50}
					className='rounded'
					alt='Vezigo Logo'
				/>

				<span className='hidden font-bold lg:inline-block text-lg md:text-lg'>
					{siteConfig.name}
				</span>
			</Link>

			<NavigationMenu>
				<NavigationMenuList>
					{mainNavItems?.map(
						(item) =>
							item.href && (
								<NavigationMenuItem key={item.title}>
									<Link
										href={item.href}
										legacyBehavior
										passHref
									>
										<NavigationMenuLink
											className={cn(
												// navigationMenuTriggerStyle(),
												'group inline-flex h-10 w-max items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium transition-colors hover:bg-yellow-400 hover:text-yellow-400-foreground focus:bg-yellow-300 focus:outline-none',
												'text-sm'
											)}
											style={{ background: '#ffde08' }}
										>
											{item.title}
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							)
					)}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
