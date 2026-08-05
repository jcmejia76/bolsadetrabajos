import {
  BarChart3Icon,
  BriefcaseIcon,
  BuildingIcon,
  CodeIcon,
  GraduationCapIcon,
  HandshakeIcon,
  HardHatIcon,
  HeadphonesIcon,
  HeartPulseIcon,
  MegaphoneIcon,
  PaletteIcon,
  ScaleIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
  UtensilsIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

/** Keyed by the real JobCategory.slug seeded in the database. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "administracion-y-finanzas": BarChart3Icon,
  "atencion-al-cliente": HeadphonesIcon,
  "comercial-y-ventas": HandshakeIcon,
  "construccion-e-ingenieria-civil": HardHatIcon,
  "diseno-y-multimedia": PaletteIcon,
  educacion: GraduationCapIcon,
  "gastronomia-y-turismo": UtensilsIcon,
  legal: ScaleIcon,
  "logistica-y-cadena-de-suministro": TruckIcon,
  "manufactura-y-produccion": WrenchIcon,
  "marketing-y-publicidad": MegaphoneIcon,
  "recursos-humanos": UsersIcon,
  "salud-y-medicina": HeartPulseIcon,
  seguridad: ShieldIcon,
  "tecnologia-de-la-informacion": CodeIcon,
  telecomunicaciones: BuildingIcon,
  "transporte-y-distribucion": TruckIcon,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? BriefcaseIcon;
}
