import { BOOKING_ADDONS, STUDIO_COURSE, STUDIO_PROFILE, STUDIO_SERVICES, type AddOnItem, type ServiceItem, type StudioWorkItem, type WorkCategory } from '../data/studioData';

export const studioWhatsAppUrl = `https://wa.me/${STUDIO_PROFILE.whatsappPhone.replace(/\D/g, '')}`;

export const BOOKING_PERIODS = ['Manhã (08h30–12h)', 'Tarde (13h30–18h)', 'Sábado (08h–14h)'] as const;
export const BOOKING_LIMITS = { clientName: 100, whatsapp: 24, notes: 500 };

const studioDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' });

export function getStudioDate(now = new Date()): string {
  return studioDate.format(now);
}

function findBookingService(id: string): ServiceItem | undefined {
  return id === STUDIO_COURSE.id ? STUDIO_COURSE : STUDIO_SERVICES.find(item => item.id === id);
}

function cleanMessageField(value: string): string {
  return value.replace(/[\p{Cc}\u2028-\u202e\u2066-\u2069]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

export interface BookingInput {
  clientName: string;
  whatsapp: string;
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
  const digitsOnly = input.whatsapp.replace(/\D/g, '');

  if (trimmedName.length < 2 || input.clientName.length > BOOKING_LIMITS.clientName) {
    errors.clientName = 'Informe um nome de 2 a 100 caracteres.';
  }

  if (input.whatsapp.length > BOOKING_LIMITS.whatsapp ||
      !/^[+0-9(). -]+$/.test(input.whatsapp) || !/^(?:55)?[1-9][0-9]{9,10}$/.test(digitsOnly)) {
    errors.whatsapp = 'Digite um WhatsApp válido com DDD.';
  }

  if (!findBookingService(input.serviceId)) {
    errors.serviceId = 'Escolha um procedimento ou curso.';
  }

  if (!BOOKING_PERIODS.some(period => period === input.preferredPeriod)) {
    errors.preferredPeriod = 'Selecione o período de preferência.';
  }

  const date = new Date(input.preferredDate + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.preferredDate) || Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== input.preferredDate || input.preferredDate < getStudioDate(now)) {
    errors.preferredDate = 'Escolha uma data válida a partir de hoje.';
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

  // Prices and descriptions come from the local catalog, never from caller-supplied objects.
  const extraIds = new Set((Array.isArray(service) ? service : [service]).map(item => item.id));
  const extras = primary.id === STUDIO_COURSE.id ? [] : STUDIO_SERVICES.filter(item => extraIds.has(item.id));
  const summary = summarizeBookingServices([primary, ...extras]);
  const addOnIds = new Set(addOns.map(item => item.id));
  const addOnNames = BOOKING_ADDONS.filter(item => addOnIds.has(item.id)).map(item => item.name).join(', ');
  const notes = cleanMessageField(input.notes);
  const lines = [
    `Olá, Lorrayne! Gostaria de consultar horários e valores no *ÁURA Studio Beauty* (@aurabyln).`,
    ``,
    `*Nome:* ${cleanMessageField(input.clientName)}`,
    `*WhatsApp:* ${input.whatsapp.replace(/\D/g, '')}`,
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
  const url = new URL(studioWhatsAppUrl);
  url.searchParams.set('text', lines.join('\n'));
  return url.href;
}
