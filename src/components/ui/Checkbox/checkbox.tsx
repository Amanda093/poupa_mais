"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "data-[state=checked]:emerald-glow size-[1.2em] shrink-0 cursor-pointer rounded-[0.2em] border-[0.12em] border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-500",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-[1.2em]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
