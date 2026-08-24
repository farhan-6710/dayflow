import { createPath, type To } from "react-router";

export function routePath(to: To): string {
  const path = typeof to === "string" ? to : createPath(to);
  return path.split("?")[0] ?? path;
}
