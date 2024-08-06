import { useDebounce } from "@/hooks/use-debounce";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { Skeleton } from "./ui/skeleton";
import { apiUrl } from "@/config/site-config";
import axios from "axios";

async function getProducts(sort?: string): Promise<Product[]> {
	try {
		const productsApiUrl = `${apiUrl}/products`;
		const response = await axios.get(productsApiUrl);
		const responseData = await response.data;
		const { data } = responseData;
		return data.results;
	} catch (error) {
		console.error("Error fetching product data:", error);
		return [];
	}
}

export function Combobox() {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isOpen, setIsOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const debouncedQuery = useDebounce(query, 300);
	const [products, setProducts] = React.useState<Product[]>([]);

	const fetchData = async () => {
		setIsLoading(true);
		const products = await getProducts();
		setIsLoading(false);
		setProducts(products as Product[]);
	};

	React.useEffect(() => {
		fetchData();
	}, []);

	const filterProducts = (query: string, products: Product[]) => {
		const filteredData = products.filter((product) =>
			product.title.toLowerCase().includes(query.toLowerCase())
		);

		return filteredData;
	};

	const handleSelect = (product: Product) => {
		router.push(`/${product.category}s/${product.id}`);
		setIsOpen(false);
	};

	React.useEffect(() => {
		if (!isOpen) {
			setQuery("");
		}
	}, [isOpen]);

	const filteredData = filterProducts(debouncedQuery, products);

	return (
		<>
			<Button
				variant="outline"
				className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
				onClick={() => setIsOpen(true)}
			>
				<Icons.search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
				<span className="hidden xl:inline-flex text-xs">
					Search...
				</span>
			</Button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput
					placeholder="Search..."
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList className="p-2">
					{isLoading ? (
						<div className="space-y-1 overflow-hidden px-1 py-2">
							<Skeleton className="h-4 w-10 rounded" />
							<Skeleton className="h-8 rounded-sm" />
							<Skeleton className="h-8 rounded-sm" />
						</div>
					) : filteredData && filteredData.length > 0 ? (
						filteredData.map((product) => (
							<CommandItem
								key={product.id}
								onSelect={() => handleSelect(product)}
							>
								{product.title}
							</CommandItem>
						))
					) : (
						<CommandEmpty className="py-6 text-center text-sm">
							No products found
						</CommandEmpty>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}
