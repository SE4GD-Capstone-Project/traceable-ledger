export default function urlHandler(path: string): string {
  if (process.env.NODE_ENV === "production") {
    return `${path}:8000`;
  }
  return "http://localhost:8000";
}
