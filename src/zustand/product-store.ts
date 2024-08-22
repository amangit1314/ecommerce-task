import { CartItem } from "@/types/cart-item";
import { Product } from "@/types/product";
import { ProductSize } from "@/types/product-size";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductState {
  loading: boolean;
  error: string;
  productDetails: Product | null;
  cart: CartItem[];
  selectedSize: ProductSize | null; 
}

type ProductActions = {
  fetchProductDetails: (productId: string) => Promise<void>;
  addToCart: (cartItem: CartItem) => void;
  removeFromCart: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  setSelectedSize: (size: ProductSize) => void; 
};

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set, get) => ({
      loading: true,
      error: "",
      productDetails: null,
      cart: [],
      selectedSize: null, 

      fetchProductDetails: async (productId: string) => {
        try {
          set({ loading: true });
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) {
            console.log(
              `Failed to fetch product details: ${response.statusText}`
            );
            set({
              loading: false,
              error: `Failed to fetch product details: ${response.statusText}`,
            });
            return;
          }

          const data = await response.json();
          const product: Product = data?.data!;

          set({
            error: "",
            loading: false,
            productDetails: product,
          });

          console.log("Product details:", product);
        } catch (error: any) {
          console.error(
            "Error fetching products in catch block:",
            error.message
          );
          set({
            loading: false,
            error: `Error fetching products, ${error.message!}`,
          });
        }
      },
      addToCart: (cartItem: CartItem) => {
        const state = get();
        const existingItem = state.cart.find(
          (item) => item.productId === cartItem.productId
        );

        if (existingItem) {
          const updatedCart = state.cart.map((item) =>
            item.productId === cartItem.productId
              ? {
                  ...item,
                  quantity: item.totalQuantity + cartItem.totalQuantity,
                }
              : item
          );
          set({ cart: updatedCart });
        } else {
          set({ cart: [...state.cart, cartItem] });
        }
      },
      removeFromCart: (productId: string) => {
        const state = get();
        const updatedCart = state.cart.filter(
          (item) => item.productId !== productId
        );
        set({ cart: updatedCart });
      },
      changeQuantity: (productId: string, quantity: number) => {
        const state = get();
        const updatedCart = state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ cart: updatedCart });
      },
      setSelectedSize: (size: ProductSize) => {
        set({ selectedSize: size }); 
      },
    }),
    {
      name: "ecommerce-task-product-store",
      getStorage: () => localStorage,
    }
  )
);
