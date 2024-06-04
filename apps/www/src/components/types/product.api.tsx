import React from "react";
import { MetricType } from "@/components/types/metric.api";

export interface ManufacturerType {
    name: string;
    mainURL: string;
    id?: number;
}

export interface ProductSustainabilityMetricInputType {
    metric_id?: string;
    value: number;
}
export interface ProductSustainabilityMetricType {
    name: string;
    description: string;
    unit: string;
    value: number;
}

export interface ProductType {
    id: string;
    slug: string;
    name: string;
    manufacturer: ManufacturerType;
    number_of_units: number;
    sustainability_metrics_input?: ProductSustainabilityMetricInputType[];
    sustainability_metrics?: ProductSustainabilityMetricType[];
    subparts?: SubpartType[];
}

export interface SubpartType extends ProductType {
    units_bought: number;
    quantity_needed_per_unit: number;
    productURL: string;
}

export interface MaterialFormValueType {
    quantity_needed_per_unit: number;
    productURL: string;
}

export interface ProductCardProps {
    id: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    image?: React.ReactNode;
    numberOfUnits?: number;
    sustainability_metrics?: ProductSustainabilityMetricType[];
    companyMetrics?: MetricType[];
    subparts?: SubpartType[];
}

export interface MaterialCardProps extends SubpartType {
    companyMetrics?: MetricType[];
    onCardDelete?: (itemId: string) => void;
    first?: boolean;
    last?: boolean;
    two?: boolean;
}
