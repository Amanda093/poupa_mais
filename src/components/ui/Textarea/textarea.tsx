import * as React from "react";

import { cn } from "@/lib/helpers/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus:invalid:rose-glow focus:emerald-glow text-light flex field-sizing-content w-full resize-none rounded-[0.5em] px-3 py-2 font-[400] outline-[0.15em] outline-slate-400 transition-all duration-300 outline-solid placeholder:text-slate-400 invalid:outline-rose-500 focus:outline-[0.175em] focus:outline-emerald-400 focus:invalid:outline-rose-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
