import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Feature, searchCity } from "../api/mapbox";
import React, { useState } from "react";
import { UseComboboxStateChange, useCombobox } from "downshift";

import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

interface Place {
  name: string;
  context: string[];
}

interface RegionSearchProps {
  onSelected: (value: Place) => void;
}

const RegionSearch: React.FC<RegionSearchProps> = ({ onSelected }) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const debouncedSearchTerm = useDebounce(searchTerm);

  const { data, isLoading } = useQuery(
    ["region-search", debouncedSearchTerm],
    () => searchCity(debouncedSearchTerm!),
    {
      enabled: debouncedSearchTerm !== null,
    }
  );

  const onSelectedItemChange = (feature: Feature) => {
    const selectedItem: Place = {
      context: feature.context?.map((x) => x.text) ?? [],
      name: feature.text ?? "",
    };

    onSelected(selectedItem);
  };

  //   const {
  //     getMenuProps,
  //     getItemProps,
  //     getInputProps,
  //     highlightedIndex,
  //     isOpen,
  //   } = useCombobox({
  //     items: data?.features ?? [],
  //     itemToString: (item) => item?.text ?? "",
  //     onInputValueChange: (e) => setSearchTerm(e.inputValue),
  //     onSelectedItemChange,
  //   });

  return (
    <Command>
      <CommandInput placeholder="Madrid" onValueChange={setSearchTerm} />
      <CommandList>
        {/* <CommandItem>Madrid</CommandItem>
        <CommandItem>asdasd</CommandItem> */}

        {data?.features.map((x) => (
          <CommandItem key={x.id} onSelect={() => onSelectedItemChange(x)}>
            {x.text}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default RegionSearch;
