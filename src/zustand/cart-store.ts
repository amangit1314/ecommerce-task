import { CartItem } from "@/types/cart-item";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  loading: boolean;
  error: string;
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
};

type CartActions = {
  fetchCartItems: () => void;
  addToCart: (newCartItem: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (
    userId: string,
    shippingAddress: string,
    mobileNumber: string,
    email: string,
    paymentMethod: string,
    cartItems: CartItem[],
    orderTotalPrice: number
  ) => void;
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      loading: true,
      error: "",
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      fetchCartItems: () => {},
      addToCart: (newCartItem: CartItem) => {
        const cartItems = [...get().cartItems];
        const cartTotalItems = get().totalItems;
        const cartTotalPrice = get().totalPrice;

        // Check if the item with the same productId and size already exists in the cart
        const existingItemIndex = cartItems.findIndex(
          (item) =>
            item.productId === newCartItem.productId &&
            item.selectedProductSize === newCartItem.selectedProductSize
        );

        if (existingItemIndex !== -1) {
          // Update quantity and total price for the existing item with the same size
          cartItems[existingItemIndex].totalQuantity +=
            newCartItem.totalQuantity;
          cartItems[existingItemIndex].totalPrice += newCartItem.totalPrice;
        } else {
          // Add the new item to the cart
          cartItems.push(newCartItem);
        }

        set({
          loading: false,
          cartItems: [...cartItems],
          totalItems: cartTotalItems + newCartItem.totalQuantity,
          totalPrice: cartTotalPrice + newCartItem.totalPrice,
        });
      },

      // addToCart: (newCartItem: CartItem) => {
      //   set((state) => {
      //     console.log("Current cart items:", state.cartItems);
      //     const cartItems = [...state.cartItems];
      //     const existingItemIndex = cartItems.findIndex(
      //       (item) =>
      //         item.productId === newCartItem.productId &&
      //         item.selectedProductSize === newCartItem.selectedProductSize
      //     );

      //     if (existingItemIndex !== -1) {
      //       const existingItem = cartItems[existingItemIndex];
      //       existingItem.totalQuantity += newCartItem.totalQuantity;
      //       existingItem.totalPrice += newCartItem.totalPrice;
      //       cartItems[existingItemIndex] = { ...existingItem };
      //       console.log("Updated item:", cartItems[existingItemIndex]);
      //     } else {
      //       cartItems.push(newCartItem);
      //     }

      //     const newTotalItems = cartItems.reduce(
      //       (acc, item) => acc + item.totalQuantity,
      //       0
      //     );
      //     const newTotalPrice = cartItems.reduce(
      //       (acc, item) => acc + item.totalPrice,
      //       0
      //     );

      //     return {
      //       loading: false,
      //       cartItems,
      //       totalItems: newTotalItems,
      //       totalPrice: newTotalPrice,
      //     };
      //   });
      // },

      removeFromCart: (productId: string, size: string) => {
        set((state) => {
          const itemToRemove = state.cartItems.find(
            (item) =>
              item.productId === productId &&
              item.selectedProductSize.name === size
          );
          if (!itemToRemove) return state;

          const updatedCartItems = state.cartItems.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.selectedProductSize.name === size
              )
          );

          return {
            loading: false,
            cartItems: updatedCartItems,
            totalItems: state.totalItems - itemToRemove.totalQuantity,
            totalPrice: state.totalPrice - itemToRemove.totalPrice,
          };
        });
      },
      updateQuantity: (productId: string, size: string, quantity: number) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          (item) =>
            item.productId === productId &&
            item.selectedProductSize.name === size
        );

        if (!existingItem) {
          set({
            loading: false,
            error: "No such item exists in the cart...",
          });
          return;
        }

        if (quantity <= 0) {
          set((state) => ({
            loading: false,
            cartItems: state.cartItems.filter(
              (item) =>
                !(
                  item.productId === productId &&
                  item.selectedProductSize.name === size
                )
            ),
            totalItems: state.totalItems - existingItem!.totalQuantity,
            totalPrice: state.totalPrice - existingItem!.totalPrice,
          }));
        } else {
          const updatedCartItems = cartItems.map((item) =>
            item.productId === productId &&
            item.selectedProductSize.name === size
              ? {
                  ...item,
                  quantity,
                  totalPrice: item.productPrice * quantity,
                }
              : item
          );

          const updatedTotalPrice = updatedCartItems.reduce(
            (acc, item) => acc + item.totalPrice,
            0
          );

          set({
            loading: false,
            cartItems: [...updatedCartItems],
            totalPrice: updatedTotalPrice,
          });
        }
      },
      clearCart: () =>
        set({ loading: false, cartItems: [], totalItems: 0, totalPrice: 0 }),
      placeOrder: async (
        userId: string,
        shippingAddress: string,
        mobileNumber: string,
        email: string,
        paymentMethod: string,
        cartItems: CartItem[],
        orderTotalPrice: number
      ) => {
        set({ loading: true });

        try {
          const { cartItems, totalPrice } = get();

          if (cartItems.length === 0) {
            throw new Error("Cart is empty.");
          }

          const response = await fetch("api/profile/orders/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              shippingAddress,
              mobileNumber,
              email,
              paymentMethod,
              cartItems,
              orderTotalPrice,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to place order: ${response.statusText}`);
          }

          const data = await response.json();

          set({
            cartItems: [],
            totalItems: 0,
            totalPrice: 0,
          });

          // Optionally update global order state if necessary
          // useUserStore.getState().placeOrder(data.order);
        } catch (error) {
          console.error("Place order error:", error);
          set({ error: "Failed to place order", loading: false });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "ecommerce-task-cart-store",
      getStorage: () => localStorage,
    }
  )
);
