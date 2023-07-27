import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/lib/utils";

type RegionSearchProps = {
  id?: string;
  value?: string;
  onSelect: (value: string) => void;
  allowAnyRegion?: boolean;
};

const RegionSearch: React.FC<RegionSearchProps> = ({
  value,
  id,
  onSelect,
  allowAnyRegion,
}) => {
  const [open, setOpen] = React.useState(false);

  const _regions = allowAnyRegion ? [ANY_REGION, ...regions] : regions;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild id={id}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full px-3 font-normal"
        >
          {value
            ? _regions.find((region) => region === value)
            : "Elige una provincia..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 ">
        <Command className="max-h-80">
          <CommandInput placeholder="Busca una provincia..." />
          <CommandEmpty>Provincia no encontrada</CommandEmpty>
          <CommandGroup className="overflow-auto">
            {_regions.map((region) => (
              <CommandItem
                key={region}
                onSelect={(currentValue) => {
                  const value = _regions.find(
                    (x) => x.toLowerCase() === currentValue
                  );
                  onSelect(value!);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === region ? "opacity-100" : "opacity-0"
                  )}
                />
                {region}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RegionSearch;

const ANY_REGION = "Toda España";

const regions = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Gerona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Islas Baleares",
  "Jaén",
  "La Coruña",
  "La Rioja",
  "Las Palmas",
  "León",
  "Lérida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Orense",
  "Palencia",
  "Pontevedra",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
];
