import { createContext } from "react";

/** True inside a skeleton, where elements must hold still so phantom-ui can measure them. */
export const SkeletonContext = createContext(false);
