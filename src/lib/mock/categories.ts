import {
  BarChart3Icon,
  CodeIcon,
  GraduationCapIcon,
  HeadphonesIcon,
  HeartPulseIcon,
  MegaphoneIcon,
  PaletteIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

export interface MockCategory {
  slug: string
  name: string
  jobCount: number
  icon: LucideIcon
}

export const mockCategories: MockCategory[] = [
  {
    slug: "tecnologia",
    name: "Tecnología de la Información",
    jobCount: 482,
    icon: CodeIcon,
  },
  {
    slug: "administracion-finanzas",
    name: "Administración y Finanzas",
    jobCount: 261,
    icon: BarChart3Icon,
  },
  {
    slug: "marketing-publicidad",
    name: "Marketing y Publicidad",
    jobCount: 198,
    icon: MegaphoneIcon,
  },
  {
    slug: "diseno-multimedia",
    name: "Diseño y Multimedia",
    jobCount: 145,
    icon: PaletteIcon,
  },
  {
    slug: "salud-medicina",
    name: "Salud y Medicina",
    jobCount: 176,
    icon: HeartPulseIcon,
  },
  {
    slug: "atencion-cliente",
    name: "Atención al Cliente",
    jobCount: 233,
    icon: HeadphonesIcon,
  },
  {
    slug: "educacion",
    name: "Educación",
    jobCount: 112,
    icon: GraduationCapIcon,
  },
  {
    slug: "logistica",
    name: "Logística y Cadena de Suministro",
    jobCount: 154,
    icon: TruckIcon,
  },
]
