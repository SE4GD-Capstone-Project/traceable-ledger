export default function urlHandler(path: string): string {
  if (process.env.NODE_ENV === "production" && !path.includes(":3000")) {
    return `${path}:8000`;
  }
  return "http://localhost:8000";
}
