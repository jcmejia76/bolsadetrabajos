export interface MockTestimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  initials: string
  color: string
}

export const mockTestimonials: MockTestimonial[] = [
  {
    id: "testimonial-1",
    name: "Mariana López",
    role: "Frontend Engineer",
    company: "contratada vía Nimbus Tech",
    quote:
      "En dos semanas pasé de aplicar a firmar mi oferta. El proceso fue transparente en cada etapa y pude dar seguimiento a mi postulación en todo momento.",
    initials: "ML",
    color: "oklch(0.56 0.17 258)",
  },
  {
    id: "testimonial-2",
    name: "Carlos Estrada",
    role: "Head of Talent",
    company: "Vértice Financiero",
    quote:
      "Redujimos nuestro tiempo de contratación a la mitad. La calidad de los candidatos que llegan a través de la plataforma es consistentemente alta.",
    initials: "CE",
    color: "oklch(0.62 0.16 200)",
  },
  {
    id: "testimonial-3",
    name: "Andrea Villagrán",
    role: "Product Designer",
    company: "contratada vía Órbita Creativa",
    quote:
      "Me encantó poder filtrar por modalidad remota y ver el rango salarial desde el primer momento. Cero sorpresas en la entrevista final.",
    initials: "AV",
    color: "oklch(0.64 0.19 25)",
  },
]
