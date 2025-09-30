import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = ({ ...props }) => <SelectPrimitive.Root data-slot="select" {...props} />;

const SelectTrigger = ({ className, size = "default", children, ...props }) => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    data-size={size}
    className={cn(
      "border-input bg-transparent flex w-fit items-center justify-between gap-2 rounded-md px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 disabled:cursor-not-allowed data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({ className, children, position = "popper", ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      data-slot="select-content"
      position={position}
      className={cn(
        "bg-popover text-popover-foreground overflow-hidden rounded-md border shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({ className, children, ...props }) => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectValue = (props) => <SelectPrimitive.Value data-slot="select-value" {...props} />;

const SelectLabel = ({ className, ...props }) => (
  <SelectPrimitive.Label data-slot="select-label" className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)} {...props} />
);

const SelectSeparator = ({ className, ...props }) => (
  <SelectPrimitive.Separator data-slot="select-separator" className={cn("bg-border h-px my-1 -mx-1 pointer-events-none", className)} {...props} />
);

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectSeparator,
};
