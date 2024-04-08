"use client";

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
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import React from "react";

export interface ProductType {
  id: number;
  name: string;
  number_of_units?: number;
  co2_per_unit?: number;
}
export interface ProductCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  image?: React.ReactNode;
  numberOfUnits?: number;
  co2PerUnit?: number;
}
export default function ProductCard(props: ProductCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-[200px] w-full rounded-xl" />
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
                <SheetTitle>Product name: {props.title}</SheetTitle>
              </SheetHeader>
              <div style={{ height: "calc(100% - 68px)" }} className="pb-4">
                <ScrollArea className="h-full">
                  <Skeleton className="h-[300px] w-full rounded-xl my-8" />
                  <p>
                    Number of Units: <a>{props.numberOfUnits}</a>
                  </p>
                  <p>CO2 per Unit: {props.co2PerUnit}</p>
                </ScrollArea>
              </div>
              <SheetFooter>
                <div className="flex justify-between w-full">
                  <Button variant="destructive">
                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button className="bg-blue-500">
                    {" "}
                    <Pencil2Icon className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardFooter>
      )}
    </Card>
  );
}
