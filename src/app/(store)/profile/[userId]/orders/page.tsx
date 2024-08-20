"use client";

import { Header } from "@/components/header";
import { OrderTable } from "@/components/order-table";
import React from "react";

const OrdersPage = ({ params }: { params: { userId: string } }) => {
  const userId = params?.userId!;

  return (
    <div className="space-y-6">
      <div className="px-8">
        <Header />
      </div>

      <div className="px-8">
        <OrderTable />
      </div>
    </div>
  );
};

export default OrdersPage;
