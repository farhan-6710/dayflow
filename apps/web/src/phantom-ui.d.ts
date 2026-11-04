import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";
import type { Ref } from "react";

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes & { className?: string; ref?: Ref<HTMLElement> };
    }
  }
}
