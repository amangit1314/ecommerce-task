import React from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";

type ProductSize = {
  name: string;
  availableQuantity: number;
  inStock: boolean;
};

type Product = {
  id: string;
  productRating: number;
  productName: string;
  productDescription: string;
  productImageLink: string;
  productPrice: number;
  sellerName: string;
  sizes: ProductSize[];
};

const ProductAverageStarRatings = ({ product }: { product: Product }) => {
  return (
    <div className="">
      <h3 className="sr-only">Reviews</h3>

      {/* reviews */}
      <div className="flex items-center">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <StarIcon
              key={rating}
              className={cn(
                product.productRating > rating
                  ? "text-yellow-500"
                  : "text-gray-200",
                "h-5 w-5 flex-shrink-0"
              )}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* out of 5 stars text */}
        <p className="ml-2 dark:text-gray-300">
          {product.productRating} out of 5 stars
        </p>
      </div>
    </div>
  );
};
export default ProductAverageStarRatings;
