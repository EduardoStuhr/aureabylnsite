export type ClientCategory = 'Todos' | 'Lash Design' | 'Fox Eyes' | 'Sobrancelhas';

export interface ClientShowcaseItem {
  id: string;
  clientName: string;
  city: string;
  category: Exclude<ClientCategory, 'Todos'>;
  technique: string;
  mappingSpec: string;
  retention: string;
  durationMinutes: number;
  serviceId: string;
  quote: string;
  imageSrc: string;
  imageAlt: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Cílios' | 'Sobrancelhas' | 'Formação';
  priceBRL: number;
  durationMinutes: number;
  maintenanceInfo: string;
  description: string;
  highlights: string[];
}

export interface AddOnItem {
  id: string;
  name: string;
  priceBRL: number;
  durationMinutes: number;
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
  whatsappPhone: '5527999990000',
  heroImage: '/assets/aistudio/image_fa1a6dd6.png',
  feedBoardImage: '/assets/aistudio/image_26f8e3f4.png',
  manifestoQuote:
    'Cuidar de você também é saúde, autoestima e bem-estar. Pequenos detalhes fazem grandes diferenças.',
};

export const STUDIO_METRICS = [
  {
    value: '+480',
    label: 'Olhares transformados',
    detail: 'Atendimentos com visagismo individual',
  },
  {
    value: '35 dias',
    label: 'Retenção média real',
    detail: 'Fios tecnológicos e isolamento seguro',
  },
  {
    value: '100%',
    label: 'Mapping exclusivo',
    detail: 'Curvatura desenhada para seu rosto',
  },
  {
    value: 'Turmas',
    label: 'Curso de Lash Design',
    detail: 'Embaixadora Florescer Beauty',
  },
];

export const CLIENT_SHOWCASE: ClientShowcaseItem[] = [
  {
    id: 'client-camila',
    clientName: 'Camila Ferreira',
    city: 'Afonso Cláudio · ES',
    category: 'Lash Design',
    technique: 'Volume Brasileiro Personalizado',
    mappingSpec: 'Curvatura C · Tamanhos 8–12mm · Efeito Boneca Suave',
    retention: 'Retenção 32 dias',
    durationMinutes: 120,
    serviceId: 'srv-volume-brasileiro',
    quote:
      'Acordar pronta todos os dias sem precisar de rímel mudou minha rotina. O isolamento é tão leve que nem sinto que estou de extensão.',
    imageSrc: '/src/assets/images/client_lash_volume_1795019859471.jpg',
    imageAlt: 'Camila Ferreira com extensão de cílios Volume Brasileiro no Áurea Studio Beauty',
    featured: true,
  },
  {
    id: 'client-mariana',
    clientName: 'Mariana Costa',
    city: 'Afonso Cláudio · ES',
    category: 'Fox Eyes',
    technique: 'Fox Eyes & Delineado Sutil',
    mappingSpec: 'Curvatura L/M · Tamanhos 7–13mm · Alongamento Lateral',
    retention: 'Retenção 30 dias',
    durationMinutes: 130,
    serviceId: 'srv-fox-eyes',
    quote:
      'Eu queria um olhar mais marcante e alongado, sem perder a elegância natural. A Lorrayne acertou o desenho logo no primeiro atendimento.',
    imageSrc: '/src/assets/images/client_fox_eyes_1795019864863.jpg',
    imageAlt: 'Mariana Costa admirando resultado Fox Eyes no espelho do estúdio',
  },
  {
    id: 'client-beatriz',
    clientName: 'Beatriz Alvarenga',
    city: 'Venda Nova · ES',
    category: 'Sobrancelhas',
    technique: 'Brow Lamination + Design Estratégico',
    mappingSpec: 'Alinhamento de fios · Nutrição com queratina · Acabamento natural',
    retention: 'Duração 45 dias',
    durationMinutes: 60,
    serviceId: 'srv-brow-lamination',
    quote:
      'Minhas sobrancelhas ficaram encorpadas e simétricas mantendo a textura natural. O cuidado com cada fio faz toda a diferença.',
    imageSrc: '/src/assets/images/client_brow_design_1795019872373.jpg',
    imageAlt: 'Beatriz Alvarenga com Brow Lamination e design estratégico de sobrancelhas',
  },
  {
    id: 'client-julia',
    clientName: 'Júlia Motta',
    city: 'Afonso Cláudio · ES',
    category: 'Lash Design',
    technique: 'Fio a Fio Clássico Elegante',
    mappingSpec: 'Curvatura C · Espessura 0.15 · Efeito Rímel Leve',
    retention: 'Retenção 28 dias',
    durationMinutes: 105,
    serviceId: 'srv-fio-a-fio',
    quote:
      'Perfeito para meu trabalho e dia a dia: realça o olhar com discrição e extrema delicadeza.',
    imageSrc: '/src/assets/images/client_lash_volume_1795019859471.jpg',
    imageAlt: 'Júlia Motta com técnica Fio a Fio Clássico',
  },
  {
    id: 'client-larissa',
    clientName: 'Larissa Teixeira',
    city: 'Laranja da Terra · ES',
    category: 'Fox Eyes',
    technique: 'Volume Egípcio Fox',
    mappingSpec: 'Fios 3D em W · Curvatura M · Efeito Gatinho Alongado',
    retention: 'Retenção 35 dias',
    durationMinutes: 135,
    serviceId: 'srv-fox-eyes',
    quote:
      'Faço manutenção há mais de um ano com a Lorrayne. Meus cílios naturais continuam saudáveis e o resultado sempre recebe elogios.',
    imageSrc: '/src/assets/images/client_fox_eyes_1795019864863.jpg',
    imageAlt: 'Larissa Teixeira com Volume Egípcio Fox no Áurea Studio Beauty',
  },
  {
    id: 'client-rafaela',
    clientName: 'Rafaela Dias',
    city: 'Afonso Cláudio · ES',
    category: 'Sobrancelhas',
    technique: 'Design Personalizado com Henna',
    mappingSpec: 'Visagismo facial · Pigmentação degradê · Pinça de precisão',
    retention: 'Duração 15 dias',
    durationMinutes: 45,
    serviceId: 'srv-design-sobrancelhas',
    quote:
      'Fazer sobrancelhas aqui é realmente um momento de terapia. Saio renovada e com a autoestima lá em cima.',
    imageSrc: '/src/assets/images/client_brow_design_1795019872373.jpg',
    imageAlt: 'Rafaela Dias com Design Personalizado de Sobrancelhas',
  },
];

export const STUDIO_SERVICES: ServiceItem[] = [
  {
    id: 'srv-volume-brasileiro',
    name: 'Volume Brasileiro',
    category: 'Cílios',
    priceBRL: 165,
    durationMinutes: 120,
    maintenanceInfo: 'Manutenção a partir de 15–21 dias',
    description:
      'Fios tecnológicos em formato Y que entregam preenchimento marcante, leveza extrema e retenção superior sem pesar no fio natural.',
    highlights: ['Mapping visagista', 'Fios em seda fosca', 'Higienização prévia inclusa'],
  },
  {
    id: 'srv-fox-eyes',
    name: 'Fox Eyes / Efeito Delineado',
    category: 'Cílios',
    priceBRL: 180,
    durationMinutes: 130,
    maintenanceInfo: 'Manutenção a partir de 15–21 dias',
    description:
      'Direcionamento estratégico com curvatura L ou M no canto externo para alongar e levantar o olhar com sofisticação.',
    highlights: ['Curvatura especial L/M', 'Efeito lifting imediato', 'Acabamento sem excessos'],
  },
  {
    id: 'srv-fio-a-fio',
    name: 'Fio a Fio Clássico',
    category: 'Cílios',
    priceBRL: 140,
    durationMinutes: 105,
    maintenanceInfo: 'Manutenção a partir de 15–20 dias',
    description:
      'Um fio acoplado a cada cílio natural saudável. Ideal para quem busca naturalidade refinada com efeito de máscara de cílios.',
    highlights: ['Máxima naturalidade', 'Isolamento 100% preservado', 'Conforto absoluto'],
  },
  {
    id: 'srv-brow-lamination',
    name: 'Brow Lamination',
    category: 'Sobrancelhas',
    priceBRL: 135,
    durationMinutes: 60,
    maintenanceInfo: 'Duração média de 4 a 6 semanas',
    description:
      'Alinhamento e reconstrução dos fios naturais das sobrancelhas com hidratação profunda, criando volume elegante e simetria.',
    highlights: ['Design na linha/pinça', 'Nutrição pós-química', 'Aspecto encorpado natural'],
  },
  {
    id: 'srv-design-sobrancelhas',
    name: 'Design de Sobrancelhas',
    category: 'Sobrancelhas',
    priceBRL: 55,
    durationMinutes: 45,
    maintenanceInfo: 'Recomendado a cada 15–20 dias',
    description:
      'Mapeamento geométrico exclusivo respeitando a estrutura óssea do rosto, com opção de aplicação suave de henna ou tintura.',
    highlights: ['Mapeamento facial', 'Epilações precisas', 'Finalização calmante'],
  },
  {
    id: 'srv-curso-lash',
    name: 'Curso VIP de Lash Design',
    category: 'Formação',
    priceBRL: 1490,
    durationMinutes: 480,
    maintenanceInfo: 'Turmas abertas · Certificado & Mentoria',
    description:
      'Formação prática presencial com Lorrayne Nunes (Embaixadora Florescer Beauty). Do isolamento perfeito ao posicionamento profissional.',
    highlights: ['Apostila e kit inicial', 'Prática em modelo real', 'Suporte pós-curso'],
  },
];

export const BOOKING_ADDONS: AddOnItem[] = [
  {
    id: 'addon-sobrancelha',
    name: 'Combo Design de Sobrancelhas',
    priceBRL: 40,
    durationMinutes: 30,
  },
  {
    id: 'addon-spa-labial',
    name: 'Hidratação & Spa Labial durante o procedimento',
    priceBRL: 25,
    durationMinutes: 0,
  },
  {
    id: 'addon-remocao',
    name: 'Remoção Segura de Extensão Anterior',
    priceBRL: 35,
    durationMinutes: 25,
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
