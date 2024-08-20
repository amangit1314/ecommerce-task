import { ProductSize } from "./product-size";

export type Product = {
  id: string;
  productRating: number;
  productName: string;
  productDescription: string;
  productImageLink: string;
  productPrice: number;
  sellerName: string;
  sizes: ProductSize[];
};
