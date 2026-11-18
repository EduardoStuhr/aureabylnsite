export type WorkCategory = 'Todos' | 'Lash Design' | 'Fox Eyes' | 'Sobrancelhas' | 'Estúdio';

export interface StudioWorkItem {
  id: string;
  title: string;
  category: Exclude<WorkCategory, 'Todos'>;
  technique: string;
  mappingSpec: string;
  publishedLabel: string;
  serviceId: string;
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
  highlights: string[];
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
  brandName: 'ÁUREA',
  fullTitle: 'Áurea Studio Beauty',
  handle: '@aureabyln',
  founderName: 'Lorrayne Nunes',
  roleTitle: 'Lash Designer & Educadora · Embaixadora Florescer Beauty',
  city: 'Afonso Cláudio / ES',
  instagramUrl: 'https://www.instagram.com/aureabyln/',
  whatsappPhone: '',
  heroImage: import.meta.env.BASE_URL + 'assets/hero-lorrayne-cutout.png',
  instagramSpotlightImage: import.meta.env.BASE_URL + 'src/assets/images/studio_instagram_portrait_1795028764302.jpg',
  manifestoQuote:
    'Cuidar de você também é saúde, autoestima e bem-estar. Pequenos detalhes fazem grandes diferenças.',
};

export const STUDIO_METRICS = [
  {
    value: 'Lash Design',
    label: 'Volume & Fio a Fio',
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
    detail: 'Lorrayne Nunes · @aureabyln',
  },
];

export const STUDIO_WORKS: StudioWorkItem[] = [
  {
    id: 'work-volume-brasileiro',
    title: 'Volume & Definição do Olhar',
    category: 'Lash Design',
    technique: 'Volume Brasileiro Personalizado',
    mappingSpec: 'Fios tecnológicos em Y · Curvatura C · Acabamento denso e leve',
    publishedLabel: '03 nov · @aureabyln',
    serviceId: 'srv-volume-brasileiro',
    technicalNote:
      'Construção de linha superior uniforme com isolamento fio a fio preservando a saúde dos cílios naturais.',
    imageSrc: import.meta.env.BASE_URL + 'src/assets/images/work_volume_lash_1795028761250.jpg',
    imageAlt: 'Trabalho real de Volume Brasileiro realizado por Lorrayne Nunes (@aureabyln)',
  },
  {
    id: 'work-natural-claro',
    title: 'Realce Natural para Olhos Claros',
    category: 'Lash Design',
    technique: 'Fio a Fio Clássico Leve',
    mappingSpec: 'Curvatura C · Mapping aberto suave · Acabamento limpo',
    publishedLabel: '04 nov · @aureabyln',
    serviceId: 'srv-fio-a-fio',
    technicalNote:
      'Técnica clássica voltada para quem busca definição discreta, alinhamento leve e efeito natural.',
    imageSrc: import.meta.env.BASE_URL + 'src/assets/images/work_fio_claro_1795028763860.jpg',
    imageAlt: 'Trabalho real de extensão Fio a Fio em cliente de olhos claros no Áurea Studio Beauty',
  },
  {
    id: 'work-beleza-transforma',
    title: 'Beleza que Transforma — Fox Soft',
    category: 'Fox Eyes',
    technique: 'Fox Eyes & Alongamento Lateral',
    mappingSpec: 'Curvatura especial gradual · Direcionamento alongado externo',
    publishedLabel: 'Feed oficial · @aureabyln',
    serviceId: 'srv-fox-eyes',
    technicalNote:
      'Transição progressiva de comprimentos até o canto externo para criar efeito lifting imediato sem pesar.',
    imageSrc: import.meta.env.BASE_URL + 'src/assets/images/work_fox_beleza_1795028758742.jpg',
    imageAlt: 'Resultado real de Fox Eyes realizado no estúdio Áurea Studio Beauty (@aureabyln)',
  },
  {
    id: 'work-espelho-brows',
    title: 'Design Estratégico de Sobrancelhas',
    category: 'Sobrancelhas',
    technique: 'Design Personalizado & Visagismo',
    mappingSpec: 'Mapeamento facial · Pinça de precisão · Finalização natural',
    publishedLabel: '21 ago · @aureabyln',
    serviceId: 'srv-design-sobrancelhas',
    technicalNote:
      'Desenho sob medida respeitando a estrutura óssea e o caimento natural dos fios para equilibrar toda a expressão.',
    imageSrc: import.meta.env.BASE_URL + 'src/assets/images/work_espelho_brows_1795028763579.jpg',
    imageAlt: 'Cliente conferindo resultado real do design de sobrancelhas no espelho iluminado',
  },

];

export const STUDIO_SERVICES: ServiceItem[] = [
  {
    id: 'srv-volume-brasileiro',
    name: 'Volume Brasileiro',
    category: 'Cílios',
    availabilityNote: 'Consultar horários e valores',
    description:
      'Fios tecnológicos em formato Y que entregam preenchimento marcante, leveza e excelente acoplagem sem pesar no fio natural.',
    highlights: ['Mapping visagista', 'Fios em seda fosca', 'Higienização prévia inclusa'],
  },
  {
    id: 'srv-fox-eyes',
    name: 'Fox Eyes / Efeito Delineado',
    category: 'Cílios',
    availabilityNote: 'Consultar horários e valores',
    description:
      'Direcionamento estratégico no canto externo para alongar e levantar o olhar com sofisticação e acabamento leve.',
    highlights: ['Curvatura especial', 'Efeito lifting imediato', 'Acabamento sem excessos'],
  },
  {
    id: 'srv-fio-a-fio',
    name: 'Fio a Fio Clássico',
    category: 'Cílios',
    availabilityNote: 'Consultar horários e valores',
    description:
      'Um fio acoplado a cada cílio natural saudável. Ideal para quem busca naturalidade refinada com efeito de máscara de cílios.',
    highlights: ['Máxima naturalidade', 'Isolamento preservado', 'Conforto absoluto'],
  },
  {
    id: 'srv-brow-lamination',
    name: 'Brow Lamination',
    category: 'Sobrancelhas',
    availabilityNote: 'Consultar horários e valores',
    description:
      'Alinhamento e cuidado dos fios naturais das sobrancelhas, criando volume elegante, controle de direcionamento e simetria.',
    highlights: ['Design na pinça', 'Alinhamento direcionado', 'Aspecto encorpado natural'],
  },
  {
    id: 'srv-design-sobrancelhas',
    name: 'Design de Sobrancelhas',
    category: 'Sobrancelhas',
    availabilityNote: 'Consultar horários e valores',
    description:
      'Mapeamento personalizado respeitando a estrutura do rosto e o desenho natural dos fios para valorizar toda a expressão.',
    highlights: ['Mapeamento facial', 'Acabamento preciso', 'Cuidado individualizado'],
  },
  {
    id: 'srv-curso-lash',
    name: 'Curso VIP de Lash Design',
    category: 'Formação',
    availabilityNote: 'Consultar datas e investimento',
    description:
      'Formação prática presencial com Lorrayne Nunes (Embaixadora Florescer Beauty). Do isolamento seguro ao posicionamento profissional.',
    highlights: ['Material de apoio', 'Prática orientada', 'Mentoria presencial'],
  },
];

export const BOOKING_ADDONS: AddOnItem[] = [
  {
    id: 'addon-sobrancelha',
    name: 'Incluir Design de Sobrancelhas no mesmo atendimento',
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
    category: 'Manifesto Áurea',
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
