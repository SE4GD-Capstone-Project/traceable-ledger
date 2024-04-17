export default function urlHandler(path: string): string {
  if (path.includes("herokuapp")) {
    return path;
  }
  return "http://0.0.0.0:8000";
}
