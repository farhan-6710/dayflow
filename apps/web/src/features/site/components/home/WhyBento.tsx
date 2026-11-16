import type { ComponentType } from "react";

import { AccessTile } from "@/features/site/components/faux/bento/AccessTile";
import { ClientRequestTile } from "@/features/site/components/faux/bento/ClientRequestTile";
import { ThemeTile } from "@/features/site/components/faux/bento/ThemeTile";
import { WorkspaceTile } from "@/features/site/components/faux/bento/WorkspaceTile";
import { BlurInItem } from "@/features/site/components/motion/BlurIn";
import { WHY } from "@/features/site/constants/homeContent";
import { cn } from "@/shared/lib/utils";

/** Grid stagger in reading order. */
const TILE_STAGGER = 0.1;

/**
 * One picture per reason, in WHY order. Hero UI and a component on the first row, an object and a
 * diagram on the second, so no two neighbours are the same kind and window chrome appears once.
 */
const TILES: { picture: ComponentType; span: string; height: string }[] = [
  { picture: WorkspaceTile, span: "md:col-span-2", height: "h-72 sm:h-80" },
  { picture: ClientRequestTile, span: "", height: "h-60 sm:h-80" },
  { picture: ThemeTile, span: "", height: "h-48 sm:h-52" },
  { picture: AccessTile, span: "md:col-span-2", height: "h-48 sm:h-52" },
];

/** Why DayFlow as a bento: run-in copy on top of each tile, its faux picture below and cropped by the tile. */
export function WhyBento() {
  return (
    <ul className="mt-10 mb-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
      {WHY.items.map((item, index) => {
        const tile = TILES[index];
        if (!tile) return null;
        const Picture = tile.picture;
        return (
          <BlurInItem
            key={item.num}
            delay={0.1 + index * TILE_STAGGER}
            className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background", tile.span)}
          >
            <p className="m-0 max-w-md p-6 pb-5 text-lg leading-snug text-pretty">
              <span className="font-heading text-foreground">{item.title}.</span>{" "}
              <span className="text-muted-foreground">{item.text}</span>
            </p>
            <div className={cn("relative mt-auto", tile.height)}>
              <Picture />
            </div>
          </BlurInItem>
        );
      })}
    </ul>
  );
}
