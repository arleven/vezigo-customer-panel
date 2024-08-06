"use client";

import * as React from "react";
import { Icons } from "../icons";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { CartItem as CartItemType, Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { CartItemActions } from "./update-cart";

interface CartItemProps {
	item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
	return (
		<div className="flex items-center space-x-4">
			<div className="relative h-16 w-16 overflow-hidden rounded">
				<Image
					src={item.product.imageUrl}
					alt={item.product.title}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					fill
					className="absolute object-cover"
					loading="lazy"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-1 self-start text-sm">
				<span className="line-clamp-1">{item.product.title}</span>
				<span className="line-clamp-1 text-muted-foreground">
					{formatPrice(Number(item.product.price), item.product.currency)} x {item.quantity} ={" "}
					{formatPrice(Number(item.product.price) * item.quantity, item.product.currency)}
				</span>
				<span className="line-clamp-1 text-xs capitalize text-muted-foreground">
					{item.product.category}
				</span>
			</div>
			<CartItemActions item={item} />
		</div>
	);
}
