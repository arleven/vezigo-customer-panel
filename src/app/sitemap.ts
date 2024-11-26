import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://sabjiking.in',
			lastModified: new Date()
		},
		{
			url: 'https://sabjiking.in/vegetables',
			lastModified: new Date()
		},
		{
			url: 'https://sabjiking.in/fruits',
			lastModified: new Date()
		},
	];
}