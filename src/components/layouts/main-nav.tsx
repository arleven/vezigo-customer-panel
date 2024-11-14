'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MainNavItem } from '@/types';
import { StaticImageData } from 'next/image';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList
} from '@/components/ui/navigation-menu';

interface MainNavProps {
	image: StaticImageData;
	title: string;
	mainNavItems?: MainNavItem[];
}

export function MainNav({ mainNavItems, image, title }: MainNavProps) {
	return (
		<div className='hidden gap-6 lg:flex'>
			<Link
				aria-label='home'
				href='/'
				className='hidden items-center space-x-2 lg:flex'
			>
				<Image
					src={image}
					width={title === 'Vezigo' ? 50 : 200}
					height={title === 'Vezigo' ? 50 : 200}
					className='rounded'
					alt={`${title} Logo`}
				/>

				<span className='hidden font-bold lg:inline-block text-lg md:text-lg'>
					{title === 'Vezigo' ? title : ''}
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
