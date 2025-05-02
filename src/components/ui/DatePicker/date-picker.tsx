"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "../index";
import { Button, Calendar } from "../index";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "aria-expanded:emerald-glow w-full justify-start rounded-[0.5em] bg-white text-left font-light text-gray-950 outline-slate-400 hover:text-gray-950 hover:outline-slate-400 active:outline-slate-400 aria-expanded:outline-emerald-500",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
          {date ? format(date, "P") : <span>Escolha a data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
