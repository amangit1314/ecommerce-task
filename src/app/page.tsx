"use client";

import Link from "next/link";
import Image from "next/image";
import { Abril_Fatface } from "next/font/google";
import { Header } from "@/components/header";
import { useProductsStore } from "@/zustand/products-store";
import { useEffect } from "react";

const abrilFatface = Abril_Fatface({
  weight: ["400"],
  subsets: ["latin"],
});

type ProductSize = {
  name: string;
  availableQuantity: number;
  inStock: boolean;
};

type Product = {
  id: string;
  productRating: number;
  productName: string;
  productDescription: string;
  productImageLink: string;
  productPrice: number;
  sellerName: string;
  sizes: ProductSize[];
};

// const products: Product[] = [
//   {
//     id: "product_7sd9f",
//     productRating: 4.9,
//     productName: "Men's V-Neck T-Shirt",
//     productDescription:
//       "A comfortable and stylish V-neck t-shirt made from 100% cotton. Perfect for casual wear, this t-shirt features a classic fit and soft fabric for all-day comfort.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 90,
//     sellerName: "Comforty Handlooms",
//     sizes: [
//       {
//         name: "XL",
//         availableQuantity: 10,
//         inStock: true,
//       },
//       {
//         name: "L",
//         availableQuantity: 15,
//         inStock: true,
//       },
//       {
//         name: "M",
//         availableQuantity: 8,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_2a8k4",
//     productRating: 4.9,
//     productName: "Women's High-Waist Jeans",
//     productDescription:
//       "These high-waist jeans offer a flattering fit and comfortable stretch fabric. Ideal for both casual and semi-formal occasions.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 120,
//     sellerName: "Ocassion Textiles",
//     sizes: [
//       {
//         name: "28",
//         availableQuantity: 12,
//         inStock: true,
//       },
//       {
//         name: "30",
//         availableQuantity: 10,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_9h1l2",
//     productRating: 4.9,
//     productName: "Unisex Hoodie",
//     productDescription:
//       "A cozy and versatile hoodie made from soft fleece material. Features a drawstring hood and front pouch pocket.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 75,
//     sellerName: "Versatility Handlooms",
//     sizes: [
//       {
//         name: "S",
//         availableQuantity: 20,
//         inStock: true,
//       },
//       {
//         name: "M",
//         availableQuantity: 18,
//         inStock: true,
//       },
//       {
//         name: "L",
//         availableQuantity: 10,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_5b9j7",
//     productRating: 4.9,
//     productName: "Leather Wallet",
//     productDescription:
//       "A sleek and durable leather wallet with multiple card slots and a cash compartment. Perfect for everyday use.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 50,
//     sellerName: "Sleek Handlooms",
//     sizes: [],
//   },
//   {
//     id: "product_4c3f8",
//     productRating: 4.9,
//     productName: "Sports Running Shoes",
//     productDescription:
//       "Lightweight and breathable running shoes designed for maximum comfort and performance. Ideal for long runs and daily workouts.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 140,
//     sellerName: "Oversleeves Fashion",
//     sizes: [
//       {
//         name: "8",
//         availableQuantity: 15,
//         inStock: true,
//       },
//       {
//         name: "9",
//         availableQuantity: 10,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_6d8l2",
//     productRating: 4.9,
//     productName: "Women's Summer Dress",
//     productDescription:
//       "A light and breezy summer dress with a floral print. Perfect for beach outings and casual summer days.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 80,
//     sellerName: "Overlays Merchandise",
//     sizes: [
//       {
//         name: "S",
//         availableQuantity: 12,
//         inStock: true,
//       },
//       {
//         name: "M",
//         availableQuantity: 14,
//         inStock: true,
//       },
//       {
//         name: "L",
//         availableQuantity: 10,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_8e7k5",
//     productRating: 4.9,
//     productName: "Men's Casual Sneakers",
//     productDescription:
//       "Stylish and comfortable sneakers for everyday wear. Made from durable materials with a cushioned sole for added comfort.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 100,
//     sellerName: "Coimbatoor Handlooms",
//     sizes: [
//       {
//         name: "10",
//         availableQuantity: 10,
//         inStock: true,
//       },
//       {
//         name: "11",
//         availableQuantity: 8,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_3f9k8",
//     productRating: 4.9,
//     productName: "Kids' Cartoon Print T-Shirt",
//     productDescription:
//       "A fun and vibrant t-shirt featuring popular cartoon characters. Made from soft and breathable cotton, perfect for kids.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 40,
//     sellerName: "Camorina Cosata",
//     sizes: [
//       {
//         name: "XS",
//         availableQuantity: 20,
//         inStock: true,
//       },
//       {
//         name: "S",
//         availableQuantity: 15,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_7g2n1",
//     productRating: 4.9,
//     productName: "Women's Yoga Pants",
//     productDescription:
//       "Comfortable and stretchy yoga pants ideal for workouts and casual wear. Features a high waistband and moisture-wicking fabric.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 60,
//     sellerName: "Range Wide Fashion",
//     sizes: [
//       {
//         name: "M",
//         availableQuantity: 18,
//         inStock: true,
//       },
//       {
//         name: "L",
//         availableQuantity: 12,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_2j3k4",
//     productRating: 4.9,
//     productName: "Men's Leather Belt",
//     productDescription:
//       "A classic leather belt with a sleek buckle design. Perfect for both casual and formal attire.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     productPrice: 35,
//     sellerName: "Nike Sports Wear",
//     sizes: [
//       {
//         name: "32",
//         availableQuantity: 10,
//         inStock: true,
//       },
//       {
//         name: "34",
//         availableQuantity: 15,
//         inStock: true,
//       },
//     ],
//   },
//   {
//     id: "product_9k2m3",
//     productRating: 4.9,
//     productName: "Women's Fashion Handbag",
//     productDescription:
//       "A stylish and spacious handbag made from premium materials. Features multiple compartments for easy organization.",
//     productImageLink:
//       "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR7NR5P_iInEXkrlcOomh69Awyj49ES7JZcXdZ-_6VYSI1PqL8Znk1b8QJFisF8SjtbgIxz7bYT7gEQ4T3IScYAa5b7h0Rqfd5PJ5zotoMPszc6ocv-ttJ4",
//     sellerName: "Varsache Textiles",
//     productPrice: 150,
//     sizes: [],
//   },
// ];

export default function Home() {
  const { loading, products, fetchProducts, error } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    <div className="text-yellow-500 font-semibold text-base">
      {" "}
      Loading ⏳ ...
    </div>;
  }

  if (error) {
    return (
      <div className="text-red-500 font-semibold text-base">
        `Error: {error}`
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between space-y-10 px-12 pb-12">
      {/* header */}
      <Header />

      <div className="space-y-5 max-w-screen w-full">
        {/* <div className={abrilFatface.className}>
          <h1 className="text-4xl font-bold">Ecommerce Products</h1>
        </div> */}

        <h1 className="text-4xl font-extrabold tracking-tighter">Store</h1>

        <p className="text-base w-7/12">
          {/* Explore our curated selection of top-quality products across
          categories. Whether you&apos;re looking for the latest trends,
          timeless classics, or innovative solutions, we have something for
          everyone.  */}
          Browse through our collections to find exactly what you need, all in
          one place. Shop now and enjoy exclusive deals and discounts!
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-screen w-full mx-15">
        {products.map((product: any) => {
          return (
            <div key={product.id}>
              <ProductCard2 product={product} />
            </div>
          );
        })}
      </div>
    </main>
  );
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="space-y-2">
      <Link href={`/products/${product.id}`}>
        <div>
          <Image
            src={
              product.productImageLink ??
              "https://www.shutterstock.com/image-vector/3d-fingerprint-cyber-secure-icon-600nw-2145772287.jpg"
            }
            alt="Image"
            width={160}
            height={220}
            className="h-[10rem] w-[15rem]  object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </Link>

      {/* product name, sellername, price */}
      <div>
        <h2 className="font-semibold text-base tracking-tight">
          {product.productName}
        </h2>
        <p className="text-xs mb-1">{product.sellerName}</p>
        <p className="tracking-tight text-sm">${product.productPrice}</p>
      </div>
    </div>
  );
};

const ProductCard2 = ({ product }: { product: Product }) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href={`/products/${product.id}`}>
        <Image
          src={
            product.productImageLink ??
            "https://www.shutterstock.com/image-vector/3d-fingerprint-cyber-secure-icon-600nw-2145772287.jpg"
          }
          alt="Image"
          width={160}
          height={220}
          className="h-[10rem] w-[15rem] rounded-t-lg  object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </a>

      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1">
            {product.productName ??
              "Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport"}
          </h5>
        </Link>

        {/* ratings stars and rating */}
        <div className="flex justify-between items-center">
          <p className=" text-base font-normal text-gray-500 dark:text-gray-400">
            {product.sellerName}
          </p>

          <div className="flex items-center justify-end ">
            {/* <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <svg
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            </div> */}

            <span className="flex justify-center items-center  text-red-800 text-xs font-semibold px-2.5 space-x-1 rounded dark:bg-red-200 dark:text-red-800 ms-3">
              <svg
                className="w-4 h-4 mb-1 text-yellow-300 mr-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              {product.productRating ?? " 5.0"}
            </span>
          </div>
        </div>

        <div>
          {/* <p className="text-lg font-bold text-gray-900 dark:text-white">
          <span className="line-through"> $399,99 </span>
        </p> */}
          <p className="text-lg font-bold leading-tight text-white mt-2">
            ${product.productPrice}
          </p>
        </div>

        {/* <span className="text-xl font-bold text-gray-900 dark:text-white">
            ${product.productPrice ?? "599"}
          </span> */}

        {/* <div className="flex items-center justify-between w-full">
          <div className="mt-2.5 flex items-center gap-2.5 w-full">


            <button
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
          </div>
        </div> */}
      </div>
    </div>
  );
};
