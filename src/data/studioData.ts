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
  category: 'Cílios' | 'Sobrancelhas' | 'Formação';
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
  whatsappPhone: '',
  heroImage: import.meta.env.BASE_URL + 'assets/hero-lorrayne-cutout.png',
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
    id: 'sereia',
    title: 'Efeito sereia',
    category: 'Cílios',
    technicalNote: 'Comprimentos que se alongam em direção à lateral do olhar.',
    imageSrc: portfolio + 'sereia.webp',
    imageAlt: 'Resultado de efeito sereia no estúdio ÁURA',
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

export const STUDIO_SERVICES: ServiceItem[] = STUDIO_WORKS.map(work => ({
  id: 'srv-' + work.id,
  name: work.title,
  category: work.category,
  availabilityNote: 'Consultar horários e valores',
  description: work.technicalNote,
}));

export const STUDIO_COURSE: ServiceItem = {
  id: 'srv-curso-lash',
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
