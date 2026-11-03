import { createRoot } from "react-dom/client";
import App from "./app/App";
import {
  BRAND_SEO_DESCRIPTION,
  BRAND_SEO_TITLE,
} from "./shared/brand/brandManifest";
import { startEntranceMotion } from "./shared/lib/entranceMotion";
import "./index.css";

document.title = BRAND_SEO_TITLE;
const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute("content", BRAND_SEO_DESCRIPTION);
}

startEntranceMotion();
createRoot(document.getElementById("root")!).render(<App />);
