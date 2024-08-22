/* eslint-disable @next/next/no-img-element */
import { Product } from "@/types/product";
import { useCartStore } from "@/zustand/cart-store";
import { useUserStore } from "@/zustand/user-store";
import Link from "next/link";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const PeopleAlsoBoughtItemCard = ({ product }: { product: Product }) => {
  // const { user, isAuthenticated, loading, error: userError } = useUserStore();
  // const { addToCart, loading: cartLoading, error: cartError } = useCartStore();

  // if (loading || cartLoading) {
  //   return (
  //     <div className="text-yellow-500 text-base font-medium">
  //       Loading data for you ⏳ ...
  //     </div>
  //   );
  // }

  // if (userError) {
  //   return (
  //     <div className="text-yellow-500 text-base font-medium">{userError}</div>
  //   );
  // }
  // if (cartError) {
  //   return (
  //     <div className="text-yellow-500 text-base font-medium">{cartError}</div>
  //   );
  // }

  // const cartItem = {
  //   cartItemId: uuidv4(),
  //   userId: user?.id!,
  //   productId: product.id,
  //   productName: product.productName,
  //   sellerName: product.sellerName,
  //   productPrice: product.productPrice,
  //   productImage: product.productImageLink,
  //   totalQuantity: 1,
  //   totalPrice: product.productPrice,
  //   selectedProductSize: product.sizes[0],
  // };

  // const handleAddToCart = () => {
  //   if (!user || !isAuthenticated) {
  //     alert("You need to log in to add items to the cart.");
  //     return;
  //   }

  //   console.log("Adding item to cart:", cartItem);
  //   addToCart(cartItem);
  // };

  return (
    <div className="space-y-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Link href="#" className="overflow-hidden rounded">
        <img
          className=" h-44 w-full object-cover"
          src={product.productImageLink}
          alt="imac image"
        />
      </Link>

      <div className="p-2.5">
        <div>
          <Link
            href="#"
            className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
          >
            {product.productName}
          </Link>
          <p className=" text-base font-normal text-gray-500 dark:text-gray-400">
            {product.sellerName}
          </p>
        </div>

        <div>
          <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
            ${product.productPrice}
          </p>
        </div>

        {/* <div className="mt-2.5 flex items-center gap-2.5">
          <button
            onClick={handleAddToCart}
            type="button"
            className="inline-flex w-full items-center justify-center rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            <svg
              className="-ms-2 me-2 h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
              />
            </svg>
            Add to cart
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PeopleAlsoBoughtItemCard;
