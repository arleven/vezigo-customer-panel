import { Header } from '@/components/header';
import { Shell } from '@/components/Shells/shell';
import { Products } from '@/components/products';

import { Config, Product } from '@/types';
import { apiUrl } from '@/config/site-config';
import axios from 'axios';

export async function getProducts(sort?: string): Promise<Product[]> {
	try {
		const productsApiUrl = `${apiUrl}/products?category=vegetable`;
		const response = await axios.get(productsApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data.results;
	} catch (error) {
		console.error('Error fetching product data:', error);
		return [];
	}
}

export async function getConfig() {
	try {
		const configApiUrl = `${apiUrl}/app/config`;
		const response = await axios.get(configApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data;
	} catch (error) {
		console.error('Error fetching config data:', error);
		return null;
	}
}

interface ProductsPageProps {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
}

export default async function ProductsPage({
	searchParams
}: ProductsPageProps) {
	const { page, sort } = searchParams;

	const data = (await getProducts(sort as string)) as Product[];

	const config = (await getConfig()) as Config;

	const limit =
		typeof searchParams.limit === 'string'
			? parseInt(searchParams.limit)
			: 100;
	const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

	// const products = data.slice(offset, offset + limit);
	const pageCount = Math.ceil(data.length / limit);

	return (
		<div>
			<Shell>
				<Header
					title='Vegetables'
					description={config.vegetablesDescription}
					heading={config.heading}
					size='sm'
				/>
				<Products
					products={data}
					pageCount={pageCount}
					page={typeof page === 'string' ? page : undefined}
					limit={typeof limit === 'string' ? limit : undefined}
					sort={typeof sort === 'string' ? sort : undefined}
				/>
			</Shell>
		</div>
	);
}
