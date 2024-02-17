"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { dateFormatter } from "@/utils/date";
import es from "date-fns/locale/es";

type RangeDatePickerProps = {
  from?: Date;
  to?: Date;
  onSelect: (dateRange: DateRange | undefined) => void;
  fromDate?: Date;
};

export function RangeDatePicker({
  from,
  to,
  onSelect,
  fromDate,
}: RangeDatePickerProps) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !from && !to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>{dateFormatter.formatRange(from, to)}</>
              ) : (
                dateFormatter.format(from)
              )
            ) : (
              <span>Elige una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{ from, to }}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={es}
            fromDate={fromDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
