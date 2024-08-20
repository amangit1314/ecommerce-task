import { Product } from "@/types/product";
import { Order, ProductSize, User } from "@prisma/client";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  loading: boolean;
  error: string;
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
};

type UserActions = {
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // fetchUser: () => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;
  placeOrder: (
    userId: string,
    product: Product,
    selectedProductSize: ProductSize,
    shippingAddress: string,
    mobileNumber: string,
    email: string,
    paymentMethod: string,
    totalPrice: number,
    totalQuantity: number
  ) => Promise<void>;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      loading: false,
      error: "",
      user: null,
      orders: [],
      isAuthenticated: false,
      // fetchUser: async () => {
      //   try {
      //     set({ loading: true });
      //     const response = await fetch("/api/auth/login", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({ email, password }),
      //     });

      //     if (!response.ok) {
      //       throw new Error(`Login failed: ${response.statusText}`);
      //     }

      //     const data = await response.json();
      //     set({
      //       loading: false,
      //       user: data.user,
      //       isAuthenticated: true,
      //       error: "",
      //     });
      //   } catch (error) {
      //     console.error("Login error:", error);
      //     set({
      //       loading: false,
      //       error: "Failed to login. Please check your credentials.",
      //       user: null,
      //       isAuthenticated: false,
      //     });
      //   }
      // },
      register: async (email: string, password: string) => {
        try {
          set({
            error: "",
            loading: true,
          });
          const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            set({
              error: "Failed to register ...",
              loading: false,
            });
          }

          const data = await response.json();
          set({
            error: "",
            user: data?.data! as User,
            loading: false,
          });
        } catch (error) {
          console.error("Error in registering user ...", error);
          set({
            error: "Failed to register user in catch block ...",
            loading: false,
          });
        }
      },
      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
          }

          const data = await response.json();
          set({
            loading: false,
            user: data?.data! as User,
            isAuthenticated: true,
            error: "",
          });
        } catch (error) {
          console.error("Login error:", error);
          set({
            loading: false,
            error: "Failed to login. Please check your credentials.",
            user: null,
            isAuthenticated: false,
          });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, orders: [] });
      },
      fetchUserOrders: async (userId: string) => {
        try {
          set({ loading: true });
          const response = await fetch("/api/orders/user/${userId}", {
            method: "GET",
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.statusText}`);
          }

          const data = await response.json();
          set({ loading: false, orders: data.orders, error: "" });
        } catch (error) {
          console.error("Fetch orders error:", error);
          set({ loading: false, error: "Failed to fetch orders.", orders: [] });
        }
      },
      placeOrder: async (
        userId: string,
        product: Product,
        selectedProductSize: ProductSize,
        shippingAddress: string,
        mobileNumber: string,
        email: string,
        paymentMethod: string,
        totalPrice: number,
        totalQuantity: number
      ) => {
        set({ loading: true });
      
        try {
          if (!get().user) {
            throw new Error("User is not authenticated.");
          }
      
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              shippingAddress,
              mobileNumber,
              email,
              paymentMethod,
              orderItems: [
                {
                  productName: product.productName,
                  productImage: product.productImageLink,
                  productPrice: product.productPrice,
                  productRating: product.productRating,
                  selectedSize: selectedProductSize,
                  totalPrice: totalPrice,
                  quantity: totalQuantity,
                  selectedProductSize: selectedProductSize, // Ensure this field matches schema
                },
              ],
              orderTotalPrice: totalPrice, // Send total price for the entire order
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to place order: ${response.statusText}`);
          }
      
          const data = await response.json();
      
          // Assuming data.order contains the newly created order
          set((state) => ({
            orders: [...state.orders, data.data], // Update this line based on actual response structure
          }));
      
          
        } catch (error) {
          console.error("Place single product order error:", error);
          set({ error: "Failed to place order", loading: false });
        } finally {
          set({ loading: false });
        }
      }
      
    }),
    {
      name: "ecommerce-task-user-store",
      getStorage: () => localStorage,
    }
  )
);
