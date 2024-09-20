import type { MainNavItem } from "@/types";

export type SiteConfig = typeof siteConfig;

export const apiUrl: string = process.env.NEXT_PUBLIC_API_URL as string;

export const links = {
	rickroll: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
	whatsAppApiUrl: 'whatsapp://send',
	// whatsAppApiUrl: 'https://api.whatsapp.com/send',
	siteAddress: process.env.NEXT_PUBLIC_SITE_ADDRESS as string
};

export const sortOptions = [
	{
		label: "Date: Old to new",
		value: "asc",
	},
	{
		label: "Date: New to old",
		value: "desc",
	},
];

const jodhpurBounds = {
	north: 26.416,
	south: 26.027,
	west: 72.878,
	east: 73.170,
};

export const siteConfig = {
	name: "Vezigo",
	adminPhoneNumber: process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER as string,
	mainNav: [
		{
			title: "Vegetables",
			href: "/vegetables",
		},
		{
			title: "Fruits",
			href: "/fruits",
		}
	] as MainNavItem[],

	footer: [
		{
			title: "Youtube",
			href: links.rickroll,
			external: true,
		},
	],
	googleMap: {
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
		containerStyle: {
			width: 'auto',
			height: '200px'
		},
		defaultLatLong: {
			lat: 26.2389,
			lng: 73.0243
		},
		options: {
			disableDefaultUI: true,
			fullscreenControl: false,
			gestureHandling: 'greedy',
			mapTypeControl: false,
			zoomControl: false,
			restriction: {
				latLngBounds: jodhpurBounds, // Restrict map to Jodhpur
				strictBounds: false, // Allows map to move slightly outside bounds
			},
		},
		zoom: 20
	}
};
