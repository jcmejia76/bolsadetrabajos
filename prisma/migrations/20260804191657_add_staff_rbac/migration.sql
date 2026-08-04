-- CreateEnum
CREATE TYPE "StaffScope" AS ENUM ('SISTEMA', 'EMPRESA');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('INVITADO', 'ACTIVO', 'SUSPENDIDO', 'ELIMINADO');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('SISTEMA_EMPRESAS_VER', 'SISTEMA_EMPRESAS_CREAR', 'SISTEMA_EMPRESAS_EDITAR', 'SISTEMA_EMPRESAS_APROBAR', 'SISTEMA_EMPRESAS_SUSPENDER', 'SISTEMA_EMPRESAS_ELIMINAR', 'SISTEMA_VACANTES_VER', 'SISTEMA_VACANTES_APROBAR', 'SISTEMA_VACANTES_RECHAZAR', 'SISTEMA_VACANTES_EDITAR', 'SISTEMA_VACANTES_DESTACAR', 'SISTEMA_VACANTES_ELIMINAR', 'SISTEMA_CANDIDATOS_VER', 'SISTEMA_CANDIDATOS_APROBAR_CV', 'SISTEMA_CANDIDATOS_SUSPENDER', 'SISTEMA_CANDIDATOS_ELIMINAR', 'SISTEMA_POSTULACIONES_VER', 'SISTEMA_POSTULACIONES_GESTIONAR', 'SISTEMA_POSTULACIONES_EXPORTAR', 'SISTEMA_DASHBOARD_SOLO_LECTURA', 'SISTEMA_DASHBOARD_COMPLETO', 'SISTEMA_CONFIGURACION_VER', 'SISTEMA_CONFIGURACION_EDITAR', 'SISTEMA_REPORTES_VER', 'SISTEMA_REPORTES_EXPORTAR', 'SISTEMA_EQUIPO_VER', 'SISTEMA_EQUIPO_CREAR', 'SISTEMA_EQUIPO_EDITAR', 'SISTEMA_EQUIPO_SUSPENDER', 'SISTEMA_EQUIPO_ELIMINAR', 'EMPRESA_OFERTAS_VER', 'EMPRESA_OFERTAS_CREAR', 'EMPRESA_OFERTAS_EDITAR', 'EMPRESA_OFERTAS_PUBLICAR', 'EMPRESA_OFERTAS_PAUSAR', 'EMPRESA_OFERTAS_ELIMINAR', 'EMPRESA_POSTULACIONES_VER', 'EMPRESA_POSTULACIONES_REVISAR', 'EMPRESA_POSTULACIONES_CAMBIAR_ESTADO', 'EMPRESA_POSTULACIONES_DESCARGAR_CV', 'EMPRESA_POSTULACIONES_AGREGAR_NOTAS', 'EMPRESA_PERFIL_EDITAR', 'EMPRESA_EQUIPO_INVITAR', 'EMPRESA_EQUIPO_EDITAR_PERMISOS', 'EMPRESA_EQUIPO_ELIMINAR', 'EMPRESA_ESTADISTICAS_VER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'STAFF_INVITADO';
ALTER TYPE "NotificationType" ADD VALUE 'STAFF_PERMISOS_ACTUALIZADOS';
ALTER TYPE "NotificationType" ADD VALUE 'STAFF_SUSPENDIDO';

-- CreateTable
CREATE TABLE "StaffRole" (
    "id" TEXT NOT NULL,
    "scope" "StaffScope" NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystemDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffRolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "StaffRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scope" "StaffScope" NOT NULL,
    "companyId" TEXT,
    "roleId" TEXT NOT NULL,
    "status" "StaffStatus" NOT NULL DEFAULT 'INVITADO',
    "jobTitle" TEXT,
    "invitedById" TEXT NOT NULL,
    "invitationToken" TEXT,
    "invitationExpiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffRole_scope_companyId_idx" ON "StaffRole"("scope", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffRole_scope_companyId_name_key" ON "StaffRole"("scope", "companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StaffRolePermission_roleId_permission_key" ON "StaffRolePermission"("roleId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_userId_key" ON "StaffMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_invitationToken_key" ON "StaffMember"("invitationToken");

-- CreateIndex
CREATE INDEX "StaffMember_scope_companyId_idx" ON "StaffMember"("scope", "companyId");

-- AddForeignKey
ALTER TABLE "StaffRole" ADD CONSTRAINT "StaffRole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffRolePermission" ADD CONSTRAINT "StaffRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "StaffRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "StaffRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
