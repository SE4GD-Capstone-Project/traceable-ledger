"use client";

import ProductCard from "@/components/product-card.view";
import { urlHandler } from "@/utils/utils";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NewProductDialog from "@/components/new-product-dialog.view";
import { ProductType } from "@/components/types/product.api";
import { MetricType } from "@/components/types/metric.api";

export default function Products() {
    const [products, setProducts] = React.useState<ProductType[]>([
        {
            id: "1",
            slug: "abc",
            subparts: [],
            manufacturer: {
                id: 1,
                name: "Miningful Oyj",
                mainURL: "http://0.0.0.0",
            },
            name: "Steel",
            number_of_units: 100,
            sustainability_metrics: [
                {
                    name: "CO2",
                    value: 69,
                    description: "GHG Emission",
                    unit: "tons",
                },
            ],
        },
    ]);
    const [metricList, setMetricList] = React.useState<MetricType[]>([
        {
            metric_id: "1",
            name: "CO2",
            unit: "tons",
            description: "GHG Emission",
        },
    ]);

    const fetchData = React.useCallback(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            fetch(`${urlHandler(origin)}/api/products/`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) setProducts(data);
                });
            fetch(`${urlHandler(origin)}/api/sustainability-metrics/`)
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        if (Array.isArray(data)) setMetricList(data);
                    }
                });
        }
    }, [setProducts, setMetricList]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex gap-4 flex-col">
            <div className="w-full">
                <div className="flex justify-end pt-4">
                    <NewProductDialog onCreateProduct={fetchData} />
                </div>
            </div>
            <p className="text-xl font-bold dark:text-white">
                Current products
            </p>
            <div className="flex gap-8 flex-wrap">
                {!!products ? (
                    products.map((item, index) => {
                        return (
                            <ProductCard
                                key={index}
                                title={item.name}
                                description="to be described"
                                numberOfUnits={item.number_of_units}
                                sustainability_metrics={
                                    item.sustainability_metrics
                                }
                                companyMetrics={metricList}
                                id={item.slug}
                                subparts={item.subparts}
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
                        id={""}
                    />
                )}
            </div>
        </div>
    );
}
