"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/Calendar/calendar";
import { cn } from "@/lib/helpers/utils";

import { Button } from "../Button";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  className,
  name,
  id,
  disabled = false,
  placeholder = "Selecione uma data",
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (onChange) onChange(selected);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={id}
            name={name}
            disabled={disabled}
            variant="outline"
            className={cn(
              "aria-expanded:emerald-glow w-full justify-start rounded-[0.5em] bg-white !px-3 !py-[0.3em] text-left font-light text-gray-950 outline-slate-400 hover:outline-slate-400 active:outline-slate-400 aria-expanded:outline-emerald-500",
              date
                ? "hover:text-gray-950"
                : "text-slate-400 hover:text-slate-400",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 !text-slate-400" />
            {date ? (
              <span className="text-light">{format(date, "dd/MM/yyyy")}</span>
            ) : (
              <span className="text-light">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            className="bg-white"
            mode="single"
            selected={date}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
