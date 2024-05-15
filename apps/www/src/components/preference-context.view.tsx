"use client";
import * as React from "react";
import { Dispatch } from "react";
import { preferencesUrlHandler } from "@/utils/utils";

export const themes = ["zinc", "rose", "blue", "green", "orange"];
export interface PreferenceContextType {
    companyName: string;
    theme: string;
    setCompanyName: Dispatch<React.SetStateAction<string>>;
    setTheme: Dispatch<React.SetStateAction<string>>;
}
export const PreferenceContext = React.createContext<PreferenceContextType>({
    companyName: "",
    theme: "zinc",
    setTheme: () => {},
    setCompanyName: () => {},
});

type Props = {
    children?: React.ReactNode;
};
export const PreferenceProvider: React.FC<Props> = (props) => {
    const [theme, setTheme] = React.useState<string>("zinc");
    const [companyName, setCompanyName] = React.useState<string>("");

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(preferencesUrlHandler());
            const data = await response.json();
            if (data.theme !== "") {
                setTheme(data.theme);
            }
            setCompanyName(data.companyName);
        };
        fetchData();
    }, []);

    return (
        <PreferenceContext.Provider
            value={{ theme, setTheme, companyName, setCompanyName }}
        >
            <div className={`theme-${theme} bg-primary/20`}>
                {props.children}
            </div>
        </PreferenceContext.Provider>
    );
};
