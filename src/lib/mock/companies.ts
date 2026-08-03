export interface MockCompany {
  slug: string
  name: string
  initials: string
  color: string
  industry: string
  location: string
  jobCount: number
  employeeRange: string
  verified: boolean
  description: string
  longDescription: string
  foundedYear: number
  website: string
  email: string
  phone: string
  address: string
  benefits: string[]
}

export const mockCompanies: MockCompany[] = [
  {
    slug: "nimbus-tech",
    name: "Nimbus Tech",
    initials: "NT",
    color: "oklch(0.56 0.17 258)",
    industry: "Tecnología",
    location: "Ciudad de Guatemala",
    jobCount: 12,
    employeeRange: "201-500",
    verified: true,
    description:
      "Construimos infraestructura en la nube para empresas que escalan rápido en toda Latinoamérica.",
    longDescription:
      "Nimbus Tech desarrolla infraestructura en la nube para empresas que necesitan escalar sin fricción. Nuestro equipo distribuido trabaja con las últimas tecnologías para dar soporte a miles de aplicaciones críticas en toda la región. Creemos en la autonomía de los equipos, el código abierto y en construir productos que perduren.",
    foundedYear: 2016,
    website: "nimbustech.io",
    email: "hola@nimbustech.io",
    phone: "+502 2345 6789",
    address: "Torre Innova, Zona 10, Ciudad de Guatemala",
    benefits: [
      "Seguro médico privado",
      "Horario flexible",
      "100% remoto opcional",
      "Presupuesto de aprendizaje",
      "Bono por desempeño",
      "Equipo proporcionado",
    ],
  },
  {
    slug: "vertice-financiero",
    name: "Vértice Financiero",
    initials: "VF",
    color: "oklch(0.62 0.16 200)",
    industry: "Finanzas",
    location: "Ciudad de Guatemala",
    jobCount: 8,
    employeeRange: "501-1000",
    verified: true,
    description:
      "Servicios financieros digitales enfocados en inclusión y crecimiento para pymes.",
    longDescription:
      "Vértice Financiero es una fintech dedicada a democratizar el acceso a servicios financieros para pequeñas y medianas empresas en Centroamérica. Combinamos tecnología y análisis de datos para ofrecer crédito justo y herramientas de gestión financiera a miles de negocios cada año.",
    foundedYear: 2011,
    website: "verticefinanciero.com",
    email: "contacto@verticefinanciero.com",
    phone: "+502 2456 7890",
    address: "Avenida Reforma 12-34, Zona 9, Ciudad de Guatemala",
    benefits: [
      "Seguro médico y de vida",
      "Bono anual por desempeño",
      "Capacitación continua",
      "Plan de carrera interno",
      "Días de vacaciones adicionales",
    ],
  },
  {
    slug: "salud-integral",
    name: "Salud Integral",
    initials: "SI",
    color: "oklch(0.6 0.15 150)",
    industry: "Salud",
    location: "Quetzaltenango",
    jobCount: 15,
    employeeRange: "1000+",
    verified: true,
    description:
      "Red de clínicas y hospitales comprometidos con la atención médica de calidad.",
    longDescription:
      "Salud Integral opera una red de clínicas y hospitales enfocados en llevar atención médica de calidad a más comunidades en Guatemala. Invertimos constantemente en tecnología médica y en el desarrollo profesional de nuestro personal de salud para ofrecer el mejor cuidado posible.",
    foundedYear: 1998,
    website: "saludintegral.gt",
    email: "recursoshumanos@saludintegral.gt",
    phone: "+502 7761 2345",
    address: "6a Calle 15-20, Zona 3, Quetzaltenango",
    benefits: [
      "Seguro médico familiar",
      "Bono de turno nocturno",
      "Capacitaciones médicas continuas",
      "Estabilidad laboral",
      "Convenios con universidades",
    ],
  },
  {
    slug: "orbita-creativa",
    name: "Órbita Creativa",
    initials: "OC",
    color: "oklch(0.64 0.19 25)",
    industry: "Marketing y Publicidad",
    location: "Remoto",
    jobCount: 6,
    employeeRange: "11-50",
    verified: false,
    description:
      "Agencia creativa que ayuda a marcas a contar historias memorables en cada canal.",
    longDescription:
      "Órbita Creativa es una agencia 100% remota que ayuda a marcas de toda Latinoamérica a contar historias memorables. Desde estrategia de contenido hasta producción audiovisual y pauta digital, nuestro equipo multidisciplinario combina creatividad y datos en cada campaña.",
    foundedYear: 2019,
    website: "orbitacreativa.agency",
    email: "hola@orbitacreativa.agency",
    phone: "+502 5678 1234",
    address: "Equipo 100% remoto",
    benefits: [
      "Horario 100% flexible",
      "Proyectos con marcas reconocidas",
      "Pagos puntuales quincenales",
      "Cultura remota real",
    ],
  },
  {
    slug: "logitrans",
    name: "LogiTrans",
    initials: "LT",
    color: "oklch(0.58 0.14 80)",
    industry: "Logística",
    location: "Escuintla",
    jobCount: 9,
    employeeRange: "201-500",
    verified: true,
    description:
      "Soluciones de transporte y cadena de suministro para el comercio centroamericano.",
    longDescription:
      "LogiTrans conecta a productores y comercios de toda Centroamérica con soluciones de transporte confiables. Con una flota moderna y tecnología de rastreo en tiempo real, optimizamos cada ruta para que la mercadería llegue a tiempo, siempre.",
    foundedYear: 2005,
    website: "logitrans.com.gt",
    email: "operaciones@logitrans.com.gt",
    phone: "+502 7889 4567",
    address: "Km 58 Carretera al Pacífico, Escuintla",
    benefits: [
      "Bono por cumplimiento de metas",
      "Seguro médico",
      "Capacitación en gestión logística",
      "Vehículo de la empresa",
    ],
  },
  {
    slug: "eduplus",
    name: "EduPlus",
    initials: "EP",
    color: "oklch(0.55 0.18 300)",
    industry: "Educación",
    location: "Ciudad de Guatemala",
    jobCount: 5,
    employeeRange: "51-200",
    verified: false,
    description:
      "Plataforma educativa que conecta estudiantes con instructores expertos en línea.",
    longDescription:
      "EduPlus es una plataforma educativa que conecta a miles de estudiantes con instructores expertos a través de clases virtuales en vivo. Nuestra misión es hacer la educación de calidad accesible para cualquier persona, sin importar dónde viva.",
    foundedYear: 2020,
    website: "eduplus.education",
    email: "instructores@eduplus.education",
    phone: "+502 4567 8901",
    address: "12 Avenida 8-45, Zona 14, Ciudad de Guatemala",
    benefits: [
      "Horario a medio tiempo disponible",
      "Material didáctico proporcionado",
      "Pagos mensuales puntuales",
      "Posibilidad de crecer a tiempo completo",
    ],
  },
]
