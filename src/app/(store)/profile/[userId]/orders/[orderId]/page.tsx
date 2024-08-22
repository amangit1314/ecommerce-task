"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Define the types for Order and OrderItem
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  selectedSize: string;
  totalPrice?: number;
  quantity: number;
  sellerName: string;
  selectedProductSize: string;
}

interface Order {
  id: string;
  userId?: string;
  shippingAddress: string;
  mobileNumber: string;
  email: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
  orderItems: OrderItem[];
}

const OrderPage = ({
  params,
}: {
  params: { userId: string; orderId: string };
}) => {
  const { userId, orderId } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();

        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center flex justify-center items-center align-middle text-yellow-500 font-medium">⏳ Loading...</div>;
  if (error) return <div className="text-center flex justify-center items-center align-middle text-red-500 font-medium">Error loading order: {error}</div>;
  if (!order) return <div className="text-center flex justify-center items-center align-middle text-blue-500 font-medium">No order found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="mb-4">
          <strong>Order ID:</strong> {order.id}
        </div>
        <div className="mb-4">
          <strong>Order Date:</strong>{" "}
          {new Date(order.createdAt || "").toLocaleDateString()}
        </div>
        <div className="mb-4">
          <strong>Shipping Address:</strong> {order.shippingAddress}
        </div>
        <div className="mb-4">
          <strong>Mobile Number:</strong> {order.mobileNumber}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {order.email}
        </div>
        <div className="mb-4">
          <strong>Payment Method:</strong> {order.paymentMethod}
        </div>
        <div className="mb-4">
          <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
        {order.orderItems.map((item: OrderItem) => (
          <div key={item.id} className="border-b py-4 flex items-center">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md">
            <Link href={`/products/${item.productId}`}>
          {/* <Image
            src={item.}
            alt={item.productName}
            height={80}
            width={80}
            className="w-16 h-16 object-cover rounded-md"
          /> */}
        </Link>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-600">
                Price: ${item.totalPrice?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Seller: {item.sellerName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Copy Order ID
        </button>
        <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 ml-4">
          Return to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
