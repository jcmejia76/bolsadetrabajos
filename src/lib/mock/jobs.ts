import { findGeoCity, GEO_CITIES } from "@/lib/geo"
import { mockCompanies } from "./companies"

export type JobModality = "Remoto" | "Presencial" | "Híbrido"
export type JobSchedule = "Tiempo completo" | "Medio tiempo" | "Freelance"

export interface MockJob {
  id: string
  slug: string
  title: string
  companyName: string
  companySlug: string
  companyInitials: string
  companyColor: string
  location: string
  department?: string
  lat?: number
  lng?: number
  remote: boolean
  modality: JobModality
  schedule: JobSchedule
  salaryMin: number
  salaryMax: number
  currency: string
  category: string
  tags: string[]
  postedDaysAgo: number
  featured: boolean
  applicantsCount: number
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

/** Attaches department/lat/lng from the GEO_CITIES lookup, or marks the job as remote. */
function withGeo<T extends { location: string; modality: JobModality }>(
  job: T
): T & { department?: string; lat?: number; lng?: number; remote: boolean } {
  if (job.modality === "Remoto") {
    return { ...job, remote: true }
  }
  const geo = findGeoCity(job.location)
  return { ...job, department: geo?.department, lat: geo?.lat, lng: geo?.lng, remote: false }
}

const curatedJobs: Omit<MockJob, "department" | "lat" | "lng" | "remote">[] = [
  {
    id: "job-1",
    slug: "senior-frontend-engineer-nimbus-tech",
    title: "Senior Frontend Engineer",
    companyName: "Nimbus Tech",
    companySlug: "nimbus-tech",
    companyInitials: "NT",
    companyColor: "oklch(0.56 0.17 258)",
    location: "Ciudad de Guatemala",
    modality: "Híbrido",
    schedule: "Tiempo completo",
    salaryMin: 12000,
    salaryMax: 18000,
    currency: "GTQ",
    category: "Tecnología de la Información",
    tags: ["React", "TypeScript", "Next.js"],
    postedDaysAgo: 1,
    featured: true,
    applicantsCount: 24,
    description:
      "Buscamos un/a Senior Frontend Engineer para liderar el desarrollo de nuestra plataforma de infraestructura en la nube, trabajando codo a codo con diseño y producto en un equipo ágil y distribuido.",
    responsibilities: [
      "Construir y mantener interfaces de usuario con React, TypeScript y Next.js.",
      "Colaborar con diseño para implementar sistemas de componentes reutilizables.",
      "Optimizar el rendimiento y la accesibilidad de la aplicación.",
      "Dar mentoría técnica a desarrolladores frontend junior.",
    ],
    requirements: [
      "4+ años de experiencia con React y ecosistema moderno de frontend.",
      "Dominio de TypeScript y patrones de arquitectura de componentes.",
      "Experiencia con Next.js App Router es un plus.",
      "Buenas prácticas de testing y control de versiones.",
    ],
    benefits: [
      "Seguro médico privado",
      "Horario flexible",
      "Presupuesto anual de aprendizaje",
      "Bono por desempeño",
    ],
  },
  {
    id: "job-2",
    slug: "analista-financiero-senior-vertice",
    title: "Analista Financiero Senior",
    companyName: "Vértice Financiero",
    companySlug: "vertice-financiero",
    companyInitials: "VF",
    companyColor: "oklch(0.62 0.16 200)",
    location: "Ciudad de Guatemala",
    modality: "Presencial",
    schedule: "Tiempo completo",
    salaryMin: 9000,
    salaryMax: 13000,
    currency: "GTQ",
    category: "Administración y Finanzas",
    tags: ["Excel avanzado", "SAP", "Forecasting"],
    postedDaysAgo: 2,
    featured: true,
    applicantsCount: 18,
    description:
      "Únete a nuestro equipo financiero para liderar el análisis de indicadores clave, forecasting y reportería ejecutiva de una de las fintechs más grandes de la región.",
    responsibilities: [
      "Elaborar reportes financieros mensuales y análisis de variaciones.",
      "Construir modelos de forecasting y presupuesto anual.",
      "Presentar hallazgos a gerencia y dirección financiera.",
      "Dar seguimiento a indicadores de rentabilidad por unidad de negocio.",
    ],
    requirements: [
      "Licenciatura en Finanzas, Contaduría o carrera afín.",
      "3+ años de experiencia en análisis financiero.",
      "Manejo avanzado de Excel y experiencia con SAP.",
      "Inglés intermedio-avanzado.",
    ],
    benefits: [
      "Seguro médico y de vida",
      "Bono anual por desempeño",
      "Capacitación continua",
      "Plan de carrera interno",
    ],
  },
  {
    id: "job-3",
    slug: "enfermero-a-clinico-salud-integral",
    title: "Enfermero/a Clínico",
    companyName: "Salud Integral",
    companySlug: "salud-integral",
    companyInitials: "SI",
    companyColor: "oklch(0.6 0.15 150)",
    location: "Quetzaltenango",
    modality: "Presencial",
    schedule: "Tiempo completo",
    salaryMin: 6500,
    salaryMax: 8500,
    currency: "GTQ",
    category: "Salud y Medicina",
    tags: ["Urgencias", "Turnos rotativos"],
    postedDaysAgo: 3,
    featured: false,
    applicantsCount: 31,
    description:
      "Buscamos enfermero/a clínico para nuestra unidad de urgencias, comprometido con brindar atención médica de calidad y trabajar en equipo con el cuerpo médico.",
    responsibilities: [
      "Brindar atención directa a pacientes en el área de urgencias.",
      "Administrar medicamentos y llevar registro clínico preciso.",
      "Coordinar con el equipo médico el plan de atención de cada paciente.",
      "Cumplir protocolos de bioseguridad y calidad hospitalaria.",
    ],
    requirements: [
      "Título de enfermería vigente y colegiado activo.",
      "2+ años de experiencia en áreas de urgencias o cuidados intensivos.",
      "Disponibilidad para turnos rotativos.",
      "Certificación en soporte vital básico/avanzado.",
    ],
    benefits: [
      "Seguro médico familiar",
      "Bono de turno nocturno",
      "Capacitaciones médicas continuas",
      "Estabilidad laboral",
    ],
  },
  {
    id: "job-4",
    slug: "diseñador-a-de-producto-orbita-creativa",
    title: "Diseñador/a de Producto UX/UI",
    companyName: "Órbita Creativa",
    companySlug: "orbita-creativa",
    companyInitials: "OC",
    companyColor: "oklch(0.64 0.19 25)",
    location: "Remoto",
    modality: "Remoto",
    schedule: "Freelance",
    salaryMin: 7000,
    salaryMax: 11000,
    currency: "GTQ",
    category: "Diseño y Multimedia",
    tags: ["Figma", "Design Systems", "Prototipado"],
    postedDaysAgo: 1,
    featured: true,
    applicantsCount: 42,
    description:
      "Buscamos un/a diseñador/a de producto freelance para diseñar experiencias digitales memorables para nuestros clientes, desde investigación hasta prototipado de alta fidelidad.",
    responsibilities: [
      "Diseñar flujos y wireframes centrados en el usuario.",
      "Mantener y evolucionar el design system del equipo.",
      "Crear prototipos interactivos en Figma para validación con usuarios.",
      "Colaborar estrechamente con desarrollo para asegurar la implementación fiel.",
    ],
    requirements: [
      "Portafolio sólido de proyectos de producto digital.",
      "Dominio de Figma y herramientas de prototipado.",
      "Experiencia diseñando design systems escalables.",
      "Buena comunicación para trabajo remoto asíncrono.",
    ],
    benefits: [
      "Horario 100% flexible",
      "Proyectos con marcas reconocidas",
      "Pagos puntuales quincenales",
      "Posibilidad de contrato a largo plazo",
    ],
  },
  {
    id: "job-5",
    slug: "coordinador-a-de-logistica-logitrans",
    title: "Coordinador/a de Logística",
    companyName: "LogiTrans",
    companySlug: "logitrans",
    companyInitials: "LT",
    companyColor: "oklch(0.58 0.14 80)",
    location: "Escuintla",
    modality: "Presencial",
    schedule: "Tiempo completo",
    salaryMin: 7500,
    salaryMax: 10000,
    currency: "GTQ",
    category: "Logística y Cadena de Suministro",
    tags: ["Rutas", "Flotas", "WMS"],
    postedDaysAgo: 5,
    featured: false,
    applicantsCount: 12,
    description:
      "Coordina la operación diaria de nuestra flota de transporte, optimizando rutas y asegurando la entrega puntual de mercadería en todo el corredor centroamericano.",
    responsibilities: [
      "Planificar y optimizar rutas de distribución diarias.",
      "Supervisar el desempeño de la flota y conductores.",
      "Gestionar el sistema de administración de almacenes (WMS).",
      "Coordinar con clientes y proveedores tiempos de entrega.",
    ],
    requirements: [
      "Experiencia previa en logística o cadena de suministro.",
      "Conocimiento de sistemas WMS y planificación de rutas.",
      "Habilidades de liderazgo de equipos operativos.",
      "Licencia de conducir vigente.",
    ],
    benefits: [
      "Bono por cumplimiento de metas",
      "Seguro médico",
      "Capacitación en gestión logística",
      "Vehículo de la empresa",
    ],
  },
  {
    id: "job-6",
    slug: "instructor-a-online-eduplus",
    title: "Instructor/a de Matemáticas Online",
    companyName: "EduPlus",
    companySlug: "eduplus",
    companyInitials: "EP",
    companyColor: "oklch(0.55 0.18 300)",
    location: "Remoto",
    modality: "Remoto",
    schedule: "Medio tiempo",
    salaryMin: 4000,
    salaryMax: 6000,
    currency: "GTQ",
    category: "Educación",
    tags: ["Educación virtual", "Zoom"],
    postedDaysAgo: 6,
    featured: false,
    applicantsCount: 9,
    description:
      "Buscamos instructor/a apasionado/a por la enseñanza para impartir clases de matemáticas a estudiantes de secundaria a través de nuestra plataforma virtual.",
    responsibilities: [
      "Impartir clases en vivo por videollamada a grupos pequeños.",
      "Preparar material didáctico y evaluaciones.",
      "Dar seguimiento al progreso académico de cada estudiante.",
      "Participar en reuniones pedagógicas mensuales.",
    ],
    requirements: [
      "Profesorado o licenciatura en matemáticas o educación.",
      "Experiencia dando clases, presenciales o virtuales.",
      "Buena conexión a internet y equipo para videollamadas.",
      "Paciencia y habilidades de comunicación con jóvenes.",
    ],
    benefits: [
      "Horario a medio tiempo, ideal para compaginar",
      "Material didáctico proporcionado",
      "Pagos mensuales puntuales",
      "Posibilidad de crecer a tiempo completo",
    ],
  },
  {
    id: "job-7",
    slug: "especialista-en-marketing-digital-orbita",
    title: "Especialista en Marketing Digital",
    companyName: "Órbita Creativa",
    companySlug: "orbita-creativa",
    companyInitials: "OC",
    companyColor: "oklch(0.64 0.19 25)",
    location: "Ciudad de Guatemala",
    modality: "Híbrido",
    schedule: "Tiempo completo",
    salaryMin: 6000,
    salaryMax: 9000,
    currency: "GTQ",
    category: "Marketing y Publicidad",
    tags: ["Meta Ads", "SEO", "Analytics"],
    postedDaysAgo: 2,
    featured: false,
    applicantsCount: 27,
    description:
      "Buscamos especialista en marketing digital para gestionar campañas de adquisición y posicionamiento de marca para nuestra cartera de clientes.",
    responsibilities: [
      "Planificar y ejecutar campañas en Meta Ads y Google Ads.",
      "Dar seguimiento a métricas de rendimiento con Analytics.",
      "Optimizar estrategias de SEO para clientes y marca propia.",
      "Presentar reportes mensuales de resultados a clientes.",
    ],
    requirements: [
      "2+ años de experiencia en marketing digital o pauta paga.",
      "Manejo de Meta Ads Manager y Google Analytics.",
      "Conocimientos de SEO on-page y off-page.",
      "Capacidad analítica y orientación a resultados.",
    ],
    benefits: [
      "Modalidad híbrida",
      "Bono por cumplimiento de KPIs",
      "Ambiente creativo y colaborativo",
      "Certificaciones pagadas",
    ],
  },
  {
    id: "job-8",
    slug: "backend-engineer-nodejs-nimbus-tech",
    title: "Backend Engineer (Node.js)",
    companyName: "Nimbus Tech",
    companySlug: "nimbus-tech",
    companyInitials: "NT",
    companyColor: "oklch(0.56 0.17 258)",
    location: "Remoto",
    modality: "Remoto",
    schedule: "Tiempo completo",
    salaryMin: 13000,
    salaryMax: 19000,
    currency: "GTQ",
    category: "Tecnología de la Información",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    postedDaysAgo: 4,
    featured: true,
    applicantsCount: 35,
    description:
      "Súmate a nuestro equipo de plataforma para diseñar y escalar los servicios backend que dan soporte a miles de empresas en la nube.",
    responsibilities: [
      "Diseñar e implementar APIs escalables con Node.js.",
      "Administrar bases de datos PostgreSQL en entornos productivos.",
      "Desplegar y monitorear servicios en infraestructura AWS.",
      "Participar en revisiones de código y decisiones de arquitectura.",
    ],
    requirements: [
      "3+ años de experiencia con Node.js en producción.",
      "Experiencia con PostgreSQL y diseño de esquemas.",
      "Conocimiento práctico de servicios AWS (EC2, RDS, S3).",
      "Familiaridad con contenedores y CI/CD.",
    ],
    benefits: [
      "100% remoto",
      "Seguro médico privado",
      "Equipo de trabajo proporcionado",
      "Horario flexible por objetivos",
    ],
  },
  {
    id: "job-9",
    slug: "representante-atencion-cliente-vertice",
    title: "Representante de Atención al Cliente",
    companyName: "Vértice Financiero",
    companySlug: "vertice-financiero",
    companyInitials: "VF",
    companyColor: "oklch(0.62 0.16 200)",
    location: "Ciudad de Guatemala",
    modality: "Presencial",
    schedule: "Tiempo completo",
    salaryMin: 4500,
    salaryMax: 5800,
    currency: "GTQ",
    category: "Atención al Cliente",
    tags: ["Call center", "CRM"],
    postedDaysAgo: 7,
    featured: false,
    applicantsCount: 51,
    description:
      "Buscamos representante de atención al cliente para resolver consultas y brindar soporte de primer nivel a nuestros usuarios a través de distintos canales.",
    responsibilities: [
      "Atender consultas de clientes por teléfono, chat y correo.",
      "Registrar interacciones y casos en el CRM.",
      "Escalar casos complejos al equipo correspondiente.",
      "Cumplir metas de satisfacción y tiempo de respuesta.",
    ],
    requirements: [
      "Experiencia previa en atención al cliente o call center.",
      "Manejo básico de herramientas CRM.",
      "Excelente comunicación oral y escrita.",
      "Disponibilidad de horario completo.",
    ],
    benefits: [
      "Seguro médico",
      "Bono por metas de satisfacción",
      "Capacitación inicial remunerada",
      "Oportunidades de crecimiento interno",
    ],
  },
]

interface JobTemplate {
  title: string
  category: string
  tags: string[]
  salaryMin: number
  salaryMax: number
}

const TEMPLATE_BANK: JobTemplate[] = [
  { title: "Desarrollador/a Frontend", category: "Tecnología de la Información", tags: ["React", "CSS", "Accesibilidad"], salaryMin: 8000, salaryMax: 13000 },
  { title: "Ingeniero/a QA Automation", category: "Tecnología de la Información", tags: ["Cypress", "CI/CD", "Testing"], salaryMin: 9000, salaryMax: 14000 },
  { title: "Administrador/a de Bases de Datos", category: "Tecnología de la Información", tags: ["PostgreSQL", "Backups", "Tuning"], salaryMin: 10000, salaryMax: 16000 },
  { title: "DevOps Engineer", category: "Tecnología de la Información", tags: ["AWS", "Docker", "Terraform"], salaryMin: 12000, salaryMax: 18000 },
  { title: "Analista de Créditos", category: "Administración y Finanzas", tags: ["Riesgo", "Cobranza", "Excel"], salaryMin: 6500, salaryMax: 9500 },
  { title: "Contador/a General", category: "Administración y Finanzas", tags: ["NIIF", "Impuestos", "Conciliaciones"], salaryMin: 7000, salaryMax: 10500 },
  { title: "Auxiliar de Tesorería", category: "Administración y Finanzas", tags: ["Bancos", "Flujo de caja"], salaryMin: 5000, salaryMax: 7000 },
  { title: "Gerente de Marca", category: "Marketing y Publicidad", tags: ["Branding", "Investigación de mercado"], salaryMin: 11000, salaryMax: 16000 },
  { title: "Community Manager", category: "Marketing y Publicidad", tags: ["Redes sociales", "Copywriting"], salaryMin: 5000, salaryMax: 7500 },
  { title: "Diseñador/a Gráfico", category: "Diseño y Multimedia", tags: ["Illustrator", "Branding"], salaryMin: 5500, salaryMax: 8500 },
  { title: "Editor/a de Video", category: "Diseño y Multimedia", tags: ["Premiere", "Motion Graphics"], salaryMin: 6000, salaryMax: 9000 },
  { title: "Médico/a General", category: "Salud y Medicina", tags: ["Consulta externa"], salaryMin: 9000, salaryMax: 14000 },
  { title: "Técnico/a de Laboratorio", category: "Salud y Medicina", tags: ["Análisis clínicos"], salaryMin: 5500, salaryMax: 7500 },
  { title: "Fisioterapeuta", category: "Salud y Medicina", tags: ["Rehabilitación"], salaryMin: 6000, salaryMax: 8500 },
  { title: "Agente de Soporte Nivel 1", category: "Atención al Cliente", tags: ["Zendesk", "Chat en vivo"], salaryMin: 4200, salaryMax: 5500 },
  { title: "Supervisor/a de Call Center", category: "Atención al Cliente", tags: ["Liderazgo", "KPIs"], salaryMin: 6500, salaryMax: 9000 },
  { title: "Docente de Ciencias", category: "Educación", tags: ["Planeación didáctica"], salaryMin: 4500, salaryMax: 6500 },
  { title: "Coordinador/a Académico", category: "Educación", tags: ["Gestión educativa"], salaryMin: 6500, salaryMax: 9500 },
  { title: "Analista de Inventarios", category: "Logística y Cadena de Suministro", tags: ["WMS", "Kardex"], salaryMin: 5500, salaryMax: 8000 },
  { title: "Jefe de Bodega", category: "Logística y Cadena de Suministro", tags: ["Almacenes", "Inventario"], salaryMin: 7000, salaryMax: 10000 },
  { title: "Despachador/a de Flota", category: "Logística y Cadena de Suministro", tags: ["Rutas", "GPS"], salaryMin: 5000, salaryMax: 7000 },
]

const SCHEDULES: JobSchedule[] = ["Tiempo completo", "Medio tiempo", "Freelance"]

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Expands the curated set with deterministic, index-derived combinations so
 * the map has enough density to demonstrate clustering. No Math.random is
 * used so server and client renders stay identical.
 */
function generateJobs(count: number): MockJob[] {
  return Array.from({ length: count }, (_, i) => {
    const template = TEMPLATE_BANK[i % TEMPLATE_BANK.length]
    const company = mockCompanies[i % mockCompanies.length]
    const isRemote = i % 5 === 4
    const city = GEO_CITIES[i % GEO_CITIES.length]
    const modality: JobModality = isRemote ? "Remoto" : i % 3 === 0 ? "Híbrido" : "Presencial"
    const salaryBump = (i % 5) * 500
    const slug = `${slugify(template.title)}-${company.slug}-${i + 1}`

    const base = {
      id: `job-gen-${i + 1}`,
      slug,
      title: template.title,
      companyName: company.name,
      companySlug: company.slug,
      companyInitials: company.initials,
      companyColor: company.color,
      location: isRemote ? "Remoto" : city.city,
      modality,
      schedule: SCHEDULES[i % SCHEDULES.length],
      salaryMin: template.salaryMin + salaryBump,
      salaryMax: template.salaryMax + salaryBump,
      currency: "GTQ",
      category: template.category,
      tags: template.tags,
      postedDaysAgo: (i * 3 + 1) % 21,
      featured: i % 6 === 0,
      applicantsCount: 5 + ((i * 7) % 60),
      description: `${company.name} está en búsqueda de un/a ${template.title.toLowerCase()} para sumarse a su equipo en ${isRemote ? "modalidad remota" : city.city}, contribuyendo directamente a los objetivos del área de ${template.category.toLowerCase()}.`,
      responsibilities: [
        `Ejecutar las funciones propias del rol de ${template.title.toLowerCase()} con altos estándares de calidad.`,
        "Colaborar de forma cercana con otros equipos para cumplir los objetivos del área.",
        "Reportar avances y resultados de forma periódica a la jefatura correspondiente.",
      ],
      requirements: [
        `Experiencia previa como ${template.title.toLowerCase()} o en un puesto similar.`,
        "Buenas habilidades de comunicación y trabajo en equipo.",
        "Disponibilidad según la modalidad y jornada del puesto.",
      ],
      benefits: ["Seguro médico", "Capacitación continua", "Ambiente colaborativo"],
    }

    return withGeo(base)
  })
}

export const mockJobs: MockJob[] = [...curatedJobs.map(withGeo), ...generateJobs(38)]
