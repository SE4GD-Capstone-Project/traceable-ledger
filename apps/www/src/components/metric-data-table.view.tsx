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
import { MetricType } from "@/components/types/metric.api";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export const metricDataTableColumns = (
    EditDialog?: (props: { metric: MetricType }) => React.JSX.Element,
    deleteDialog?: (metricId?: string) => React.JSX.Element
): ColumnDef<MetricType>[] => {
    return [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "unit",
            header: "Unit",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            header: "Actions",
            enablePinning: true,
            cell: ({ row }) => {
                return (
                    <div className="flex gap-4">
                        {EditDialog && <EditDialog metric={row.original} />}
                        {deleteDialog?.(row.original.metric_id)}
                    </div>
                );
            },
        },
    ];
};

export function MetricDataTable<TData, TValue>({
    data,
    columns,
}: DataTableProps<MetricType, TValue>) {
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
