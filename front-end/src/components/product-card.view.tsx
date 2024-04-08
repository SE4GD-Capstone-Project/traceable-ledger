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

export interface ProductCardProps {
  title: string;
  description?: string;
  image?: string;
}
export default function ProductCard(props: ProductCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <CardDescription>{props.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button>More info</Button>
          </SheetTrigger>
          <SheetContent className="w-[800px] sm:w-[800px] sm:max-w-[800px]">
            <SheetHeader>
              <SheetTitle>{props.title}</SheetTitle>
            </SheetHeader>
            <div style={{ height: "calc(100% - 68px)" }} className="pb-4">
              <ScrollArea className="h-full">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-[650px]" />
                    <Skeleton className="h-6 w-[600px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>{" "}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>{" "}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>{" "}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
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
    </Card>
  );
}
