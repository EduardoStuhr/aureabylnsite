import { BOOKING_ADDONS, STUDIO_COURSE, STUDIO_PROFILE, STUDIO_SERVICES, type AddOnItem, type ServiceItem, type StudioWorkItem, type WorkCategory } from '../data/studioData';

export const studioWhatsAppUrl = `https://wa.me/${STUDIO_PROFILE.whatsappPhone.replace(/\D/g, '')}`;

export const BOOKING_PERIODS = ['Manhã (08h30–12h)', 'Tarde (13h30–18h)', 'Sábado (08h–14h)'] as const;
export const BOOKING_LIMITS = { clientName: 100, notes: 500 };

const studioDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' });

export function getStudioDate(now = new Date()): string {
  return studioDate.format(now);
}

export const BOOKING_DATE_ERROR = 'Selecione uma data igual ou posterior ao dia de hoje.';

export function isBookingDateAllowed(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < getStudioDate(now)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function findBookingService(id: string): ServiceItem | undefined {
  return id === STUDIO_COURSE.id ? STUDIO_COURSE : STUDIO_SERVICES.find(item => item.id === id);
}

function cleanMessageField(value: string): string {
  return value.replace(/[\p{Cc}\u2028-\u202e\u2066-\u2069]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

export interface BookingInput {
  clientName: string;
  serviceId: string;
  preferredPeriod: (typeof BOOKING_PERIODS)[number] | '';
  preferredDate: string;
  notes: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingInput, string>>;
}

export function filterWorksByCategory(
  works: StudioWorkItem[],
  category: WorkCategory,
  searchQuery = '',
): StudioWorkItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return works.filter((work) => {
    const matchesCategory = category === 'Todos' || work.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      work.title.toLowerCase().includes(normalizedQuery) ||
      work.category.toLowerCase().includes(normalizedQuery) ||
      work.technicalNote.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function validateBookingInput(input: BookingInput, now = new Date()): BookingValidationResult {
  const errors: Partial<Record<keyof BookingInput, string>> = {};
  const trimmedName = cleanMessageField(input.clientName);

  if (trimmedName.length < 2 || input.clientName.length > BOOKING_LIMITS.clientName) {
    errors.clientName = 'Informe um nome de 2 a 100 caracteres.';
  }

  if (!findBookingService(input.serviceId)) {
    errors.serviceId = 'Escolha um procedimento ou curso.';
  }

  if (input.serviceId !== STUDIO_COURSE.id) {
    if (!BOOKING_PERIODS.some(period => period === input.preferredPeriod)) {
      errors.preferredPeriod = 'Selecione o período de preferência.';
    }

    if (!isBookingDateAllowed(input.preferredDate, now)) {
      errors.preferredDate = BOOKING_DATE_ERROR;
    }
  }

  if (input.notes.length > BOOKING_LIMITS.notes) {
    errors.notes = 'Use até 500 caracteres nas observações.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatServicePrice(service: ServiceItem): string {
  return service.priceCents === null ? 'Sob consulta' : brl.format(service.priceCents / 100);
}

export function formatServiceDuration(service: ServiceItem): string {
  return service.durationMinutes === null ? 'Duração sob consulta' : service.durationMinutes + ' minutos';
}

/** Estimate only: the studio confirms whether procedures fit the same appointment. */
export function summarizeBookingServices(services: ServiceItem[]) {
  const unique = [...new Map(services.map(service => [service.id, service])).values()];
  const knownPrice = unique.reduce((sum, service) => sum + (service.priceCents ?? 0), 0);
  const knownDuration = unique.reduce((sum, service) => sum + (service.durationMinutes ?? 0), 0);
  const pendingPrice = unique.some(service => service.priceCents === null);
  const pendingDuration = unique.some(service => service.durationMinutes === null);
  return {
    services: unique,
    priceLabel: pendingPrice
      ? (unique.some(service => service.priceCents !== null) ? brl.format(knownPrice / 100) + ' + itens sob consulta' : 'Sob consulta')
      : brl.format(knownPrice / 100),
    durationLabel: pendingDuration
      ? (unique.some(service => service.durationMinutes !== null) ? knownDuration + ' minutos + itens sob consulta' : 'Duração sob consulta')
      : knownDuration + ' minutos',
  };
}

export function buildWhatsAppBookingUrl(
  input: BookingInput,
  service: ServiceItem | ServiceItem[],
  addOns: AddOnItem[],
): string {
  const primary = findBookingService(input.serviceId);
  if (!primary) throw new RangeError('Procedimento inválido');

  const url = new URL(studioWhatsAppUrl);
  const name = cleanMessageField(input.clientName);
  const notes = cleanMessageField(input.notes);
  if (primary.id === STUDIO_COURSE.id) {
    const investment = formatServicePrice(primary).replace('\u00a0', ' ');
    const message = [
      `Olá! Tenho interesse no curso de Lash Design da ÁURA, com investimento de ${investment}. Gostaria de saber mais sobre as próximas turmas e condições de inscrição.`,
      '',
      `*Nome:* ${name}`,
    ];
    if (notes) message.push(`*Mensagem:* ${notes}`);
    url.searchParams.set('text', message.join('\n'));
    return url.href;
  }

  // Prices and descriptions come from the local catalog, never from caller-supplied objects.
  const extraIds = new Set((Array.isArray(service) ? service : [service]).map(item => item.id));
  const extras = STUDIO_SERVICES.filter(item => extraIds.has(item.id));
  const summary = summarizeBookingServices([primary, ...extras]);
  const addOnIds = new Set(addOns.map(item => item.id));
  const addOnNames = BOOKING_ADDONS.filter(item => addOnIds.has(item.id)).map(item => item.name).join(', ');
  const lines = [
    `Olá, Lorrayne! Gostaria de consultar horários e valores no *ÁURA Studio Beauty* (@aurabyln).`,
    ``,
    `*Nome:* ${name}`,
    `*Interesse:* ${summary.services.map(item => item.name).join(', ')}`,
    ...summary.services.map(item => `• ${item.name} — ${formatServicePrice(item)} · ${formatServiceDuration(item)}`),
    `*Valor estimado:* ${summary.priceLabel}`,
    `*Duração estimada:* ${summary.durationLabel}`,
    `*Solicitação sujeita à disponibilidade e confirmação do estúdio.*`,
    `A combinação de procedimentos e o tempo total serão confirmados pelo estúdio.`,
    `*Observações adicionais:* ${addOnNames || 'Nenhum adicional'}`,
    `*Preferência de data:* ${input.preferredDate} · ${input.preferredPeriod}`,
  ];
  if (notes) lines.push(`*Mensagem:* ${notes}`);
  url.searchParams.set('text', lines.join('\n'));
  return url.href;
}
