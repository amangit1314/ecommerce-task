"use client";

import { CartItem } from "@/types/cart-item";
import { useCartStore } from "@/zustand/cart-store";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const [quantity, setQuantity] = useState(cartItem.totalQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) return; // Prevent quantity from going below 1
    setQuantity(newQuantity);
    updateQuantity(cartItem.cartItemId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(cartItem.cartItemId);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      {/* cart item details */}
      <div className="flex items-center">
        {/* cartitem image */}
        <Link href={`/products/${cartItem.productId}`}>
          <Image
            src={cartItem.productImage}
            alt={cartItem.productName}
            height={80}
            width={80}
            className="w-20 h-20 object-cover rounded-md"
          />
        </Link>

        {/* product name, selected size and quantity buttons */}
        <div className="ml-4">
          {/* product name */}
          <h4 className="text-lg font-semibold">{cartItem.productName}</h4>

          {/* selected size */}
          <p className="text-sm text-gray-500">
            Size: {cartItem.selectedProductSize.name}
          </p>

          {/* quantity and quantity buttons */}
          <div className="flex items-center mt-2">
            <button
              onClick={() => handleQuantityChange(Math.max(quantity - 1, 1))}
              disabled={quantity <= 1}
              className="px-2 py-0.5 text-lg font-bold bg-gray-200 rounded-md hover:bg-red-500 transition-all duration-200"
            >
              -
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-0.5 text-lg font-bold bg-gray-200 rounded-md hover:bg-red-500 transition-all duration-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* button to remove cartItem */}
      <div>
        <p className="text-lg font-semibold">
          ${cartItem.totalPrice.toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="mt-2 text-sm text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
