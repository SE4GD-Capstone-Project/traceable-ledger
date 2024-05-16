import React from "react";

export interface ProductType {
    id: string;
    name: string;
    number_of_units: number;
    co2_footprint: number;
}

export interface SubcontractorMaterialType extends ProductType {
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
}
