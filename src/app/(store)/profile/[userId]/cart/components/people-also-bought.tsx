import { Product } from "@/types/product";
import React, { useEffect } from "react";
import PeopleAlsoBoughtItemCard from "./people-also-bought-item-card";
import { useProductsStore } from "@/zustand/products-store";

const PeopleAlsoBought = () => {
  const { fetchProducts, products, loading, error } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="hidden xl:mt-8 xl:block">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
        People also bought
      </h3>

      <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
        {products.slice(0, 3).map((peopleAlsoBought: Product) => {
          return (
            <div key={peopleAlsoBought.id}>
              <PeopleAlsoBoughtItemCard product={peopleAlsoBought} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
