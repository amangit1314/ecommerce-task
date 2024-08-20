import React from "react";

const OrderPage = ({
  params,
}: {
  params: { userId: string; orderId: string };
}) => {
  const userId = params?.userId!;
  const orderId = params?.orderId!;

  return <div>OrderPage</div>;
};

export default OrderPage;
