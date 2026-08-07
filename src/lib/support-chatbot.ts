export interface ChatTopic {
  id: string;
  label: string;
  /** Short caption for the quick-reply chip — the full `label` is still used as the transcript text. */
  shortLabel: string;
  keywords: string[];
  answer: string;
}

export const CHAT_TOPICS: ChatTopic[] = [
  {
    id: "crear-cuenta",
    label: "Crear una cuenta",
    shortLabel: "Crear cuenta",
    keywords: [
      "crear cuenta",
      "registrar",
      "registrarme",
      "registro",
      "cuenta nueva",
      "inscribirme",
      "afiliarme",
      "abrir cuenta",
      "hacer una cuenta",
      "unirme",
      "empezar",
      "como me registro",
    ],
    answer:
      'Para crear una cuenta, ve a "Registrarse" en la esquina superior derecha. Puedes elegir "Soy candidato" si buscas empleo, o "Soy empresa" si quieres publicar vacantes. Las cuentas de empresa deben ser aprobadas por un administrador antes de poder publicar ofertas.',
  },
  {
    id: "postularme",
    label: "Postularme a una vacante",
    shortLabel: "Postularme",
    keywords: [
      "postular",
      "postularme",
      "aplicar",
      "postulacion",
      "postulación",
      "aplicación",
      "enviar cv a una vacante",
      "mandar mi cv",
      "como aplico",
      "como me postulo",
      "solicitar empleo",
      "solicitar trabajo",
    ],
    answer:
      'Busca vacantes en la sección "Empleos", abre la que te interese y haz clic en "Aplicar ahora". Necesitas tener un CV subido o generado en tu cuenta de candidato para poder postularte.',
  },
  {
    id: "cv",
    label: "Subir o generar mi CV",
    shortLabel: "Mi CV",
    keywords: [
      "cv",
      "curriculum",
      "currículum",
      "subir cv",
      "generar cv",
      "crear cv",
      "hacer mi cv",
      "resumen profesional",
      "subir mi resume",
      "cargar cv",
      "adjuntar cv",
    ],
    answer:
      'Desde tu panel de candidato, entra a "Mis CVs". Ahí puedes subir un archivo PDF/Word ya existente, o generar uno automáticamente a partir de los datos de tu perfil. Un administrador revisa cada CV antes de aprobarlo.',
  },
  {
    id: "estado-postulaciones",
    label: "Ver el estado de mis postulaciones",
    shortLabel: "Mis postulaciones",
    keywords: [
      "estado de mi postulacion",
      "seguimiento",
      "donde veo mis postulaciones",
      "postulaciones enviadas",
      "en que va mi postulacion",
      "me contrataron",
      "respuesta de la empresa",
      "avance de mi postulacion",
    ],
    answer:
      'Puedes ver todas tus postulaciones y su estado (recibida, en revisión, entrevista, etc.) en "Postulaciones" dentro de tu panel de candidato.',
  },
  {
    id: "favoritos",
    label: "Guardar vacantes favoritas",
    shortLabel: "Favoritos",
    keywords: [
      "favoritos",
      "guardar vacante",
      "guardar empleo",
      "guardar oferta",
      "marcar vacante",
      "vacantes guardadas",
    ],
    answer:
      'Usa el ícono de marcador en cualquier vacante para guardarla. Puedes ver todas tus vacantes guardadas en "Favoritos" dentro de tu panel de candidato.',
  },
  {
    id: "publicar-vacante",
    label: "Publicar una vacante (empresa)",
    shortLabel: "Publicar vacante",
    keywords: [
      "publicar vacante",
      "publicar oferta",
      "crear vacante",
      "crear oferta",
      "empresa contratar",
      "subir una vacante",
      "anunciar un puesto",
      "abrir una vacante",
      "como publico",
      "quiero contratar",
    ],
    answer:
      'Desde tu panel de empresa, entra a "Ofertas" y haz clic en "Publicar nueva oferta". Tu empresa debe estar aprobada por un administrador, y cada oferta también pasa por un proceso de revisión antes de ser visible públicamente.',
  },
  {
    id: "equipo-empresa",
    label: "Invitar a mi equipo (empresa)",
    shortLabel: "Invitar equipo",
    keywords: [
      "invitar equipo",
      "agregar usuario empresa",
      "staff",
      "colaboradores",
      "invitar compañero",
      "agregar reclutador",
      "sumar a alguien de mi empresa",
    ],
    answer:
      'Desde tu panel de empresa, entra a "Equipo" y usa el botón "Invitar" para agregar a otras personas que te ayuden a gestionar ofertas y postulaciones.',
  },
  {
    id: "editar-perfil",
    label: "Editar mi perfil o mi empresa",
    shortLabel: "Editar perfil",
    keywords: [
      "editar perfil",
      "actualizar datos",
      "cambiar informacion",
      "editar empresa",
      "actualizar mi perfil",
      "cambiar mis datos",
      "editar mi informacion",
      "modificar perfil",
    ],
    answer:
      'Los candidatos pueden editar su perfil en "Mi Perfil", y las empresas en "Mi Empresa", ambos dentro de su panel respectivo.',
  },
  {
    id: "contrasena",
    label: "Cambiar u olvidé mi contraseña",
    shortLabel: "Contraseña",
    keywords: [
      "contraseña",
      "password",
      "olvide mi clave",
      "no puedo entrar",
      "recuperar cuenta",
      "no puedo iniciar sesion",
      "no me deja entrar",
      "cambiar clave",
      "resetear contraseña",
      "olvide mi contraseña",
    ],
    answer:
      'Para cambiar tu contraseña estando en sesión, ve a "Mi Cuenta" dentro de tu panel. Actualmente no existe un enlace de "recuperar contraseña" automático — si no puedes iniciar sesión, usa la opción de "Reportar un problema técnico" aquí abajo y un administrador te ayudará.',
  },
  {
    id: "aprobacion",
    label: "Cómo funciona la aprobación de empresas y ofertas",
    shortLabel: "Aprobación",
    keywords: [
      "aprobacion",
      "aprobación",
      "revision",
      "revisión",
      "por que no se ve mi vacante",
      "por que no se ve mi empresa",
      "cuanto tarda la aprobacion",
      "mi empresa no aparece",
      "mi vacante no aparece",
      "sigue pendiente",
      "cuando aprueban",
    ],
    answer:
      'Para mantener la calidad de la plataforma, cada empresa nueva y cada vacante publicada pasan por una revisión de un administrador antes de aparecer públicamente. Esto puede tardar un poco — si crees que tu caso lleva demasiado tiempo, usa la opción de "Reportar un problema técnico".',
  },
];

const GREETING_PATTERNS = [
  "hola",
  "buenas",
  "buenos dias",
  "buenas tardes",
  "buenas noches",
  "que tal",
  "hey",
  "saludos",
  "buen dia",
];

const THANKS_PATTERNS = ["gracias", "muchas gracias", "mil gracias", "te agradezco", "genial gracias"];

const REPORT_INTENT_PATTERNS = [
  "reportar",
  "reporte",
  "quiero reportar",
  "hacer un reporte",
  "problema tecnico",
  "problema técnico",
  "tengo un problema",
  "tengo un error",
  "encontre un error",
  "encontré un error",
  "hay un error",
  "me sale un error",
  "esto no funciona",
  "no me funciona",
  "algo no funciona",
  "no esta funcionando",
  "no está funcionando",
  "esta roto",
  "está roto",
  "se rompio",
  "se rompió",
  "un bug",
  "hay un bug",
  "fallo en",
  "falla en",
  "algo salio mal",
  "algo salió mal",
  "algo esta mal",
  "algo está mal",
];

/** True when the message signals the user wants to file a technical report, phrased freely (not via the quick-reply button). */
export function isReportIntent(message: string): boolean {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return REPORT_INTENT_PATTERNS.some((pattern) => normalized.includes(pattern));
}

const FAREWELL_PATTERNS = ["adios", "hasta luego", "nos vemos", "chao", "bye"];

/** Casual openers/closers that deserve a warm reply instead of "no entendí". */
export function matchSmallTalk(message: string): string | null {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

  if (FAREWELL_PATTERNS.some((p) => normalized.includes(p))) {
    return "¡Hasta luego! Si necesitas algo más, aquí estaré.";
  }
  if (THANKS_PATTERNS.some((p) => normalized.includes(p))) {
    return "¡De nada! ¿Necesitas algo más?";
  }
  if (GREETING_PATTERNS.some((p) => normalized === p || normalized.startsWith(`${p} `) || normalized.startsWith(`${p},`))) {
    return "¡Hola! Cuéntame qué necesitas y te ayudo.";
  }
  return null;
}

const JOB_SPECIFIC_PATTERNS = [
  "esta vacante",
  "esa vacante",
  "esta oferta",
  "esa oferta",
  "este puesto",
  "ese puesto",
  "este empleo",
  "ese empleo",
  "cuanto paga",
  "cuánto paga",
  "el salario de",
  "el sueldo de",
  "esta empresa contrata",
  "es legitima esta",
  "es real esta",
  "por que me rechazaron",
  "por qué me rechazaron",
  "quien publico esta",
  "quién publicó esta",
];

/** True when the message looks like it's asking about a specific job posting rather than the platform in general. */
export function isLikelyJobSpecificQuestion(message: string): boolean {
  const normalized = message.toLowerCase();
  return JOB_SPECIFIC_PATTERNS.some((pattern) => normalized.includes(pattern));
}

const STOPWORDS = new Set([
  "de",
  "la",
  "el",
  "los",
  "las",
  "en",
  "y",
  "o",
  "a",
  "que",
  "un",
  "una",
  "es",
  "mi",
  "mis",
  "tu",
  "tus",
  "su",
  "sus",
  "para",
  "por",
  "con",
  "sin",
  "del",
  "al",
  "se",
  "lo",
  "le",
  "les",
  "como",
  "cómo",
  "cual",
  "cuál",
  "donde",
  "dónde",
  "quiero",
  "quisiera",
  "necesito",
  "necesita",
  "podria",
  "podría",
  "puedo",
  "puedes",
  "tengo",
  "tiene",
  "hay",
  "ayuda",
  "ayudar",
  "favor",
  "porfa",
  "porfavor",
  "saber",
  "sobre",
  "esta",
  "este",
  "esa",
  "ese",
  "eso",
  "esto",
  "hacer",
  "hago",
  "ser",
  "soy",
  "estoy",
  "me",
]);

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

/** Simple keyword-overlap matcher — no external calls, just local string matching. */
export function matchTopic(message: string): ChatTopic | null {
  const words = new Set(normalizeWords(message));
  if (words.size === 0) return null;

  let best: { topic: ChatTopic; score: number } | null = null;
  for (const topic of CHAT_TOPICS) {
    let score = 0;
    for (const keyword of topic.keywords) {
      const keywordWords = normalizeWords(keyword);
      const allPresent = keywordWords.every((kw) => [...words].some((w) => w.includes(kw) || kw.includes(w)));
      if (allPresent) score += keywordWords.length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { topic, score };
    }
  }
  return best?.topic ?? null;
}
