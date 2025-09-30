import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-yellow-300 selection:bg-yellow-400 selection:text-[#0b1d3a] border-[#10294d] h-9 w-full min-w-0 rounded-md bg-[#0b1d3a] px-3 py-1 text-base text-yellow-400 shadow-sm outline-none transition-colors focus-visible:border-yellow-400 focus-visible:ring-yellow-400/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-red-500 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
