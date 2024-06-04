"use client";
import * as React from "react";
import { MaterialCardProps } from "@/components/types/product.api";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { imagesUrlHandler } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function MaterialCard(props: MaterialCardProps) {
    const [imageUrl, setImageUrl] = React.useState("");

    const materialUrl = React.useMemo((): string => {
        if (props.onCardDelete) {
            return props.productURL;
        }
        return props.manufacturer.mainURL + "/products/" + props.slug;
    }, [props]);

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(imagesUrlHandler(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: String(props.name),
                }),
            });
            const data = await response.json();
            setImageUrl(data.imageUrl);
        };
        fetchData();
    }, [setImageUrl, props.name]);

    return (
        <Card
            className={`flex-1 w-fit max-w-[380px] rounded-2xl border-2 border-primary/20 ${props.first && !props.last ? "rounded-r-lg border-r-0" : ""} ${!props.first && props.last ? "rounded-l-lg border-l-0" : ""} ${!props.first && !props.last ? "rounded-lg border-x-4" : ""}`}
            style={
                !props.first && !props.last
                    ? { borderRightStyle: "dashed", borderLeftStyle: "dashed" }
                    : props.two
                      ? props.first
                          ? {
                                borderRightStyle: "dashed",
                                borderRightWidth: "2px",
                            }
                          : undefined
                      : undefined
            }
        >
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                {imageUrl === "" || imageUrl === "null" ? (
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                ) : (
                    <img
                        alt="product-image"
                        src={imageUrl}
                        className="h-[80px] w-full rounded-xl object-contain"
                    />
                )}
                <div className="mt-4 flex flex-col flex-grow flex-wrap gap-1">
                    <p className="w-full">
                        <span className="font-semibold">Product URL:</span>{" "}
                        <a
                            href={materialUrl}
                            className={
                                "text-blue-400 underline text-ellipsis block w-full whitespace-nowrap overflow-hidden"
                            }
                        >
                            {materialUrl}
                        </a>
                    </p>
                    <p>
                        <span className="font-semibold">Manufacturer: </span>{" "}
                        <a>{props.manufacturer.name}</a>
                    </p>
                    <p>
                        <span className="font-semibold">
                            Units used per product:{" "}
                        </span>{" "}
                        <a>{props.quantity_needed_per_unit}</a>{" "}
                        <ArrowRightIcon className="inline" />{" "}
                        <span className="font-semibold">Total: </span>
                        {props.units_bought}
                    </p>
                    {props.sustainability_metrics?.map((metric, index) => {
                        return (
                            <p key={index}>
                                <span className="font-semibold">
                                    {metric.name} per Unit ({metric.unit}):
                                </span>{" "}
                                <a>{metric.value}</a>{" "}
                                <ArrowRightIcon className="inline" />{" "}
                                <span className="font-semibold">Total: </span>
                                {props.units_bought * metric.value}
                            </p>
                        );
                    })}
                </div>
            </CardContent>
            {props.onCardDelete && (
                <CardFooter>
                    <Button
                        className="w-full bg-rose-400 text-white"
                        onClick={() => props.onCardDelete?.(props.id)}
                    >
                        Remove
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
