import { STUDIO_PROFILE, type AddOnItem, type ServiceItem, type StudioWorkItem, type WorkCategory } from '../data/studioData';

export const studioWhatsAppUrl = `https://wa.me/${STUDIO_PROFILE.whatsappPhone.replace(/\D/g, '')}`;

export interface BookingInput {
  clientName: string;
  whatsapp: string;
  serviceId: string;
  preferredPeriod: 'Manhã (08h30–12h)' | 'Tarde (13h30–18h)' | 'Sábado (08h–14h)' | '';
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

export function validateBookingInput(input: BookingInput): BookingValidationResult {
  const errors: Partial<Record<keyof BookingInput, string>> = {};
  const trimmedName = input.clientName.trim();
  const digitsOnly = input.whatsapp.replace(/\D/g, '');

  if (trimmedName.length < 2) {
    errors.clientName = 'Informe seu nome completo para o atendimento.';
  }

  if (digitsOnly.length < 10 || digitsOnly.length > 13) {
    errors.whatsapp = 'Digite um WhatsApp válido com DDD.';
  }

  if (!input.serviceId) {
    errors.serviceId = 'Escolha um procedimento ou curso.';
  }

  if (!input.preferredPeriod) {
    errors.preferredPeriod = 'Selecione o período de preferência.';
  }

  if (!input.preferredDate) {
    errors.preferredDate = 'Escolha uma data desejada.';
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
  const summary = summarizeBookingServices(Array.isArray(service) ? service : [service]);
  const addOnNames = addOns.length > 0 ? addOns.map((a) => a.name).join(', ') : 'Nenhum adicional';
  const lines = [
    `Olá, Lorrayne! Gostaria de consultar horários e valores no *ÁURA Studio Beauty* (@aurabyln).`,
    ``,
    `*Nome:* ${input.clientName.trim()}`,
    `*WhatsApp:* ${input.whatsapp.trim()}`,
    `*Interesse:* ${summary.services.map(item => item.name).join(', ')}`,
    ...summary.services.map(item => `• ${item.name} — ${formatServicePrice(item)} · ${formatServiceDuration(item)}`),
    `*Valor estimado:* ${summary.priceLabel}`,
    `*Duração estimada:* ${summary.durationLabel}`,
    `*Solicitação sujeita à disponibilidade e confirmação do estúdio.*`,
    `A combinação de procedimentos e o tempo total serão confirmados pelo estúdio.`,
    `*Observações adicionais:* ${addOnNames}`,
    `*Preferência de data:* ${input.preferredDate} · ${input.preferredPeriod}`,
  ];
  if (input.notes.trim()) {
    lines.push(`*Mensagem:* ${input.notes.trim()}`);
  }
  const encoded = encodeURIComponent(lines.join('\n'));
  return `${studioWhatsAppUrl}?text=${encoded}`;
}
