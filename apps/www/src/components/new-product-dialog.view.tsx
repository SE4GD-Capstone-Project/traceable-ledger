"use client";

import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import urlHandler from "@/utils/utils";

export interface ProductType {
  name: string;
  number_of_units: number;
  co2_per_unit: number;
}

export interface SubcontractorMaterialType {
  //tbd
}

export default function NewProductDialog() {
  const [productInfo, setProductInfo] = React.useState<ProductType>({
    name: "",
    co2_per_unit: 0,
    number_of_units: 0,
  });

  const handleCreateButtonClick = React.useCallback(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      fetch(`${urlHandler(origin)}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productInfo),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }, [productInfo]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4 text-primary-foreground" /> New
            product...
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Create new product</DialogTitle>
            <DialogDescription>
              Add products information here. Click create when you are done.
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
                  setProductInfo({ ...productInfo, name: event.target.value });
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
                    number_of_units: parseInt(event.target.value),
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
                  console.log(productInfo);
                  setProductInfo({
                    ...productInfo,
                    co2_per_unit: parseInt(event.target.value),
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
              />
              <Input
                id="amount-from-contractor"
                placeholder="Amount of product from contractor. E.g: 20"
                className="col-span-3"
                type="number"
              />
              <Input
                id="co2-per-unit"
                placeholder="Product's API. E.g: https://example.api.com/products/1"
                className="col-span-3"
              />
              <Button className="col-span-1">Add material</Button>
            </div>
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Units used per product</TableHead>
                    <TableHead>CO2 per unit</TableHead>
                    <TableHead className="text-right">Total CO2 used</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/*{invoices.map((invoice) => (*/}
                  {/*    <TableRow key={invoice.invoice}>*/}
                  {/*      <TableCell className="font-medium">{invoice.invoice}</TableCell>*/}
                  {/*      <TableCell>{invoice.paymentStatus}</TableCell>*/}
                  {/*      <TableCell>{invoice.paymentMethod}</TableCell>*/}
                  {/*      <TableCell className="text-right">{invoice.totalAmount}</TableCell>*/}
                  {/*    </TableRow>*/}
                  {/*))}*/}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">0</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollArea>
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
