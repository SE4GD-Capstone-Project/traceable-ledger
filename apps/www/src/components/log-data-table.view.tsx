"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { LogType } from "@/components/types/log.api";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}
export const logDataTableColumns = (): ColumnDef<LogType>[] => {
    return [
        {
            accessorKey: "buyer_id",
            header: "Buyer name",
        },
        {
            id: "productURL",
            header: "Product URL",
            cell: ({ row }) => {
                let url =
                    row.original.buyer_url +
                    "/products/" +
                    row.original.product_id;

                return (
                    <a
                        href={url}
                        className={
                            "text-blue-400 underline flex items-center gap-1 w-fit"
                        }
                    >
                        {url} <ExternalLinkIcon />
                    </a>
                );
            },
        },
        {
            accessorKey: "amount",
            header: "Units bought",
        },
        {
            accessorKey: "date",
            header: "Date created",
            cell: ({ row }) => {
                return new Date(row.original.date).toDateString();
            },
        },
        {
            accessorKey: "log_hash",
            header: "Transaction log",
        },
    ];
};

export function LogDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<LogType, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <Table className="rounded-md border max-h-[40vh] overflow-y-scroll">
                <TableHeader className={"sticky top-0 bg-white"}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
