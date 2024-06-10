export function urlHandler(path: string): string {
    if (process.env.NODE_ENV === "production" && !path.includes(":3000")) {
        return `${path}:8000`;
    }
    return "http://localhost:8000";
}

export function preferencesUrlHandler(): string {
    if (
        typeof window !== "undefined" &&
        window.location.origin !== "http://localhost:3000"
    ) {
        const origin = window.location.origin;
        return `${origin}/preferences-api`;
    }
    return "http://localhost:3000/api";
}

export function imagesUrlHandler(): string {
    if (
        typeof window !== "undefined" &&
        window.location.origin !== "http://localhost:3000"
    ) {
        const origin = window.location.origin;
        return `${origin}/product-image-api`;
    }
    return "http://localhost:3000/api";
}

export function getProductUrl(id: number | string): string | undefined {
    if (typeof window !== "undefined") {
        const origin = window.location.origin;
        if (
            process.env.NODE_ENV === "production" &&
            !origin.includes(":3000")
        ) {
            return `${origin}:8000/api/products/${id}`;
        }
        return `http://localhost:8000/api/products/${id}`;
    }
}
