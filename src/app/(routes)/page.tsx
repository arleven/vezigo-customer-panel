import { Shell } from '@/components/Shells/shell';
import { apiUrl, siteConfig } from '@/config/site-config';

import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Product } from '@/types';
import axios from 'axios';

async function getProducts(sort?: string): Promise<Product[]> {
	try {
		const productsApiUrl = `${apiUrl}/products`;
		const response = await axios.get(productsApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data.results;
	} catch (error) {
		console.error('Error fetching product data:', error);
		return [];
	}
}

export default async function HomePage() {
	const data = (await getProducts()) as Product[];
	const vegetables = data
		.filter((product) => product.category === 'vegetable')
		.slice(0, 4);
	const fruits = data
		.filter((product) => product.category === 'fruit')
		.slice(0, 4);
	return (
		<Shell as='div' className='gap-12'>
			<section
				id='hero'
				aria-labelledby='hero-heading'
				className='mx-auto flex flex-col w-full max-w[64rem] items-center justify-center text-center gap-4 pb-2 pt-2 md:pb-2 md:pt-2 lg:py-2'
			>
				<h1 id='hero-heading' className='text-4xl font-bold'>
					Welcome to {siteConfig.name}
				</h1>
				<p className='text-xl text-muted-foreground'>
					Discover the best and fresh vegetables for all your needs
				</p>
				<Link href={'/vegetables'}>
					<Button className='bg-green-500 hover:bg-green-600'>
						Shop now
					</Button>
				</Link>
			</section>

			{/* Featured Vegetables */}
			{vegetables.length > 0 && (
				<section
					id='featured-vegetables'
					aria-labelledby='featured-vegetables-heading'
					className='space-y-6'
				>
					<div className='flex items-center'>
						<h2 className='flex-1 text-2xl font-medium sm:text-3xl'>
							Featured Vegetables
						</h2>
					</div>
					<div className='grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{vegetables.map((vegetable) => (
							<ProductCard
								key={vegetable.id}
								product={vegetable}
								showCartButton={false}
							/>
						))}
					</div>
				</section>
			)}

			{/* Featured Fruits */}
			{fruits.length > 0 && (
				<section
					id='featured-fruits'
					aria-labelledby='featured-fruits-heading'
					className='space-y-6'
				>
					<div className='flex items-center'>
						<h2 className='flex-1 text-2xl font-medium sm:text-3xl'>
							Featured Fruits
						</h2>
					</div>
					<div className='grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{fruits.map((fruit) => (
							<ProductCard
								key={fruit.id}
								product={fruit}
								showCartButton={false}
							/>
						))}
					</div>
				</section>
			)}
		</Shell>
	);
}
