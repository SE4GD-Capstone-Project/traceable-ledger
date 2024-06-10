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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { MetricType } from "@/components/types/metric.api";
import { urlHandler } from "@/utils/utils";
import { toast } from "sonner";
import {
    MetricDataTable,
    metricDataTableColumns,
} from "@/components/metric-data-table.view";

export default function MetricsPage() {
    const [newMetricInfo, setNewMetricInfo] = React.useState<MetricType>({
        name: "",
        unit: "",
        description: "",
    });
    const [metricList, setMetricList] = React.useState<MetricType[]>([]);

    const handleClearMetricButtonClick = React.useCallback(() => {
        setNewMetricInfo({ name: "", unit: "", description: "" });
    }, [setNewMetricInfo]);

    const fetchData = React.useCallback(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            fetch(`${urlHandler(origin)}/api/sustainability-metrics/`)
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setMetricList(data);
                    }
                });
        }
    }, [setMetricList]);

    const handleAddMetricButtonClick = React.useCallback(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            fetch(`${urlHandler(origin)}/api/sustainability-metrics/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newMetricInfo.name,
                    unit: newMetricInfo.unit,
                    description: newMetricInfo.description,
                }),
            }).then(() => {
                handleClearMetricButtonClick();
                const currentDateTime = new Date().toLocaleString("en-US", {
                    weekday: "long", // "Monday" to "Sunday"
                    year: "numeric", // "2023"
                    month: "long", // "January" to "December"
                    day: "numeric", // "1" to "31"
                    hour: "numeric", // "1" to "12" AM/PM
                    minute: "numeric", // "00" to "59"
                    hour12: true, // Use 12-hour format
                });
                toast("Metric has been created successfully.", {
                    description: currentDateTime,
                });
                fetchData();
            });
        }
    }, [newMetricInfo, handleClearMetricButtonClick, fetchData]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex gap-8 flex-wrap w-[80vw] m-auto">
            <Card className="flex-shrink h-fit">
                <CardHeader>
                    <CardTitle>Create new metric</CardTitle>
                    <CardDescription>
                        Creates a sustainability metric that your company
                        provides via your products
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="">
                            <Label htmlFor="name" className="">
                                Name <span className={"text-red-500"}>*</span>
                            </Label>
                            <Input
                                id="name"
                                className=""
                                placeholder="Example: CO2"
                                onChange={(event) => {
                                    setNewMetricInfo({
                                        ...newMetricInfo,
                                        name: event.target.value,
                                    });
                                }}
                                value={newMetricInfo.name}
                                required
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="unit" className="">
                                Unit <span className={"text-red-500"}>*</span>
                            </Label>
                            <Input
                                id="unit"
                                placeholder="Example: tons"
                                className=""
                                onChange={(event) => {
                                    setNewMetricInfo({
                                        ...newMetricInfo,
                                        unit: event.target.value,
                                    });
                                }}
                                value={newMetricInfo.unit}
                                required
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="description" className="">
                                Description{" "}
                                <span className={"text-red-500"}>*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Example: GHG Emissions equivalent"
                                className="resize-none"
                                onChange={(event) => {
                                    setNewMetricInfo({
                                        ...newMetricInfo,
                                        description: event.target.value,
                                    });
                                }}
                                value={newMetricInfo.description}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4 justify-end">
                    <Button
                        variant={"ghost"}
                        onClick={handleClearMetricButtonClick}
                    >
                        Cancel
                    </Button>
                    {newMetricInfo.name !== "" &&
                    newMetricInfo.unit !== "" &&
                    newMetricInfo.description !== "" ? (
                        <Button
                            className="col-span-1"
                            onClick={handleAddMetricButtonClick}
                        >
                            Add metric
                        </Button>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        className="col-span-1"
                                        disabled={true}
                                    >
                                        Add metric
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Please fill in all required fields!
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </CardFooter>
            </Card>
            <Card className="flex-1 h-fit">
                <CardHeader>
                    <CardTitle>Sustainability Metrics</CardTitle>
                    <CardDescription>
                        A definition list of sustainability metrics that your
                        company provides
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MetricDataTable
                        data={metricList}
                        columns={metricDataTableColumns()}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
