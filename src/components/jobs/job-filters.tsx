"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { mockCategories } from "@/lib/mock/categories"
import type { JobModality, JobSchedule } from "@/lib/mock/jobs"

const MODALITIES: JobModality[] = ["Remoto", "Presencial", "Híbrido"]
const SCHEDULES: JobSchedule[] = ["Tiempo completo", "Medio tiempo", "Freelance"]

interface JobFiltersProps {
  categories: string[]
  onCategoriesChange: (value: string[]) => void
  modalities: string[]
  onModalitiesChange: (value: string[]) => void
  schedules: string[]
  onSchedulesChange: (value: string[]) => void
  onClear: () => void
  className?: string
}

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

function FilterGroup({
  values,
  selected,
  onChange,
}: {
  values: string[]
  selected: string[]
  onChange: (value: string[]) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {values.map((value) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
        >
          <Checkbox
            checked={selected.includes(value)}
            onCheckedChange={() => onChange(toggle(selected, value))}
          />
          {value}
        </label>
      ))}
    </div>
  )
}

function JobFilters({
  categories,
  onCategoriesChange,
  modalities,
  onModalitiesChange,
  schedules,
  onSchedulesChange,
  onClear,
  className,
}: JobFiltersProps) {
  const activeCount = categories.length + modalities.length + schedules.length

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filtros</h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpiar ({activeCount})
          </Button>
        )}
      </div>

      <Accordion defaultValue={["categoria", "modalidad", "jornada"]}>
        <AccordionItem value="categoria">
          <AccordionTrigger>Categoría</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={mockCategories.map((c) => c.name)}
              selected={categories}
              onChange={onCategoriesChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="modalidad">
          <AccordionTrigger>Modalidad</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={MODALITIES}
              selected={modalities}
              onChange={onModalitiesChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="jornada">
          <AccordionTrigger>Jornada</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={SCHEDULES}
              selected={schedules}
              onChange={onSchedulesChange}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export { JobFilters }
