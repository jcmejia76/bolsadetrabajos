import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Role, CompanyStatus } from "../src/generated/prisma/enums";
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

async function main() {
  await seedAdmin();
  await seedJobCategories();

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
