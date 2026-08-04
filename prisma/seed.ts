import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Role, CompanyStatus, StaffScope, Permission } from "../src/generated/prisma/enums";
import { hashPassword } from "../src/lib/password";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@bolsatrabajos.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ya existe (${email}), se omite.`);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      role: Role.ADMINISTRADOR,
      isActive: true,
    },
  });
  console.log(`Usuario administrador creado: ${email}`);
}

async function seedTestUsers() {
  const empresaEmail = "empresa.demo@bolsatrabajos.com";
  const candidatoEmail = "candidato.demo@bolsatrabajos.com";
  const password = "ChangeMe123!";

  const existingEmpresa = await prisma.user.findUnique({ where: { email: empresaEmail } });
  if (!existingEmpresa) {
    await prisma.user.create({
      data: {
        email: empresaEmail,
        passwordHash: await hashPassword(password),
        role: Role.EMPRESA,
        isActive: true,
        company: {
          create: {
            name: "Empresa Demo S.A.",
            slug: "empresa-demo",
            email: empresaEmail,
            status: CompanyStatus.APROBADA,
            approvedAt: new Date(),
          },
        },
      },
    });
    console.log(`Empresa de prueba (aprobada) creada: ${empresaEmail} / ${password}`);
  } else {
    console.log(`Empresa de prueba ya existe (${empresaEmail}), se omite.`);
  }

  const existingCandidato = await prisma.user.findUnique({ where: { email: candidatoEmail } });
  if (!existingCandidato) {
    await prisma.user.create({
      data: {
        email: candidatoEmail,
        passwordHash: await hashPassword(password),
        role: Role.CANDIDATO,
        isActive: true,
        candidate: {
          create: {
            firstName: "Candidato",
            lastName: "Demo",
          },
        },
      },
    });
    console.log(`Candidato de prueba creado: ${candidatoEmail} / ${password}`);
  } else {
    console.log(`Candidato de prueba ya existe (${candidatoEmail}), se omite.`);
  }
}

async function seedJobCategories() {
  const categories = [
    "Administración y Finanzas",
    "Atención al Cliente",
    "Comercial y Ventas",
    "Construcción e Ingeniería Civil",
    "Diseño y Multimedia",
    "Educación",
    "Gastronomía y Turismo",
    "Legal",
    "Logística y Cadena de Suministro",
    "Manufactura y Producción",
    "Marketing y Publicidad",
    "Recursos Humanos",
    "Salud y Medicina",
    "Seguridad",
    "Tecnología de la Información",
    "Telecomunicaciones",
    "Transporte y Distribución",
    "Otros",
  ];

  const result = await prisma.jobCategory.createMany({
    data: categories.map((name) => ({ name, slug: slugify(name) })),
    skipDuplicates: true,
  });
  console.log(`Categorías sembradas: ${result.count} nuevas (${categories.length} totales).`);
}

const SYSTEM_STAFF_ROLES: { name: string; description: string; permissions: Permission[] }[] = [
  {
    name: "Moderador",
    description: "Aprueba y modera empresas y vacantes publicadas en la plataforma.",
    permissions: [
      Permission.SISTEMA_EMPRESAS_VER,
      Permission.SISTEMA_EMPRESAS_APROBAR,
      Permission.SISTEMA_EMPRESAS_SUSPENDER,
      Permission.SISTEMA_VACANTES_VER,
      Permission.SISTEMA_VACANTES_APROBAR,
      Permission.SISTEMA_VACANTES_RECHAZAR,
      Permission.SISTEMA_VACANTES_EDITAR,
      Permission.SISTEMA_VACANTES_DESTACAR,
      Permission.SISTEMA_CANDIDATOS_VER,
      Permission.SISTEMA_DASHBOARD_SOLO_LECTURA,
    ],
  },
  {
    name: "Soporte",
    description: "Atiende consultas de empresas y candidatos y da seguimiento a postulaciones.",
    permissions: [
      Permission.SISTEMA_EMPRESAS_VER,
      Permission.SISTEMA_CANDIDATOS_VER,
      Permission.SISTEMA_POSTULACIONES_VER,
      Permission.SISTEMA_POSTULACIONES_GESTIONAR,
      Permission.SISTEMA_DASHBOARD_SOLO_LECTURA,
    ],
  },
  {
    name: "Auditor",
    description: "Acceso de solo lectura a toda la plataforma para fines de auditoría.",
    permissions: [
      Permission.SISTEMA_DASHBOARD_SOLO_LECTURA,
      Permission.SISTEMA_REPORTES_VER,
      Permission.SISTEMA_REPORTES_EXPORTAR,
      Permission.SISTEMA_EMPRESAS_VER,
      Permission.SISTEMA_VACANTES_VER,
      Permission.SISTEMA_CANDIDATOS_VER,
      Permission.SISTEMA_POSTULACIONES_VER,
    ],
  },
  {
    name: "RRHH",
    description: "Revisa y aprueba CVs y da seguimiento a postulaciones.",
    permissions: [
      Permission.SISTEMA_CANDIDATOS_VER,
      Permission.SISTEMA_CANDIDATOS_APROBAR_CV,
      Permission.SISTEMA_POSTULACIONES_VER,
      Permission.SISTEMA_POSTULACIONES_GESTIONAR,
      Permission.SISTEMA_DASHBOARD_SOLO_LECTURA,
    ],
  },
  {
    name: "Analista",
    description: "Analiza métricas y reportes de la plataforma.",
    permissions: [
      Permission.SISTEMA_DASHBOARD_COMPLETO,
      Permission.SISTEMA_REPORTES_VER,
      Permission.SISTEMA_REPORTES_EXPORTAR,
      Permission.SISTEMA_EMPRESAS_VER,
      Permission.SISTEMA_VACANTES_VER,
      Permission.SISTEMA_CANDIDATOS_VER,
    ],
  },
  {
    name: "Supervisor",
    description: "Acceso operativo amplio sobre empresas, vacantes, candidatos y postulaciones.",
    permissions: [
      Permission.SISTEMA_EMPRESAS_VER,
      Permission.SISTEMA_EMPRESAS_EDITAR,
      Permission.SISTEMA_EMPRESAS_APROBAR,
      Permission.SISTEMA_EMPRESAS_SUSPENDER,
      Permission.SISTEMA_VACANTES_VER,
      Permission.SISTEMA_VACANTES_APROBAR,
      Permission.SISTEMA_VACANTES_RECHAZAR,
      Permission.SISTEMA_VACANTES_EDITAR,
      Permission.SISTEMA_VACANTES_DESTACAR,
      Permission.SISTEMA_VACANTES_ELIMINAR,
      Permission.SISTEMA_CANDIDATOS_VER,
      Permission.SISTEMA_CANDIDATOS_APROBAR_CV,
      Permission.SISTEMA_CANDIDATOS_SUSPENDER,
      Permission.SISTEMA_POSTULACIONES_VER,
      Permission.SISTEMA_POSTULACIONES_GESTIONAR,
      Permission.SISTEMA_POSTULACIONES_EXPORTAR,
      Permission.SISTEMA_DASHBOARD_COMPLETO,
      Permission.SISTEMA_EQUIPO_VER,
    ],
  },
];

async function seedSystemStaffRoles() {
  let created = 0;
  for (const roleDef of SYSTEM_STAFF_ROLES) {
    const existing = await prisma.staffRole.findFirst({
      where: { scope: StaffScope.SISTEMA, companyId: null, name: roleDef.name },
    });
    if (existing) continue;

    await prisma.staffRole.create({
      data: {
        scope: StaffScope.SISTEMA,
        name: roleDef.name,
        description: roleDef.description,
        isSystemDefault: true,
        permissions: {
          create: roleDef.permissions.map((permission) => ({ permission })),
        },
      },
    });
    created += 1;
  }
  console.log(`Roles de staff del sistema sembrados: ${created} nuevos (${SYSTEM_STAFF_ROLES.length} totales).`);
}

async function main() {
  await seedAdmin();
  await seedJobCategories();
  await seedSystemStaffRoles();

  if (process.argv.includes("--with-test-users")) {
    await seedTestUsers();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
