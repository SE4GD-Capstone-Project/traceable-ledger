"use client";
import * as React from "react";
import { imagesUrlHandler, urlHandler } from "@/utils/utils";
import { ProductType } from "@/components/types/product.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    MaterialDataTable,
    materialDataTableColumns,
} from "@/components/material-data-table.view";

export default function Page({ params }: { params: { productId: string } }) {
    const [productInfo, setProductInfo] = React.useState<ProductType>({
        id: "1",
        subparts: [
            {
                id: "1",
                manufacturer: {
                    id: 2,
                    name: "Greenergy Oy",
                    mainURL: "",
                },
                name: "Green Electricity",
                co2_footprint: 2,
                quantity_needed_per_unit: 2,
                units_bought: 200,
                number_of_units: 300,
                productURL: "",
            },
        ],
        manufacturer: {
            id: 1,
            name: "Miningful Oyj",
            mainURL: "",
        },
        name: "Steel",
        number_of_units: 100,
        co2_footprint: 20,
    });
    const [imageUrl, setImageUrl] = React.useState("");
    const fetchData = React.useCallback(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            fetch(`${urlHandler(origin)}/api/products/${params.productId}/`)
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setProductInfo(data);
                        fetch(imagesUrlHandler(), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                productName: String(data.name),
                            }),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data) {
                                    setImageUrl(data.imageUrl);
                                }
                            });
                    }
                });
        }
    }, [setProductInfo]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (
        <>
            <p></p>
            <Card className="w-[50vw] min-w-[600px] m-auto">
                <CardHeader>
                    <CardTitle>{productInfo.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {imageUrl === "" || imageUrl === "null" ? (
                        <Skeleton className="h-[300px] w-full rounded-xl my-8" />
                    ) : (
                        <img
                            alt="product-image"
                            src={imageUrl}
                            className="h-[300px] w-full rounded-xl my-8 object-contain"
                        />
                    )}
                    <p className="mb-2">
                        <span className="font-semibold">Number of Units: </span>{" "}
                        <a>{productInfo.number_of_units}</a>
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">CO2 per Unit:</span>{" "}
                        {productInfo.co2_footprint}
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">Materials used:</span>
                    </p>
                    <MaterialDataTable
                        columns={materialDataTableColumns()}
                        data={productInfo.subparts ?? []}
                    />
                </CardContent>
            </Card>
        </>
    );
}
