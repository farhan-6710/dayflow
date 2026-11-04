import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Tabs as TabsPrimitive } from "radix-ui";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        /** Muted track with a raised active pill. */
        default: "rounded-lg bg-muted",
        /** Text tabs with an underline on the active item. */
        line: "gap-1 rounded-none bg-transparent p-0",
        /** Soft track with a filled primary active pill. */
        solid: "rounded-lg bg-muted/60",
      },
      size: {
        sm: "min-h-8 p-0.5",
        default: "min-h-9 p-1",
        lg: "min-h-10 p-1",
      },
    },
    compoundVariants: [
      { variant: "line", className: "min-h-0 p-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const tabsTriggerVariants = cva(
  [
    "relative inline-flex flex-1 items-center justify-center border border-transparent font-medium whitespace-nowrap transition-all",
    "text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
    "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-md",
          "data-[state=active]:bg-background data-[state=active]:text-foreground",
          "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        ],
        line: [
          "rounded-none bg-transparent",
          "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
          "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
          "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] group-data-[orientation=horizontal]/tabs:after:h-0.5",
          "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5",
          "data-[state=active]:after:opacity-100",
        ],
        solid: [
          "rounded-md",
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          "dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground",
        ],
      },
      size: {
        sm: "min-h-7 gap-1.5 px-2.5 py-1 text-xs",
        default: "min-h-7 gap-1.5 px-3 py-1.5 text-sm",
        lg: "min-h-8 gap-2 px-4 py-1.5 text-sm",
      },
    },
    compoundVariants: [
      { variant: "line", size: "sm", className: "min-h-8 px-2.5 py-1.5" },
      { variant: "line", size: "default", className: "min-h-9 px-3 py-2" },
      { variant: "line", size: "lg", className: "min-h-10 px-4 py-2" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>;
type TabsSize = NonNullable<VariantProps<typeof tabsListVariants>["size"]>;

const TabsVariantContext = React.createContext<{ variant: TabsVariant; size: TabsSize }>({
  variant: "default",
  size: "default",
});

function TabsList({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const resolvedVariant = variant ?? "default";
  const resolvedSize = size ?? "default";

  return (
    <TabsVariantContext.Provider value={{ variant: resolvedVariant, size: resolvedSize }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        className={cn(tabsListVariants({ variant: resolvedVariant, size: resolvedSize }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant, size } = React.useContext(TabsVariantContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };
