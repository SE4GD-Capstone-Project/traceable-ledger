import React from "react";

export interface ManufacturerType {
    name: string;
    mainURL: string;
    id?: number;
}

export interface ProductType {
    id: string;
    name: string;
    manufacturer: ManufacturerType;
    number_of_units: number;
    co2_footprint: number;
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
    id: number;
    title: React.ReactNode;
    description?: React.ReactNode;
    image?: React.ReactNode;
    numberOfUnits?: number;
    co2PerUnit?: number;
    subparts?: SubpartType[];
}
