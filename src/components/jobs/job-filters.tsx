"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { COUNTRIES, GEO_CITIES } from "@/lib/geo"
import { MODALIDAD_LABELS, JORNADA_LABELS } from "@/lib/job-posting-labels"

const MODALITIES = Object.values(MODALIDAD_LABELS)
const SCHEDULES = Object.values(JORNADA_LABELS)
const COUNTRY_NAMES = COUNTRIES.map((c) => c.name).sort()

export interface SalaryBucket {
  label: string
  min: number
  max: number
}

export interface DateBucket {
  label: string
  maxDays: number
}

/**
 * Bucket edges are raw numbers, not normalized across currencies — a job
 * posted in a different currency than the reader expects will not compare
 * meaningfully. Acceptable while listings are dominated by a single market;
 * revisit with real FX rates if the catalog becomes genuinely multi-currency.
 */
export const SALARY_BUCKETS: SalaryBucket[] = [
  { label: "Menos de 5,000", min: 0, max: 5000 },
  { label: "5,000 - 10,000", min: 5000, max: 10000 },
  { label: "10,000 - 15,000", min: 10000, max: 15000 },
  { label: "Más de 15,000", min: 15000, max: Infinity },
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
  countries: string[]
  onCountriesChange: (value: string[]) => void
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
  countries,
  onCountriesChange,
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
  const regionsForCountries = [
    ...new Set(
      GEO_CITIES.filter((c) => countries.length === 0 || countries.includes(c.country)).map(
        (c) => c.department
      )
    ),
  ].sort()

  const activeCount =
    categories.length +
    modalities.length +
    schedules.length +
    countries.length +
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

        <AccordionItem value="pais">
          <AccordionTrigger>País</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={COUNTRY_NAMES}
              selected={countries}
              onChange={onCountriesChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="region">
          <AccordionTrigger>Región</AccordionTrigger>
          <AccordionPanel>
            <FilterGroup
              values={regionsForCountries}
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
