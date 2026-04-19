import type { SiteFeature } from "../types/models";

/** Shown when Firestore `site/settings` is missing or partial. */
export const DEFAULT_SITE_FEATURES: SiteFeature[] = [
  {
    title: "Agende em segundos",
    body: "Escolha horário, serviço e manicure próxima a você sem complicação.",
  },
  {
    title: "Profissionais avaliadas",
    body: "Portfólio, avaliações reais e histórico de atendimentos para decidir com confiança.",
  },
  {
    title: "Pagamento seguro",
    body: "Pix, cartão e recibos — seus dados protegidos do início ao fim.",
  },
];

export const DEFAULT_SITE_COPY = {
  heroBadge: "Beleza sob demanda",
  heroTitle: "Manicure onde você estiver, com quem você confia.",
  heroSubtitle:
    "Conectamos você a manicures verificadas. Design limpo, fluxo rápido e uma experiência que parece nativa no celular — e ainda assim cresce no desktop.",
  heroImageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85",
  statAgenda: "24/7",
  statRating: "4.9",
  statCities: "120+",
  featuresSectionTitle: "Tudo o que você precisa em um só lugar",
  featuresSectionSubtitle:
    "Agenda, perfis verificados e gestão centralizada para sua equipe no painel administrativo.",
  contactSectionTitle: "Fale com a Divas",
  contactSectionIntro:
    "Envie uma mensagem — nossa equipe responde pelo painel quando possível.",
} as const;
