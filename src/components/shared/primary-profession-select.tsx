import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface Profession {
  id: number
  name: string
}

export default function PrimaryProfessionSelect({
  professions,
  value,
  onChange,
}: {
  professions: Profession[]
  value: string
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Primary Profession*</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value
              ? professions.find((p) => String(p.id) === value)?.name
              : "Select primary profession"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search professions..." />
            <CommandList>
              <CommandEmpty>No profession found.</CommandEmpty>
              <CommandGroup>
                {professions.map((p) => {
                  const idStr = String(p.id)
                  return (
                    <CommandItem
                      key={idStr}
                      onSelect={() => {
                        onChange(idStr)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === idStr ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {p.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
