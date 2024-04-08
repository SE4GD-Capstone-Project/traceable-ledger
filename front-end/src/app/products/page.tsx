"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import ProductCard from "@/components/product-card.view";

export default function Products() {
  return (
    <div className="flex gap-4 flex-col">
      <div className="w-full">
        <div className="flex justify-end pt-4">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4 text-primary-foreground" /> New
            product...
          </Button>
        </div>
      </div>
      <p className="text-xl font-bold dark:text-white">Current products</p>
      <div>
        <ProductCard
          title="Product 1"
          description="Something related to product described as simple text"
        />
      </div>
    </div>
  );
}
