"use client";

import React, { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/zustand/product-store";
import { Router, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import ProductAverageStarRatings from "../components/product-average-star-ratings";
import { Header } from "@/components/header";
import { useCartStore } from "@/zustand/cart-store";
import { ProductSize } from "@/types/product-size";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "@/zustand/user-store";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { CartItem } from "@/types/cart-item";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const productId = params?.id!;
  const { productDetails, fetchProductDetails, loading, error } =
    useProductStore();
  const { addToCart, loading: cartLoading, error: cartError } = useCartStore();
  const {
    user,
    loading: userLoading,
    error: userError,
    isAuthenticated,
    placeOrder,
  } = useUserStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId, fetchProductDetails]);

  if (loading || userLoading || cartLoading) {
    return (
      <div className="text-yellow-500 font-semibold text-base">
        Loading Product Details⏳ ...
      </div>
    );
  }

  // Custom error handling for different errors
  if (error) {
    return (
      <div className="text-red-500 font-semibold text-base">
        Error loading product details: {error}
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-red-500 font-semibold text-base">
        Error loading user details: {userError}
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="text-red-500 font-semibold text-base">
        Error adding to cart: {cartError}
      </div>
    );
  }

  const product = productDetails;

  if (!product) {
    return (
      <div className="text-red-500 font-semibold text-base">
        No product found ...
      </div>
    );
  }

  // Set selectedSize to the first available size if not already set
  if (!selectedSize) {
    setSelectedSize(product.sizes[0]);
  }

  return (
    <div className="bg-white">
      <div className="px-8">
        <Header />
      </div>

      <div className="pt-6">
        {/* back arrow and breadcrumb */}
        <div className="flex justify-start space-x-4 max-w-7xl w-full mx-auto pl-8">
          {/* arrow back icon */}
          <Link href={`/`}>
            <IoArrowBackCircleOutline
              size={24}
              className="hover:text-red-500 cursor-pointer transition-all duration-200"
            />
          </Link>

          {/* breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol
              role="list"
              className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
            >
              {/* store breadcrumb item */}
              <div className="flex items-center">
                <Link
                  href={`/`}
                  className="mr-2 text-sm font-medium text-gray-900"
                >
                  Store
                </Link>
                <svg
                  fill="currentColor"
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>

              {/* product name breacrumb item */}
              <li className="text-sm">
                <Link
                  href={`/products/${productId}`}
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600"
                >
                  {product.productName}
                </Link>
              </li>
            </ol>
          </nav>
        </div>

        {/* product details */}
        <div className="mx-auto px-2 md:px-0 lg:grid lg:grid-cols-2 lg:gap-x-8 overflow-x-hidden md:pr-8 md:mb-8">
          {/* Product Image  */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
            <div className="h-[100vh] w-full md:w-[45vw] sm:overflow-hidden sm:rounded-lg">
              <Image
                width="864"
                height="700"
                src={product.productImageLink}
                alt={productId}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* product details */}
          <div className="space-y-4 mt-6">
            {/* product name */}
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {product.productName}
              </h1>
            </div>

            {/* ratings, price, description, size, cart button and check button */}
            <div className="mt-4 lg:row-span-3 lg:mt-0 space-y-6">
              {/* product average star ratings */}
              <ProductAverageStarRatings product={product} />

              {/* product price */}
              <p className="text-3xl tracking-tight text-zinc-900 dark:text-white ">
                ${product.productPrice} USD
              </p>

              {/* product description */}
              <div className="">
                <h3 className="sr-only">Description</h3>

                <div className="space-y-2">
                  {/* product description */}
                  <p
                    className={`${
                      showFullDescription ? "" : "line-clamp-4"
                    }  text-base text-slate-600 dark:text-gray-300 ${
                      showFullDescription ? "" : "overflow-hidden"
                    }`}
                  >
                    {product.productDescription}
                  </p>

                  {/* show more text button */}
                  {product.productDescription.length > 250 ? (
                    <button
                      className="text-sm tracking-tighter font-medium hover:text-red-600 text-red-400 underline .leading-relaxed"
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              {/* Sizes, Add to cart button, Checkout button */}
              <form className="">
                {/* Sizes */}
                <ProductSizes
                  product={product}
                  selectedSize={selectedSize ?? product.sizes[0]}
                  setSelectedSize={setSelectedSize}
                />

                {/* Add to cart button  */}
                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize ?? product.sizes[0]}
                  addToCart={addToCart}
                  user={user!}
                  loading={loading || userLoading || cartLoading}
                />

                {/* Checkout button  */}
                <CheckoutButton
                  product={product}
                  selectedSize={selectedSize ?? product.sizes[0]}
                  isAuthenticated={isAuthenticated}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

const ProductSizes = ({
  product,
  selectedSize,
  setSelectedSize,
}: {
  product: Product;
  selectedSize: ProductSize;
  setSelectedSize: React.Dispatch<React.SetStateAction<ProductSize | null>>;
}) => {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Size</h3>
      </div>

      <fieldset aria-label="Choose a size" className="mt-4">
        <RadioGroup
          value={selectedSize}
          onChange={setSelectedSize}
          className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-5"
        >
          {product.sizes.map((size) => (
            <Radio
              key={size.name}
              value={size}
              disabled={!size.inStock}
              className={cn(
                size.inStock
                  ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                  : "cursor-not-allowed bg-gray-50 text-gray-200",
                "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-red-500 sm:flex-1 sm:py-6"
              )}
            >
              {/* Badge for available quantity */}
              <span
                className={cn(
                  "absolute top-0 left-0 text-xs font-bold px-2 py-1 rounded-md",
                  size.inStock
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-400"
                )}
              >
                {size.availableQuantity}
              </span>

              <span>{size.name}</span>

              {size.inStock ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-red-500"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                >
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                  >
                    <line
                      x1={0}
                      x2={100}
                      y1={100}
                      y2={0}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  );
};

const AddToCartButton = ({
  product,
  selectedSize,
  addToCart,
  user,
  loading,
}: {
  product: Product;
  selectedSize: ProductSize;
  addToCart: (newCartItem: CartItem) => void;
  user: User;
  loading: boolean;
}) => {
  const cartItem = {
    cartItemId: uuidv4(),
    userId: user?.id!,
    productId: product.id,
    productName: product.productName,
    sellerName: product.sellerName,
    productPrice: product.productPrice,
    productImage: product.productImageLink,
    totalQuantity: 1,
    totalPrice: product.productPrice,
    selectedProductSize: selectedSize ?? product.sizes[0],
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("You need to log in to add items to the cart.");
      return;
    }

    if (!selectedSize) {
      alert("Please select a valid size.");
      return;
    }

    console.log("Adding item to cart:", cartItem);
    addToCart(cartItem);
  };

  return (
    <button
      type="submit"
      onClick={handleAddToCart}
      disabled={loading || !selectedSize}
      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed"
    >
      <ShoppingCart size={22} className="mr-2" />
      Add to cart
      {loading ? "Loading..." : "Add to cart"}
    </button>
  );
};

const CheckoutButton = ({
  product,
  selectedSize,
  isAuthenticated,
}: {
  product: Product;
  selectedSize: ProductSize;
  isAuthenticated: boolean;
}) => {
  const router = useRouter();

  const onClick = () => {
    if (!isAuthenticated) {
      alert("You are not logged in, log in to checkout ...");
    } else router.push(`/products/${product.id}/checkout`);
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={!selectedSize || !isAuthenticated}
      className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Checkout
    </button>
  );
};
