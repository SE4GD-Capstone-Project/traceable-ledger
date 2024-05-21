import React from "react";

export interface ManufacturerType {
    name: string;
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
    unitsToBuy: number;
    unitsUsedPerProduct: number;
    productURL: string;
}

export interface MaterialFormValueType {
    unitsUsedPerProduct: number;
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
