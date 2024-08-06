import { Header } from "@/components/header";
import { Shell } from "@/components/Shells/shell";
import { Products } from "@/components/products";

import { Product } from "@/types";
import { apiUrl } from "@/config/site-config";
import axios from "axios";

export async function getProducts(sort?: string): Promise<Product[]> {
	try {
		const productsApiUrl = `${apiUrl}/products?category=fruit`;
		const response = await axios.get(productsApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data.results;
	} catch (error) {
		console.error("Error fetching product data:", error);
		return [];
	}
}

interface ProductsPageProps {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	const { page, sort } = searchParams;

	const data = (await getProducts(sort as string)) as Product[];

	const limit = typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 100;
	const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0;

	const products = data.slice(offset, offset + limit);
	const pageCount = Math.ceil(data.length / limit);

	return (
		<div>
			<Shell>
				<Header
					title="Fruits"
					description="Find a wide selection of fruits that are fresh and according to your needs."
					size="sm"
				/>
				<Products
					products={products}
					pageCount={pageCount}
					page={typeof page === "string" ? page : undefined}
					limit={typeof limit === "string" ? limit : undefined}
					sort={typeof sort === "string" ? sort : undefined}
				/>
			</Shell>
		</div>
	);
}
