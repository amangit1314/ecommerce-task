"use client";

import { CartItem } from "@/types/cart-item";
import { useCartStore } from "@/zustand/cart-store";
import Link from "next/link";
import { useState } from "react";

// export function CartItemCard({ cartItem }: { cartItem: CartItem }) {
//   const { loading, error, cartItems, removeFromCart, fetchCartItems, updateQuantity } =
//     useCartStore();

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
//       <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
//         <Link
//           href={`/products/${cartItem.productId}`}
//           className="shrink-0 md:order-1"
//         >
//           <img
//             className="h-20 w-20"
//             src={cartItem.productImage}
//             alt="imac image"
//           />
//         </Link>

//         <label htmlFor="counter-input" className="sr-only">
//           Choose quantity:
//         </label>

//         {/* quantity controls and price */}
//         <div className="flex items-center justify-between md:order-3 md:justify-end">
//           {/* quantity controls */}
//           <div className="flex items-center">
//             {/* decrease quantity button */}
//             <button
//               type="button"
//               id="decrement-button"
//               data-input-counter-decrement="counter-input"
//               className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
//             >
//               <svg
//                 className="h-2.5 w-2.5 text-gray-900 dark:text-white"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 18 2"
//               >
//                 <path
//                   stroke="currentColor"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="M1 1h16"
//                 />
//               </svg>
//             </button>

//             {/* quantity input and display */}
//             <input
//               type="text"
//               id="counter-input"
//               data-input-counter
//               className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
//               placeholder=""
//               value={cartItem.totalQuantity}
//               required
//             />

//             {/* increase quantity button */}
//             <button
//               type="button"
//               id="increment-button"
//               data-input-counter-increment="counter-input"
//               className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
//             >
//               <svg
//                 className="h-2.5 w-2.5 text-gray-900 dark:text-white"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 18 18"
//               >
//                 <path
//                   stroke="currentColor"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="M9 1v16M1 9h16"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* price */}
//           <div className="text-end md:order-4 md:w-32">
//             <p className="text-base font-bold text-gray-900 dark:text-white">
//               ${cartItem.productPrice ?? "1,499"}
//             </p>
//           </div>
//         </div>

//         {/* item description */}
//         <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
//           <div>
//             <Link
//               href={`/products/${cartItem.productId}`}
//               className="text-base font-medium text-gray-900 hover:underline dark:text-white"
//             >
//               {cartItem.productName}
//             </Link>
//             <p className=" text-base font-normal text-gray-500 dark:text-gray-400">
//             {cartItem.sellerName}
//           </p>
//             <p> Size: {cartItem.selectedProductSize.name}</p>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* <button
//                 type="button"
//                 className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
//               >
//                 <svg
//                   className="me-1.5 h-5 w-5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
//                   />
//                 </svg>
//                 Add to Favorites
//               </button> */}

//             {/* TODO: onclick */}
//             <button
//               type="button"
//               className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
//             >
//               <svg
//                 className="me-1.5 h-5 w-5"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="M6 18 17.94 6M18 18 6.06 6"
//                 />
//               </svg>
//               Remove
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const [quantity, setQuantity] = useState(cartItem.totalQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    updateQuantity(
      cartItem.productId,
      cartItem.selectedProductSize.name,
      newQuantity
    );
  };

  const handleRemove = () => {
    removeFromCart(cartItem.productId, cartItem.selectedProductSize.name);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img
          src={cartItem.productImage}
          alt={cartItem.productName}
          className="w-20 h-20"
        />
        <div className="ml-4">
          <h4 className="text-lg font-semibold">{cartItem.productName}</h4>
          <p className="text-sm text-gray-500">
            Size: {cartItem.selectedProductSize.name}
          </p>
          <div className="flex items-center mt-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-2 py-1 text-lg font-bold bg-gray-200 rounded-md hover:bg-red-500 transition-all duration-200"
            >
              -
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 text-lg font-bold bg-gray-200 rounded-md  hover:bg-red-500 transition-all duration-200"
            >
              +
            </button>
          </div>
        </div>
      </div>
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

// export default CartItemCard;
