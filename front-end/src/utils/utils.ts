export default function urlHandler(path: string): string {
  if (path.includes("herokuapp")) {
    return path;
  }
  return "http://127.0.0.1:8000";
}
