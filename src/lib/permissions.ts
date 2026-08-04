import { Permission, StaffScope } from "@/generated/prisma/enums";

export { Permission, StaffScope };

export interface PermissionDef {
  value: Permission;
  label: string;
}

export interface PermissionModule {
  key: string;
  label: string;
  scope: StaffScope;
  permissions: PermissionDef[];
}

/**
 * Catalog of every assignable permission, grouped by module, used both to
 * render the permissions matrix (Fase 2/3) and to validate role payloads.
 */
export const PERMISSION_MODULES: PermissionModule[] = [
  // ----- Ámbito SISTEMA -----
  {
    key: "sistema-empresas",
    label: "Empresas",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_EMPRESAS_VER, label: "Ver" },
      { value: Permission.SISTEMA_EMPRESAS_CREAR, label: "Crear" },
      { value: Permission.SISTEMA_EMPRESAS_EDITAR, label: "Editar" },
      { value: Permission.SISTEMA_EMPRESAS_APROBAR, label: "Aprobar" },
      { value: Permission.SISTEMA_EMPRESAS_SUSPENDER, label: "Suspender" },
      { value: Permission.SISTEMA_EMPRESAS_ELIMINAR, label: "Eliminar" },
    ],
  },
  {
    key: "sistema-vacantes",
    label: "Vacantes",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_VACANTES_VER, label: "Ver" },
      { value: Permission.SISTEMA_VACANTES_APROBAR, label: "Aprobar" },
      { value: Permission.SISTEMA_VACANTES_RECHAZAR, label: "Rechazar" },
      { value: Permission.SISTEMA_VACANTES_EDITAR, label: "Editar" },
      { value: Permission.SISTEMA_VACANTES_DESTACAR, label: "Destacar" },
      { value: Permission.SISTEMA_VACANTES_ELIMINAR, label: "Eliminar" },
    ],
  },
  {
    key: "sistema-candidatos",
    label: "Candidatos",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_CANDIDATOS_VER, label: "Ver" },
      { value: Permission.SISTEMA_CANDIDATOS_APROBAR_CV, label: "Aprobar CV" },
      { value: Permission.SISTEMA_CANDIDATOS_SUSPENDER, label: "Suspender" },
      { value: Permission.SISTEMA_CANDIDATOS_ELIMINAR, label: "Eliminar" },
    ],
  },
  {
    key: "sistema-postulaciones",
    label: "Postulaciones",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_POSTULACIONES_VER, label: "Ver" },
      { value: Permission.SISTEMA_POSTULACIONES_GESTIONAR, label: "Gestionar" },
      { value: Permission.SISTEMA_POSTULACIONES_EXPORTAR, label: "Exportar" },
    ],
  },
  {
    key: "sistema-dashboard",
    label: "Dashboard",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_DASHBOARD_SOLO_LECTURA, label: "Solo lectura" },
      { value: Permission.SISTEMA_DASHBOARD_COMPLETO, label: "Completo" },
    ],
  },
  {
    key: "sistema-configuracion",
    label: "Configuración",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_CONFIGURACION_VER, label: "Ver" },
      { value: Permission.SISTEMA_CONFIGURACION_EDITAR, label: "Editar" },
    ],
  },
  {
    key: "sistema-reportes",
    label: "Reportes",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_REPORTES_VER, label: "Ver" },
      { value: Permission.SISTEMA_REPORTES_EXPORTAR, label: "Exportar" },
    ],
  },
  {
    key: "sistema-equipo",
    label: "Usuarios (Equipo)",
    scope: StaffScope.SISTEMA,
    permissions: [
      { value: Permission.SISTEMA_EQUIPO_VER, label: "Ver" },
      { value: Permission.SISTEMA_EQUIPO_CREAR, label: "Crear" },
      { value: Permission.SISTEMA_EQUIPO_EDITAR, label: "Editar" },
      { value: Permission.SISTEMA_EQUIPO_SUSPENDER, label: "Suspender" },
      { value: Permission.SISTEMA_EQUIPO_ELIMINAR, label: "Eliminar" },
    ],
  },

  // ----- Ámbito EMPRESA -----
  {
    key: "empresa-ofertas",
    label: "Vacantes",
    scope: StaffScope.EMPRESA,
    permissions: [
      { value: Permission.EMPRESA_OFERTAS_VER, label: "Ver" },
      { value: Permission.EMPRESA_OFERTAS_CREAR, label: "Crear" },
      { value: Permission.EMPRESA_OFERTAS_EDITAR, label: "Editar" },
      { value: Permission.EMPRESA_OFERTAS_PUBLICAR, label: "Publicar" },
      { value: Permission.EMPRESA_OFERTAS_PAUSAR, label: "Pausar" },
      { value: Permission.EMPRESA_OFERTAS_ELIMINAR, label: "Eliminar" },
    ],
  },
  {
    key: "empresa-postulaciones",
    label: "Postulaciones",
    scope: StaffScope.EMPRESA,
    permissions: [
      { value: Permission.EMPRESA_POSTULACIONES_VER, label: "Ver" },
      { value: Permission.EMPRESA_POSTULACIONES_REVISAR, label: "Revisar" },
      { value: Permission.EMPRESA_POSTULACIONES_CAMBIAR_ESTADO, label: "Cambiar estado" },
      { value: Permission.EMPRESA_POSTULACIONES_DESCARGAR_CV, label: "Descargar CV" },
      { value: Permission.EMPRESA_POSTULACIONES_AGREGAR_NOTAS, label: "Agregar notas" },
    ],
  },
  {
    key: "empresa-perfil",
    label: "Perfil de empresa",
    scope: StaffScope.EMPRESA,
    permissions: [{ value: Permission.EMPRESA_PERFIL_EDITAR, label: "Editar información" }],
  },
  {
    key: "empresa-equipo",
    label: "Equipo",
    scope: StaffScope.EMPRESA,
    permissions: [
      { value: Permission.EMPRESA_EQUIPO_INVITAR, label: "Invitar empleados" },
      { value: Permission.EMPRESA_EQUIPO_EDITAR_PERMISOS, label: "Editar permisos" },
      { value: Permission.EMPRESA_EQUIPO_ELIMINAR, label: "Eliminar miembros" },
    ],
  },
  {
    key: "empresa-estadisticas",
    label: "Estadísticas",
    scope: StaffScope.EMPRESA,
    permissions: [{ value: Permission.EMPRESA_ESTADISTICAS_VER, label: "Solo lectura" }],
  },
];

export function permissionModulesForScope(scope: StaffScope): PermissionModule[] {
  return PERMISSION_MODULES.filter((m) => m.scope === scope);
}

export function allPermissionsForScope(scope: StaffScope): Permission[] {
  return permissionModulesForScope(scope).flatMap((m) => m.permissions.map((p) => p.value));
}

const ALL_PERMISSION_VALUES = new Set(PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.value)));

/** Narrows an arbitrary string array (e.g. from a form submission) down to valid Permission values for the given scope. */
export function sanitizePermissions(scope: StaffScope, values: string[]): Permission[] {
  const allowed = new Set(allPermissionsForScope(scope));
  return values.filter(
    (v): v is Permission => ALL_PERMISSION_VALUES.has(v as Permission) && allowed.has(v as Permission)
  );
}
