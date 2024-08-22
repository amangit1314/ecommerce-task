"use client";

import { Header } from "@/components/header";
import { CartItem } from "@/types/cart-item";
import { useCartStore } from "@/zustand/cart-store";
import Link from "next/link";
import React, { useEffect } from "react";
import { CartItemCard } from "./components/cart-item-card";
import PeopleAlsoBought from "./components/people-also-bought";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/user-store";

const CartPage = ({ params }: { params: { userId: string } }) => {
  const userId = params?.userId!;
  const { loading, cartItems } = useCartStore();

  if (loading) {
    toast.loading("Loading cartitems ⏳ ...");
  }

  return (
    <div>
      <div className="px-12">
        <Header />
      </div>

      <Toaster />

      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 px-8">
        <div className="mx-auto max-w-screen px-4 2xl:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white md:text-2xl tracking-tight">
            Shopping Cart
          </h2>

          {/* cart items, people also bought and order summary */}
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            {/* cart items and people also bought */}
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
              <div className="space-y-6">
                {cartItems.map((cartItem: CartItem) => (
                  <div key={cartItem.cartItemId}>
                    <CartItemCard cartItem={cartItem} />
                  </div>
                ))}
              </div>

              <PeopleAlsoBought />
            </div>

            {/* order summary */}
            <OrderSummary userId={userId} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;

const OrderSummary = ({ userId }: { userId: string }) => {
  const { totalItems, totalPrice } = useCartStore();
  const savings = 0;
  const storePickup = totalItems >= 1 ? (totalPrice > 25 ? 0 : 5) : 0;
  const tax = Math.ceil(totalItems >= 1 ? totalPrice * 0.05 : 0); // 5% tax

  const sumTotal = totalPrice + tax + storePickup - savings;
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        {/* order summary text */}
        <p className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Order summary
        </p>

        {/* summary items */}
        <div className="space-y-4">
          <div className="space-y-2">
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Original price
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ${totalPrice || 0}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Store Pickup
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ${storePickup}
              </dd>
            </dl>

            {/* <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Items
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                {totalItems}
              </dd>
            </dl> */}

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Savings
              </dt>
              <dd className="text-base font-medium text-green-600">
                -${savings}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Tax
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ${tax}
              </dd>
            </dl>
          </div>

          <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt className="text-base font-bold text-gray-900 dark:text-white">
              Total
            </dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">
              ${sumTotal.toFixed(2)}
            </dd>
          </dl>
        </div>

        {/* checkout button */}
        <button
          onClick={() => {
            router.push(`/profile/${userId}/cart/checkout`);
          }}
          disabled={totalPrice === 0}
          className="flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-40 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Proceed to Checkout
        </button>

        {/* or continue shopping */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            or
          </span>
          <Link
            href="/"
            title=""
            className="inline-flex items-center gap-2 text-sm font-medium text-red-700 underline hover:no-underline dark:text-red-500"
          >
            Continue Shopping
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
