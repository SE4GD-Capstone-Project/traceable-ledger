"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    PreferenceContext,
    themes,
} from "@/components/preference-context.view";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckIcon, Pencil2Icon, Cross1Icon } from "@radix-ui/react-icons";
import { preferencesUrlHandler } from "@/utils/utils";

export default function Home() {
    const { companyName, setCompanyName, theme, setTheme } =
        React.useContext(PreferenceContext);

    console.log(companyName);
    const [tempCompanyName, setTempCompanyName] = React.useState(companyName);
    const [isInNameEditMode, setIsInNameEditMode] = React.useState(false);

    const handleThemeButtonClick = React.useCallback(
        async (theme: string) => {
            setTheme(theme);
            await fetch(preferencesUrlHandler(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyName: companyName,
                    theme: theme,
                }),
            });
        },
        [companyName, setTheme]
    );

    const handleCompanyNameChange = React.useCallback(async () => {
        setCompanyName(tempCompanyName);
        await fetch(preferencesUrlHandler(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                companyName: tempCompanyName,
                theme: theme,
            }),
        });
        setIsInNameEditMode(false);
    }, [tempCompanyName, theme, setCompanyName]);

    const handleCompanyNameUnchange = React.useCallback(() => {
        setTempCompanyName(companyName);
        setIsInNameEditMode(false);
    }, [companyName]);

    return (
        <div className={"m-auto"}>
            <div
                className={
                    "m-auto w-fit p-4 border-2 border-solid border-zinc-200 rounded-md flex flex-col gap-4 bg-white"
                }
            >
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="">
                        Company name
                    </Label>
                    {isInNameEditMode ? (
                        <>
                            <Input
                                id="name"
                                className="col-span-2"
                                placeholder="Your company's name"
                                onChange={(event) => {
                                    setTempCompanyName(event.target.value);
                                }}
                            />
                            <div className={"flex gap-2 items-center"}>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={handleCompanyNameUnchange}
                                >
                                    <Cross1Icon />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handleCompanyNameChange}
                                >
                                    <CheckIcon />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Label
                                className={
                                    companyName === ""
                                        ? "col-span-2 italic text-zinc-400"
                                        : "col-span-2 font-mono"
                                }
                            >
                                {companyName === "" ? "none" : companyName}
                            </Label>
                            <div className="flex justify-end">
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        setIsInNameEditMode(true);
                                    }}
                                >
                                    <Pencil2Icon />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <Label>Theme configuration</Label>
                    <div className={"flex gap-2 justify-evenly"}>
                        {themes.map((themeName, index) => (
                            <Button
                                key={index}
                                onClick={() =>
                                    handleThemeButtonClick(themeName)
                                }
                                className={`${theme !== themeName ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-300 hover:text-white" : ""}`}
                            >
                                {themeName}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
