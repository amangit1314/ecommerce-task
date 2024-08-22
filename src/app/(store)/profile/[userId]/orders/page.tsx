"use client";

import { Header } from "@/components/header";
import { OrderTable } from "@/components/order-table";
import { useUserStore } from "@/zustand/user-store";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

const OrdersPage = ({ params }: { params: { userId: string } }) => {
  const userId = params?.userId!;
  const { fetchUserOrders, orders, loading, error } = useUserStore();

  React.useEffect(() => {
    fetchUserOrders(userId);
  }, [userId, fetchUserOrders]);

  // if (loading) {
  //   toast.loading("User oders are loading ⏳ ...");
  // }

  if (error) {
    toast.error(`User orders error: ${error}`);
  }

  return (
    <div>
      <Toaster />

      <div className="space-y-6">
        <div className="px-8">
          <Header />
        </div>

        <div className="px-8">
          <OrderTable orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
