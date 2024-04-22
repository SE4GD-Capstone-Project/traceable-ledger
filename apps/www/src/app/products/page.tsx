"use client";

import ProductCard, { ProductType } from "@/components/product-card.view";
import urlHandler from "@/utils/utils";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NewProductDialog from "@/components/new-product-dialog.view";

export default function Products() {
  const [products, setProducts] = React.useState<ProductType[]>();
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      fetch(`${urlHandler(origin)}/api/products/`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        });
      const interval = setInterval(() => {
        fetch(`${urlHandler(origin)}/api/products/`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setProducts(data);
          });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex gap-4 flex-col">
      <div className="w-full">
        <div className="flex justify-end pt-4">
          <NewProductDialog />
        </div>
      </div>
      <p className="text-xl font-bold dark:text-white">Current products</p>
      <div className="flex gap-8">
        {!!products ? (
          products.map((item, index) => {
            return (
              <ProductCard
                key={index}
                title={item.name}
                description="tbd"
                numberOfUnits={item.number_of_units}
                co2PerUnit={item.co2_per_unit}
              />
            );
          })
        ) : (
          <ProductCard
            title={<Skeleton className="h-4 w-[250px]" />}
            description={
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
