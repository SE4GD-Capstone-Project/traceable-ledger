"use client";

import * as React from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { PreferenceContext } from "@/components/preference-context.view";
import { usePathname } from "next/navigation";

export default function Header() {
    const { companyName } = React.useContext(PreferenceContext);
    const pathname = usePathname();

    const HeaderItems = React.useCallback(() => {
        if (pathname.includes("/products/")) {
            return (
                <span className={"text-xl font-semibold"}>
                    Traceable Ledger Product Data
                </span>
            );
        }
        return (
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/preferences" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Preferences
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        );
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center gap-4">
                {companyName && (
                    <a className="font-mono font-semibold text-white bg-primary px-2 rounded-md">
                        {companyName}
                    </a>
                )}
                <HeaderItems />
            </div>
        </header>
    );
}
