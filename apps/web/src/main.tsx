import { createRoot } from "react-dom/client";
import App from "./app/App";
import { startEntranceMotion } from "./shared/lib/entranceMotion";
import "./index.css";

startEntranceMotion();
createRoot(document.getElementById("root")!).render(<App />);
