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

const CONTENT_PAGES: { slug: string; title: string; body: string }[] = [
  {
    slug: "privacidad",
    title: "Política de Privacidad",
    body: `
<h2>1. Datos que recopilamos</h2>
<p>Cuando creas una cuenta, publicas una vacante o subes tu currículum, recopilamos la información que nos proporcionas directamente: nombre, correo electrónico, teléfono, experiencia laboral, educación y demás datos de tu perfil profesional o de tu empresa.</p>
<h2>2. Cómo usamos tus datos</h2>
<p>Usamos tu información para operar la plataforma: mostrar tu perfil a empresas cuando aplicas a una vacante, permitir que las empresas publiquen y gestionen ofertas, enviarte notificaciones sobre tus postulaciones y mejorar la experiencia general del servicio.</p>
<h2>3. Con quién compartimos tu información</h2>
<p>Tu perfil de candidato y tu CV se comparten con las empresas a las que decides postularte. La información de empresas aprobadas es visible públicamente en la plataforma. No vendemos tus datos personales a terceros.</p>
<h2>4. Seguridad</h2>
<p>Aplicamos medidas técnicas razonables para proteger tu información, incluyendo el cifrado de contraseñas y controles de acceso basados en roles. Ningún sistema es 100% infalible, por lo que te recomendamos usar una contraseña única para tu cuenta.</p>
<h2>5. Tus derechos</h2>
<p>Puedes acceder, actualizar o eliminar la información de tu perfil en cualquier momento desde tu cuenta. Si necesitas ayuda adicional para ejercer estos derechos, puedes escribirnos desde la página de Soporte.</p>
<h2>6. Cambios a esta política</h2>
<p>Podemos actualizar esta política ocasionalmente para reflejar cambios en la plataforma. Publicaremos cualquier cambio importante en esta misma página.</p>
`.trim(),
  },
  {
    slug: "terminos",
    title: "Términos y Condiciones",
    body: `
<h2>1. Aceptación de los términos</h2>
<p>Al crear una cuenta o utilizar Bolsa de Trabajos, aceptas estos términos y condiciones. Si no estás de acuerdo, por favor no utilices la plataforma.</p>
<h2>2. Cuentas de usuario</h2>
<p>Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra en tu cuenta. Debes proporcionar información veraz al registrarte y mantenerla actualizada.</p>
<h2>3. Uso de la plataforma</h2>
<p>Las vacantes publicadas por empresas y los perfiles de candidatos pasan por un proceso de revisión antes de ser visibles públicamente. Está prohibido publicar contenido falso, engañoso, discriminatorio o que infrinja derechos de terceros.</p>
<h2>4. Responsabilidad sobre el contenido</h2>
<p>Bolsa de Trabajos actúa como intermediario entre candidatos y empresas. No garantizamos la veracidad de las vacantes publicadas ni de los perfiles de los candidatos, y no somos parte de la relación laboral que pueda surgir entre ambas partes.</p>
<h2>5. Suspensión de cuentas</h2>
<p>Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos, incluyendo el uso indebido de la plataforma, la publicación de contenido fraudulento o comportamiento abusivo hacia otros usuarios.</p>
<h2>6. Cambios al servicio</h2>
<p>Podemos modificar o discontinuar funciones de la plataforma en cualquier momento. Te notificaremos sobre cambios importantes que afecten significativamente tu uso del servicio.</p>
<h2>7. Contacto</h2>
<p>Si tienes dudas sobre estos términos, puedes escribirnos desde la página de Soporte.</p>
`.trim(),
  },
  {
    slug: "cookies",
    title: "Política de Cookies",
    body: `
<h2>1. Qué son las cookies</h2>
<p>Las cookies son pequeños archivos que un sitio web guarda en tu navegador para recordar información entre visitas, como el hecho de que iniciaste sesión.</p>
<h2>2. Cookies que utilizamos</h2>
<p>Usamos una cookie esencial de sesión para mantener tu inicio de sesión activo mientras navegas la plataforma. Esta cookie es necesaria para el funcionamiento del sitio y no puede desactivarse sin afectar tu capacidad de iniciar sesión.</p>
<p>Actualmente no utilizamos cookies de publicidad ni de seguimiento de terceros con fines de marketing.</p>
<h2>3. Cómo controlar las cookies</h2>
<p>Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que bloquear la cookie de sesión impedirá que puedas mantener la sesión iniciada en la plataforma.</p>
<h2>4. Cambios a esta política</h2>
<p>Si en el futuro incorporamos nuevas cookies (por ejemplo, para analítica), actualizaremos esta página para reflejarlo.</p>
`.trim(),
  },
];

async function seedContentPages() {
  let created = 0;
  for (const page of CONTENT_PAGES) {
    const existing = await prisma.contentPage.findUnique({ where: { slug: page.slug } });
    if (existing) continue;
    await prisma.contentPage.create({ data: page });
    created += 1;
  }
  console.log(`Páginas de contenido sembradas: ${created} nuevas (${CONTENT_PAGES.length} totales).`);
}

async function main() {
  await seedAdmin();
  await seedJobCategories();
  await seedSystemStaffRoles();
  await seedContentPages();

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
