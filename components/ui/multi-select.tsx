"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({ options, selected, onChange, className, ...props }: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((value) => {
            const label = options.find((option) => option.value === value)?.label || value;
            return (
              <Badge key={value} variant="secondary">
                {label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => { if (e.key === "Enter") handleUnselect(value) }}
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onClick={() => handleUnselect(value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            placeholder={props.placeholder || "Selecione..."}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && options.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                    onSelect={() => {
                      if (isSelected) {
                        handleUnselect(option.value)
                      } else {
                        onChange([...selected, option.value])
                      }
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}