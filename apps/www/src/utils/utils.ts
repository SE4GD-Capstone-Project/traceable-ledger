export function urlHandler(path: string): string {
    if (process.env.NODE_ENV === "production" && !path.includes(":3000")) {
        return `${path}:8000`;
    }
    return "http://localhost:8000";
}

export function preferencesUrlHandler(): string {
    if (typeof window !== "undefined") {
        if (window.location.origin !== "http://0.0.0.0") {
            const origin = window.location.origin;
            return `${origin}/preferences-api`;
        }
        return "http://0.0.0.0:3000/api";
    } else return "http://0.0.0.0:3000/api";
}

export function getProductUrl(id: number): string | undefined {
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
