import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-yellow-400 bg-gradient-to-r from-[#0b1d3a] to-[#10294d] text-yellow-400 hover:from-[#10294d] hover:to-[#0b1d3a]",
        secondary:
          "border-white bg-white/10 text-white hover:bg-white/20",
        destructive:
          "border-red-600 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        outline:
          "border-yellow-400 text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-[#0b1d3a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
