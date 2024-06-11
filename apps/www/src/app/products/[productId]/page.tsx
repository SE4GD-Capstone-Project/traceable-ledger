"use client";
import * as React from "react";
import { imagesUrlHandler, urlHandler } from "@/utils/utils";
import { ProductType } from "@/components/types/product.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MaterialCard from "@/components/material-card.view";

export default function Page({ params }: { params: { productId: string } }) {
    const [productInfo, setProductInfo] = React.useState<ProductType>({
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
    }, [setProductInfo, params.productId]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (
        <>
            <Card className="w-[80vw] min-w-[600px] m-auto">
                <CardHeader>
                    <CardTitle>{productInfo.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
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
                            <span className="font-semibold">
                                Number of Units:{" "}
                            </span>{" "}
                            <a>{productInfo.number_of_units}</a>
                        </p>
                        {productInfo.sustainability_metrics?.map(
                            (metric, index) => {
                                return (
                                    <p className="mb-2" key={index}>
                                        <span className="font-semibold">
                                            {metric.name} per Unit (
                                            {metric.unit}
                                            ):
                                        </span>{" "}
                                        <a>{metric.value}</a>
                                    </p>
                                );
                            }
                        )}
                        <p className="mb-2">
                            <span className="font-semibold">
                                Materials used:{" "}
                            </span>
                            {!productInfo.subparts ||
                                (productInfo.subparts.length === 0 && (
                                    <span className="italic text-zinc-400">
                                        -No material used-
                                    </span>
                                ))}
                        </p>
                        {productInfo.subparts &&
                            productInfo.subparts.length > 0 && (
                                <div className="relative h-[380px]">
                                    <div className="flex absolute w-full overflow-x-auto">
                                        {productInfo.subparts.map(
                                            (material, index) => (
                                                <MaterialCard
                                                    key={index}
                                                    {...material}
                                                    first={index === 0}
                                                    last={
                                                        productInfo.subparts &&
                                                        index ===
                                                            productInfo.subparts
                                                                .length -
                                                                1
                                                    }
                                                    two={
                                                        productInfo.subparts
                                                            ?.length === 2
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
