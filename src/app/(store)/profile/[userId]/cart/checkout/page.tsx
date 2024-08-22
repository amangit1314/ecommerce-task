/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCartStore } from "@/zustand/cart-store";
import { CartItem } from "@/types/cart-item";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/zustand/user-store";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";

type Address = {
  id: any;
  name: string;
  address: string;
  phone: string;
};

const CartCheckoutPage = () => {
  const { cartItems, clearCart, placeOrder } = useCartStore();
  const { isAuthenticated, user } = useUserStore();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const router = useRouter();

  const deliveryAddresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Main St, City, State, ZIP",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Office",
      address: "456 Elm St, City, State, ZIP",
      phone: "987-654-3210",
    },
  ];

  const handlePlaceOrder = () => {
    if (isAuthenticated && selectedAddress) {
      placeOrder(
        user?.id!,
        selectedAddress.address,
        selectedAddress.phone,
        user?.email!,
        "Cash on Delivery"
      );
      toast.success("Order placed successfully!");
      clearCart();
      router.push("/");
    } else if (!isAuthenticated) {
      toast.error("Please login 🔐 to checkout");
    } else {
      toast.error("Please select a delivery address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-12">
        <Header />
      </div>

      <Toaster />

      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 px-8">
        <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          {/* <CheckoutStepper /> */}

          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8">
              {/* Delivery Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delivery Details
                </h2>

                {/* Delivery Address List */}
                <div className="space-y-4">
                  {deliveryAddresses.map((address: Address) => (
                    <div
                      key={address.id}
                      className={`p-4 border ${
                        selectedAddress?.id === address.id
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg cursor-pointer`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {address.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {address.address}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {address.phone}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Toggle button to show/hide add address form */}
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="mt-4 flex items-center space-x-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>{isAddingAddress ? "Hide" : "Add Address"}</span>
                </button>

                {/* Conditionally render the AddDeliveryAddressForm */}
                {isAddingAddress && <AddDeliveryAddressForm />}
              </div>
            </div>

            <div className="space-y-6 max-w-xs w-full">
              {/* Cart Items as Ordered Items */}
              <div className="mt-8 lg:mt-0 space-y-4">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Ordered Items
                  </h3>

                  <div className="space-y-4">
                    {cartItems.map((item: CartItem) => (
                      <div
                        key={item.cartItemId}
                        className="flex justify-start space-x-3 items-start border border-gray-200 rounded-lg"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-l-lg"
                        />

                        <div className="pt-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.productName} ({item.selectedProductSize.name})
                          </p>
                          <div className="flex justify-start items-center space-x-1">
                            <p className="flex justify-start items-center text-gray-600 dark:text-gray-400 text-xs">
                              Quantity:{" "}
                              <span className="px-3 ml-2 py-0.5 rounded-sm bg-red-500 text-white flex justify-center items-center">
                                {item.totalQuantity}
                              </span>{" "}
                              ,
                            </p>
                            <p className="flex justify-start items-center text-gray-600 dark:text-gray-400 text-xs">
                              Size:{" "}
                              <span className="px-3 ml-2 py-0.5 rounded-sm bg-red-500 text-white flex justify-center items-center">
                                {item.selectedProductSize.name}
                              </span>
                            </p>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white mt-1">
                            ${item.totalPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <CheckoutSummary
                shippingAddress={selectedAddress ?? deliveryAddresses[0]}
              />

              {/* Place Order Button */}
              <button
                type="button"
                disabled={!isAuthenticated || !setSelectedAddress}
                onClick={handlePlaceOrder}
                className="mt-8 w-full rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CartCheckoutPage;

const AddDeliveryAddressForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Logic to add the address
    console.log("Address added:", { name, address, phone });
    setName("");
    setAddress("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
      >
        Add Address
      </button>
    </form>
  );
};

const CheckoutSummary = ({ shippingAddress }: { shippingAddress: Address }) => {
  const { cartItems } = useCartStore();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  const tax = (totalPrice * 0.05).toFixed(2); // 5% tax
  const finalPrice = (totalPrice + parseFloat(tax)).toFixed(2);

  return (
    <div className="mt-8 lg:mt-0  space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Order Summary
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Shipping Address
          </span>
          <span className="text-gray-900 dark:text-white">
            {shippingAddress.address}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Payment Method
          </span>
          <span className="text-gray-900 dark:text-white">
            Cash on Delivery
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white">${totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
          <span className="text-gray-900 dark:text-white">${tax}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-stroke pt-2">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-gray-900 dark:text-white">${finalPrice}</span>
        </div>
      </div>
    </div>
  );
};
