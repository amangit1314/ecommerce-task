import { ProductSize } from "./product-size";

export type CartItem = {
  cartItemId: string;
  userId: string;
  productId: string;
  productName: string;
  sellerName: string;
  productPrice: number;
  productImage: string;
  totalQuantity: number;
  totalPrice: number;
  selectedProductSize: ProductSize;
};
