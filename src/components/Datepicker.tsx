"use client";

import * as React from "react";

import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type DatePickerProps = {
  value: Date;
  onChange: (value: Date | undefined) => void;
  mode: "single" | "range";
};

export function DatePickerDemo({
  value,
  onChange,
}: //   mode = "single",
DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* <Calendar
          mode="range"
          selected={value}
          onSelect={(date) => date.}
          initialFocus
        /> */}
      </PopoverContent>
    </Popover>
  );
}
