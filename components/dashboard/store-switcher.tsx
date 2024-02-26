"use client";
import {
  Check,
  ChevronsUpDown,
  PlusCircleIcon,
  Store as StoreIcon,
} from "lucide-react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useDialogModel } from "@/hooks/use-dialogModel";

type props = {
  className?: string;
  items: Store[];
};
const StoreSwitcher = ({ className, items = [] }: props) => {
  const params = useParams();
  const stores = items.map((store) => ({
    label: store.name,
    value: store.id,
  }));

  const storeModel = useDialogModel();

  const currentStore = stores.find((store) => store.value === params.storeId);

  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onStoreSelected = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select Store"
          className="w-[200px] justify-between"
        >
          <StoreIcon />
          {currentStore?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Store..." />
          <CommandEmpty>No Stores found.</CommandEmpty>
          <CommandGroup heading="stores">
            {stores.map((store) => (
              <CommandItem
                key={store.value}
                onSelect={() => onStoreSelected(store)}
              >
                <StoreIcon className="mr-2 h-4 w-4" />
                {store.label}
                <Check
                  className={cn(
                    "ml-auto h-5 w-5 shrink-0 mr-2",
                    currentStore?.value === store.value
                      ? "opacity-50"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModel.onOpen();
                }}
              >
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
