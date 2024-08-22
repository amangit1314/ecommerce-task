"use client";

import { Product } from "@/types/product";
import { ProductSize } from "@/types/product-size";
import { useProductStore } from "@/zustand/product-store";
import { useUserStore } from "@/zustand/user-store";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Address = {
  id: any;
  name: string;
  address: string;
  phone: string;
};

const ProductCheckoutPage = ({ params }: { params: { id: string } }) => {
  const productId = params?.id!;

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState<Address[]>([
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
  ]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const { fetchProductDetails, productDetails, selectedSize } =
    useProductStore();
  const { user } = useUserStore();

  const [quantity, setQuantity] = useState(1); // Moved quantity state here

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId, fetchProductDetails]);

  const handleAddAddressClick = () => {
    setIsAddingAddress(true);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = deliveryAddresses.length + 1;
    setDeliveryAddresses([...deliveryAddresses, { id: newId, ...newAddress }]);
    setNewAddress({ name: "", address: "", phone: "" });
    setIsAddingAddress(false);
    toast.success("Address added successfully!");
  };

  const subtotal = quantity * productDetails?.productPrice!;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax + 99; // Assuming $99 for store pickup

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 px-8">
      <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
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

              {!isAddingAddress ? (
                <button
                  type="button"
                  onClick={handleAddAddressClick}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Add New Address
                </button>
              ) : (
                <AddDeliveryAddressForm
                  newAddress={newAddress}
                  handleChange={handleAddressChange}
                  handleSubmit={handleAddAddressSubmit}
                />
              )}
            </div>

            {/* Payment options */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <PaymentOptionCard />
              </div>
            </div>
          </div>

          <div className="max-w-xs w-full">
            <CheckoutSummary
              productDetails={productDetails!}
              selectedSize={selectedSize ?? productDetails?.sizes[0]!}
              selectedShippingAddress={selectedAddress ?? deliveryAddresses[0]}
              quantity={quantity} // Pass quantity as prop
              setQuantity={setQuantity} // Pass setQuantity as prop
            />

            <PlaceOrderButton
              user={user!}
              product={productDetails!}
              selectedProductSize={selectedSize ?? productDetails?.sizes[0]!}
              shippingAddress={
                selectedAddress?.name ?? deliveryAddresses[0].name
              }
              mobileNumber={selectedAddress?.phone!}
              totalPrice={total}
              totalQuantity={quantity} // Pass quantity as totalQuantity
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProductCheckoutPage;

type PlaceOrderButtonProps = {
  userId: string;
  product: Product;
  selectedProductSize: ProductSize;
  shippingAddress: string;
  mobileNumber: string;
  email: string;
  paymentMethod: string;
  totalPrice: number;
  totalQuantity: number;
};

const PlaceOrderButton = ({
  user,
  product,
  selectedProductSize,
  shippingAddress,
  mobileNumber,
  totalPrice,
  totalQuantity,
}: {
  user: User;
  product: Product;
  selectedProductSize: ProductSize;
  shippingAddress: string;
  mobileNumber: string;
  totalPrice: number;
  totalQuantity: number;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);

    try {
      if (!user) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch("api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          shippingAddress,
          mobileNumber,
          email: user.email,
          paymentMethod: "Cash on delivery", // Update as needed
          orderItems: [
            {
              productName: product.productName,
              productImage: product.productImageLink,
              productPrice: product.productPrice,
              productRating: product.productRating,
              selectedSize: selectedProductSize,
              totalPrice,
              quantity: totalQuantity,
              selectedProductSize: selectedProductSize,
            },
          ],
          orderTotalPrice: totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to place order: ${response.statusText}`);
      }

      const data = await response.json();

      setLoading(false);
      toast.success("Order placed successfully!");
      router.push(`/profile/${user.id}/orders`);
    } catch (error) {
      console.error("Place single product order error:", error);
      setLoading(false);
      toast.error("Failed to place order");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={placeOrder}
        className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

const CheckoutSummary = ({
  selectedShippingAddress,
  productDetails,
  selectedSize,
  quantity,
  setQuantity,
}: {
  productDetails: Product;
  selectedSize: ProductSize;
  selectedShippingAddress: Address;
  quantity: number;
  setQuantity: (quantity: number) => void;
}) => {
  const subtotal = quantity * productDetails?.productPrice!;
  const tax = subtotal * 0.05; // 5% tax
  const storePicUp = productDetails?.productPrice! > 20 ? 0 : 99;
  const total = subtotal + tax + storePicUp; // Assuming $99 for store pickup

  const handleQuantityChange = (event: any) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  return (
    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
      <div className="flow-root">
        <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Subtotal
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Savings
            </dt>
            <dd className="text-base font-medium text-green-500">0</dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Store Pickup
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ${storePicUp}
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Tax
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ${tax.toFixed(2)}
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-bold text-gray-900 dark:text-white">
              Total
            </dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">
              ${total.toFixed(2)}
            </dd>
          </dl>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product Details
        </h3>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {productDetails?.productName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selected Size: {selectedSize.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selected Shipping Address: {selectedShippingAddress.address}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              ${(quantity * productDetails?.productPrice!).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="quantity"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              Quantity:
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              {[...Array(10).fill(0)].map((_, n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Shipping Address
        </h3>
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedShippingAddress.address}
          </p>
        </div>
      </div>
    </div>
  );
};

const AddDeliveryAddressForm = ({
  newAddress,
  handleChange,
  handleSubmit,
}: {
  newAddress: { name: string; address: string; phone: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Add New Address
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={newAddress.name}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={newAddress.address}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={newAddress.phone}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Add Address
        </button>
      </form>
    </div>
  );
};

const PaymentOptionCard = () => {
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState("Cash on delivery");

  const handlePaymentOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentOption(e.target.value);
  };

  return (
    <div className="p-4 border rounded-lg">
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="payment"
          value="Cash on delivery"
          checked={selectedPaymentOption === "Cash on delivery"}
          onChange={handlePaymentOptionChange}
          className="text-red-600 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        />
        <span className="ml-2 text-gray-900 dark:text-white">
          Cash on delivery
        </span>
      </label>
    </div>
  );
};
