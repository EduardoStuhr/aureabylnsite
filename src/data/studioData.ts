export type WorkCategory = 'Todos' | 'Cílios' | 'Sobrancelhas';

export interface StudioWorkItem {
  id: string;
  title: string;
  category: Exclude<WorkCategory, 'Todos'>;
  secondImage?: string;
  technicalNote: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Cílios' | 'Sobrancelhas' | 'Manutenção' | 'Complementares' | 'Formação';
  priceCents: number | null;
  durationMinutes: number | null;
  workId?: string;
  availabilityNote: string;
  description: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  detail: string;
}

export interface FeedMoment {
  id: string;
  dateLabel: string;
  title: string;
  caption: string;
  category: string;
}

export const STUDIO_PROFILE = {
  brandName: 'ÁURA',
  fullTitle: 'ÁURA Studio Beauty',
  handle: '@aurabyln',
  founderName: 'Lorrayne Nunes',
  roleTitle: 'Lash Designer & Educadora · Embaixadora Florescer Beauty',
  city: 'Afonso Cláudio / ES',
  instagramUrl: 'https://www.instagram.com/aurabyln/',
  whatsappPhone: '+55 27 99920-2100',
  heroImage: import.meta.env.BASE_URL + 'assets/hero-lorrayne-cutout.webp',
  instagramSpotlightImage: import.meta.env.BASE_URL + 'src/assets/images/studio_instagram_portrait_1795028764302.jpg',
  manifestoQuote:
    'Cuidar de você também é saúde, autoestima e bem-estar. Pequenos detalhes fazem grandes diferenças.',
};

export const STUDIO_METRICS = [
  {
    value: 'Lash Design',
    label: 'Volumes & efeitos',
    detail: 'Curvatura desenhada para o seu olhar',
  },
  {
    value: 'Sobrancelhas',
    label: 'Design & Visagismo',
    detail: 'Simetria natural respeitando seus fios',
  },
  {
    value: 'Turmas',
    label: 'Curso de Lash Design',
    detail: 'Formação presencial em Afonso Cláudio',
  },
  {
    value: 'Florescer',
    label: 'Embaixadora Beauty',
    detail: 'Lorrayne Nunes · @aurabyln',
  },
];

const portfolio = import.meta.env.BASE_URL + 'assets/portfolio/';

export const STUDIO_WORKS: StudioWorkItem[] = [
  {
    id: 'design',
    title: 'Design personalizado',
    category: 'Sobrancelhas',
    technicalNote: 'Desenho que acompanha o arco e a direção natural dos fios.',
    imageSrc: portfolio + 'design.webp',
    imageAlt: 'Resultado de design personalizado no estúdio ÁURA',
  },
  {
    id: 'henna',
    title: 'Design personalizado com henna',
    category: 'Sobrancelhas',
    technicalNote: 'Preenchimento com henna para dar definição ao contorno.',
    imageSrc: portfolio + 'henna.webp',
    imageAlt: 'Resultado de design personalizado com henna no estúdio ÁURA',
  },
  {
    id: 'hibrido',
    title: 'Volume híbrido',
    category: 'Cílios',
    technicalNote: 'Fios individuais e leques criam uma textura de densidades variadas.',
    imageSrc: portfolio + 'hibrido.webp',
    imageAlt: 'Resultado de volume híbrido no estúdio ÁURA',
  },
  {
    id: 'egipcio',
    title: 'Volume egípcio',
    category: 'Cílios',
    technicalNote: 'Volume distribuído ao longo da linha dos cílios.',
    imageSrc: portfolio + 'egipcio.webp',
    imageAlt: 'Resultado de volume egípcio no estúdio ÁURA',
    secondImage: portfolio + 'egipcio-perfil.webp',
  },
  {
    id: 'fox',
    title: 'Efeito fox',
    category: 'Cílios',
    technicalNote: 'Ênfase no canto externo para um desenho alongado.',
    imageSrc: portfolio + 'fox.webp',
    imageAlt: 'Resultado de efeito fox no estúdio ÁURA',
  },
  {
    id: 'anime',
    title: 'Efeito anime',
    category: 'Cílios',
    technicalNote: 'Mechas mais longas se destacam entre fios curtos.',
    imageSrc: portfolio + 'anime.webp',
    imageAlt: 'Resultado de efeito anime no estúdio ÁURA',
  },
  {
    id: 'brown',
    title: 'Volume brown',
    category: 'Cílios',
    technicalNote: 'Fios em tons de marrom dão suavidade ao contorno dos olhos.',
    imageSrc: portfolio + 'brown.webp',
    imageAlt: 'Resultado de volume brown no estúdio ÁURA',
  },
];

export const STUDIO_SERVICES: ServiceItem[] = [
  { id: 'srv-egipcio-classico', name: 'Egípcio', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-brasileiro', name: 'Brasileiro', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-hibrido-classico', name: 'Híbrido', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-egipcio', name: 'Volume egípcio', category: 'Cílios', priceCents: 14500, durationMinutes: 120, workId: 'egipcio',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'egipcio')!.technicalNote },
  { id: 'srv-volume-brasileiro', name: 'Volume brasileiro', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-hibrido', name: 'Volume híbrido', category: 'Cílios', priceCents: 15000, durationMinutes: 120, workId: 'hibrido',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'hibrido')!.technicalNote },
  { id: 'srv-fox', name: 'Fox Eyes', category: 'Cílios', priceCents: 16000, durationMinutes: 120, workId: 'fox',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'fox')!.technicalNote },
  { id: 'srv-fio-a-fio', name: 'Fio a fio', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-rimel', name: 'Efeito rímel', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-wispy', name: 'Efeito wispy', category: 'Cílios', priceCents: 16000, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-fans', name: 'Volume com fans', category: 'Cílios', priceCents: 14500, durationMinutes: 120,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-anime', name: 'Efeito anime', category: 'Cílios', priceCents: 16000, durationMinutes: 120, workId: 'anime',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'anime')!.technicalNote },
  { id: 'srv-manutencao', name: 'Manutenção', category: 'Manutenção', priceCents: 12000, durationMinutes: 90,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-manutencao-wispy-fans', name: 'Manutenção de wispy e volume com fans', category: 'Manutenção', priceCents: 15000, durationMinutes: 90,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-henna', name: 'Design personalizado com henna', category: 'Sobrancelhas', priceCents: 4000, durationMinutes: 60, workId: 'henna',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'henna')!.technicalNote },
  { id: 'srv-design-simples', name: 'Design simples', category: 'Sobrancelhas', priceCents: 3000, durationMinutes: 30,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-buco', name: 'Epilação de buço', category: 'Complementares', priceCents: 1000, durationMinutes: 15,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-spa-labios', name: 'Spa dos lábios', category: 'Complementares', priceCents: 1500, durationMinutes: 20,
    availabilityNote: 'Consultar disponibilidade', description: '' },
  { id: 'srv-design', name: 'Design personalizado', category: 'Sobrancelhas', priceCents: null, durationMinutes: null, workId: 'design',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'design')!.technicalNote },
  { id: 'srv-brown', name: 'Volume brown', category: 'Cílios', priceCents: 14500, durationMinutes: null, workId: 'brown',
    availabilityNote: 'Consultar disponibilidade', description: STUDIO_WORKS.find(work => work.id === 'brown')!.technicalNote },
];

export const STUDIO_COURSE: ServiceItem = {
  id: 'srv-curso-lash',
  priceCents: null,
  durationMinutes: null,
  name: 'Curso VIP de Lash Design',
  category: 'Formação',
  availabilityNote: 'Consultar datas e investimento',
  description:
    'Formação prática presencial com Lorrayne Nunes (Embaixadora Florescer Beauty). Do isolamento seguro ao posicionamento profissional.',
};

export const BOOKING_ADDONS: AddOnItem[] = [
  {
    id: 'addon-sobrancelha',
    name: 'Incluir Design personalizado no mesmo atendimento',
    detail: 'Combo cílios + sobrancelhas',
  },
  {
    id: 'addon-remocao',
    name: 'Preciso de remoção de extensão anterior',
    detail: 'Avaliação segura no estúdio',
  },
];

export const INSTAGRAM_MOMENTS: FeedMoment[] = [
  {
    id: 'ig-1',
    dateLabel: '30 set',
    title: 'Terapia é importante. Mas você já marcou o seu cílios?',
    caption: 'Cuidar de você também é saúde, autoestima e bem-estar. Pequenos detalhes fazem grandes diferenças.',
    category: 'Manifesto ÁURA',
  },
  {
    id: 'ig-2',
    dateLabel: '27 jul',
    title: 'Curso de Lash Design · Turmas Abertas',
    caption: 'Transforme sua paixão pela beleza em uma profissão de sucesso. Invista em você, realize seu sonho.',
    category: 'Educação',
  },
  {
    id: 'ig-3',
    dateLabel: '03 jul',
    title: 'Embaixadora Florescer Beauty',
    caption: 'Lorrayne Nunes — Lash designer e educadora levando técnica, constância e excelência ao Espírito Santo.',
    category: 'Reconhecimento',
  },
  {
    id: 'ig-4',
    dateLabel: '08 jul',
    title: 'Não é sorte. É preparação, disciplina e constância.',
    caption: 'Seja a profissional que você admira. Formação contínua para resultados impecáveis.',
    category: 'Mentalidade',
  },
];
