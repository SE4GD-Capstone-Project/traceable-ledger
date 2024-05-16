"use client";

import React from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { urlHandler } from "@/utils/utils";
import { PreferenceContext } from "@/components/preference-context.view";
import {
    MaterialFormValueType,
    ProductType,
    SubcontractorMaterialType,
} from "@/components/types/product.api";
import {
    MaterialDataTable,
    materialDataTableColumns,
} from "@/components/material-data-table.view";

export default function NewProductDialog() {
    const { theme } = React.useContext(PreferenceContext);
    const [productInfo, setProductInfo] = React.useState<ProductType>({
        id: "",
        name: "",
        co2_footprint: 0,
        number_of_units: 0,
    });
    const [showDialog, setShowDialog] = React.useState(false);
    const [materialList, setMaterialList] = React.useState<
        SubcontractorMaterialType[]
    >([]);
    const [materialFormValues, setMaterialFormValues] =
        React.useState<MaterialFormValueType>({
            productURL: "",
            unitsUsedPerProduct: 0,
        });

    const handleCreateButtonClick = React.useCallback(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            fetch(`${urlHandler(origin)}/api/products/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: productInfo.name,
                    co2_footprint: productInfo.co2_footprint,
                    number_of_units: productInfo.number_of_units,
                    subparts: materialList
                        ? materialList.map((material) => {
                              return {
                                  name: material.name,
                                  co2_footprint: material.co2_footprint,
                                  quantity_needed_per_unit:
                                      material.unitsUsedPerProduct,
                                  units_bought: material.unitsToBuy,
                              };
                          })
                        : [],
                }),
            })
                .then((response) => response.json())
                .then(() => {
                    materialList?.forEach((material) => {
                        fetch(material.productURL, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                //should have modifier info to save to logs
                                number_of_units:
                                    material.number_of_units -
                                    material.unitsToBuy,
                            }),
                        });
                    });
                })
                .then(() => setShowDialog(false))
                .then(() => {
                    const currentDateTime = new Date().toLocaleString("en-US", {
                        weekday: "long", // "Monday" to "Sunday"
                        year: "numeric", // "2023"
                        month: "long", // "January" to "December"
                        day: "numeric", // "1" to "31"
                        hour: "numeric", // "1" to "12" AM/PM
                        minute: "numeric", // "00" to "59"
                        hour12: true, // Use 12-hour format
                    });
                    toast("Product has been created successfully.", {
                        description: currentDateTime,
                    });
                });
        }
    }, [productInfo, materialList]);

    const handleAddMaterialButtonClick = React.useCallback(() => {
        if (materialFormValues.productURL !== "") {
            fetch(materialFormValues.productURL + "/", {
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data: ProductType) => {
                    if (data) {
                        if (materialList) {
                            setMaterialList([
                                ...materialList,
                                {
                                    ...data,
                                    unitsUsedPerProduct:
                                        materialFormValues.unitsUsedPerProduct,
                                    unitsToBuy:
                                        materialFormValues.unitsUsedPerProduct *
                                        productInfo.number_of_units,
                                    productURL: materialFormValues.productURL,
                                },
                            ]);
                        } else {
                            setMaterialList([
                                {
                                    ...data,
                                    unitsUsedPerProduct:
                                        materialFormValues.unitsUsedPerProduct,
                                    unitsToBuy:
                                        materialFormValues.unitsUsedPerProduct *
                                        productInfo.number_of_units,
                                    productURL: materialFormValues.productURL,
                                },
                            ]);
                        }
                    }
                })
                .then(() =>
                    setMaterialFormValues({
                        productURL: "",
                        unitsUsedPerProduct: 0,
                    })
                );
        }
    }, [materialList, productInfo, materialFormValues]);

    const handleOnRowActionDelete = React.useCallback(
        (id: string) => {
            if (confirm("Do you want to remove this material?")) {
                const index = materialList.findIndex((item) => item.id === id);
                if (index > -1) {
                    setMaterialList(materialList.toSpliced(index, 1));
                }
            }
        },
        [materialList, setMaterialList]
    );

    return (
        <>
            <Dialog
                open={showDialog}
                onOpenChange={(open: boolean) => {
                    setShowDialog(open);
                    setMaterialList([]);
                    setProductInfo({
                        id: "",
                        name: "",
                        co2_footprint: 0,
                        number_of_units: 0,
                    });
                    setMaterialFormValues({
                        productURL: "",
                        unitsUsedPerProduct: 0,
                    });
                }}
            >
                <DialogTrigger asChild>
                    <Button onClick={() => setShowDialog(true)}>
                        <PlusIcon className="mr-2 h-4 w-4 text-primary-foreground" />{" "}
                        New product...
                    </Button>
                </DialogTrigger>
                <DialogContent className={`theme-${theme}`}>
                    <DialogHeader>
                        <DialogTitle>Create new product</DialogTitle>
                        <DialogDescription>
                            Add products information here. Click create when you
                            are done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-8 items-center gap-4">
                            <Label htmlFor="name" className="">
                                Name
                            </Label>
                            <Input
                                id="name"
                                className="col-span-7"
                                placeholder="Example: Steel"
                                onChange={(event) => {
                                    setProductInfo({
                                        ...productInfo,
                                        name: event.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-8 items-center gap-4">
                            <Label htmlFor="number-of-units" className="">
                                Number of units
                            </Label>
                            <Input
                                id="number-of-units"
                                placeholder="Example: 20"
                                className="col-span-7"
                                type="number"
                                onChange={(event) => {
                                    console.log(productInfo);
                                    setProductInfo({
                                        ...productInfo,
                                        number_of_units: parseInt(
                                            event.target.value
                                        ),
                                    });
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-8 items-center gap-4">
                            <Label htmlFor="co2-per-unit" className="">
                                Amount of CO2 per unit
                            </Label>
                            <Input
                                id="co2-per-unit"
                                placeholder="Example: 20"
                                className="col-span-7"
                                type="number"
                                onChange={(event) => {
                                    setProductInfo({
                                        ...productInfo,
                                        co2_footprint: parseInt(
                                            event.target.value
                                        ),
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="co2-per-unit" className="">
                                Materials used
                            </Label>
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4">
                            <Input
                                id="units-per-product"
                                placeholder="Units used per product. E.g: 20"
                                className="col-span-3"
                                type="number"
                                onChange={(event) => {
                                    setMaterialFormValues({
                                        ...materialFormValues,
                                        unitsUsedPerProduct: parseInt(
                                            event.target.value
                                        ),
                                    });
                                }}
                                value={
                                    materialFormValues.unitsUsedPerProduct === 0
                                        ? ""
                                        : materialFormValues.unitsUsedPerProduct
                                }
                            />
                            <Input
                                id="co2-per-unit"
                                placeholder="Product's API. E.g: https://example.api.com/products/1"
                                className="col-span-3"
                                onChange={(event) => {
                                    setMaterialFormValues({
                                        ...materialFormValues,
                                        productURL: event.target.value,
                                    });
                                }}
                                value={materialFormValues.productURL}
                            />
                            <Button
                                className="col-span-1"
                                onClick={handleAddMaterialButtonClick}
                            >
                                Add material
                            </Button>
                        </div>
                        <MaterialDataTable
                            columns={materialDataTableColumns(
                                handleOnRowActionDelete
                            )}
                            data={materialList}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleCreateButtonClick}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
