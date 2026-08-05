"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { GEO_CITIES } from "@/lib/geo"
import { MODALIDAD_LABELS, JORNADA_LABELS } from "@/lib/job-posting-labels"

const MODALITIES = Object.values(MODALIDAD_LABELS)
const SCHEDULES = Object.values(JORNADA_LABELS)
const DEPARTMENTS = [...new Set(GEO_CITIES.map((c) => c.department))].sort()

export interface SalaryBucket {
  label: string
  min: number
  max: number
}

export interface DateBucket {
  label: string
  maxDays: number
}

export const SALARY_BUCKETS: SalaryBucket[] = [
  { label: "Menos de Q5,000", min: 0, max: 5000 },
  { label: "Q5,000 - Q10,000", min: 5000, max: 10000 },
  { label: "Q10,000 - Q15,000", min: 10000, max: 15000 },
  { label: "Más de Q15,000", min: 15000, max: Infinity },
]

export const DATE_BUCKETS: DateBucket[] = [
  { label: "Últimas 24 horas", maxDays: 1 },
  { label: "Última semana", maxDays: 7 },
  { label: "Último mes", maxDays: 30 },
]

interface JobFiltersProps {
  categoryNames: string[]
  companyNames: string[]
  categories: string[]
  onCategoriesChange: (value: string[]) => void
  modalities: string[]
  onModalitiesChange: (value: string[]) => void
  schedules: string[]
  onSchedulesChange: (value: string[]) => void
  departments: string[]
  onDepartmentsChange: (value: string[]) => void
  companies: string[]
  onCompaniesChange: (value: string[]) => void
  salaryBuckets: string[]
  onSalaryBucketsChange: (value: string[]) => void
  datePosted: string[]
  onDatePostedChange: (value: string[]) => void
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
  categoryNames,
  companyNames,
  categories,
  onCategoriesChange,
  modalities,
  onModalitiesChange,
  schedules,
  onSchedulesChange,
  departments,
  onDepartmentsChange,
  companies,
  onCompaniesChange,
  salaryBuckets,
  onSalaryBucketsChange,
  datePosted,
  onDatePostedChange,
  onClear,
  className,
}: JobFiltersProps) {
  const activeCount =
    categories.length +
    modalities.length +
    schedules.length +
    departments.length +
    companies.length +
    salaryBuckets.length +
    datePosted.length

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
              values={categoryNames}
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

        <AccordionItem value="departamento">
          <AccordionTrigger>Departamento</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={DEPARTMENTS}
              selected={departments}
              onChange={onDepartmentsChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="empresa">
          <AccordionTrigger>Empresa</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={companyNames}
              selected={companies}
              onChange={onCompaniesChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="salario">
          <AccordionTrigger>Salario</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={SALARY_BUCKETS.map((b) => b.label)}
              selected={salaryBuckets}
              onChange={onSalaryBucketsChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="fecha">
          <AccordionTrigger>Fecha de publicación</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={DATE_BUCKETS.map((b) => b.label)}
              selected={datePosted}
              onChange={onDatePostedChange}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export { JobFilters }
