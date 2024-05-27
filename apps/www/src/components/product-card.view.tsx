"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil2Icon, CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { getProductUrl, imagesUrlHandler } from "@/utils/utils";
import { ProductCardProps } from "./types/product.api";
import {
    MaterialDataTable,
    materialDataTableColumns,
} from "./material-data-table.view";

export default function ProductCard(props: ProductCardProps) {
    const [isCopyButtonClicked, setIsCopyButtonClicked] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState("");
    const handleCopyUrlButtonClick = React.useCallback(() => {
        setIsCopyButtonClicked(true);
        navigator.clipboard.writeText(getProductUrl(props.id) ?? "");
    }, [props.id]);

    React.useEffect(() => {
        console.log(imagesUrlHandler());
        const fetchData = async () => {
            const response = await fetch(imagesUrlHandler(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: String(props.title),
                }),
            });
            const data = await response.json();
            setImageUrl(data.imageUrl);
        };
        fetchData();
    }, [setImageUrl, props.title]);

    React.useEffect(() => {
        if (isCopyButtonClicked) {
            const interval = setInterval(() => {
                setIsCopyButtonClicked(false);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isCopyButtonClicked]);

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {imageUrl === "" || imageUrl === "null" ? (
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                ) : (
                    <img
                        alt="product-image"
                        src={imageUrl}
                        className="h-[200px] w-full rounded-xl"
                    />
                )}
                {typeof props.description == "string" ? (
                    <CardDescription>{props.description}</CardDescription>
                ) : (
                    props.description
                )}
            </CardContent>
            {typeof props.title == "string" && (
                <CardFooter className="flex justify-end">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button>More info</Button>
                        </SheetTrigger>
                        <SheetContent className="w-[800px] sm:w-[800px] sm:max-w-[800px]">
                            <SheetHeader>
                                <SheetTitle>
                                    Product name: {props.title}
                                </SheetTitle>
                            </SheetHeader>
                            <div
                                style={{ height: "calc(100% - 68px)" }}
                                className="pb-4"
                            >
                                <ScrollArea className="h-full">
                                    {imageUrl === "" || imageUrl === "null" ? (
                                        <Skeleton className="h-[300px] w-full rounded-xl my-8" />
                                    ) : (
                                        <img
                                            alt="product-image"
                                            src={imageUrl}
                                            className="h-[300px] w-full rounded-xl my-8"
                                        />
                                    )}
                                    <div className="flex items-center gap-4">
                                        <p>
                                            Product URL:{" "}
                                            <a>{getProductUrl(props.id)}</a>
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={
                                                isCopyButtonClicked
                                                    ? "bg-green-500 text-white hover:bg-green-700 hover:text-white"
                                                    : ""
                                            }
                                            onClick={handleCopyUrlButtonClick}
                                        >
                                            {isCopyButtonClicked ? (
                                                <CheckIcon />
                                            ) : (
                                                <CopyIcon />
                                            )}
                                        </Button>
                                    </div>
                                    <p>
                                        Number of Units:{" "}
                                        <a>{props.numberOfUnits}</a>
                                    </p>
                                    <p>CO2 per Unit: {props.co2PerUnit}</p>
                                    <MaterialDataTable
                                        columns={materialDataTableColumns()}
                                        data={props.subparts ?? []}
                                    />
                                </ScrollArea>
                            </div>
                            <SheetFooter>
                                <Button className="bg-blue-500">
                                    {" "}
                                    <Pencil2Icon className="mr-2 h-4 w-4" />{" "}
                                    Update
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </CardFooter>
            )}
        </Card>
    );
}
