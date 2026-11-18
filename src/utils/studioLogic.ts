import type { AddOnItem, ClientCategory, ClientShowcaseItem, ServiceItem } from '../data/studioData';

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

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return 'Incluso';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function filterClientsByCategory(
  clients: ClientShowcaseItem[],
  category: ClientCategory,
  searchQuery = '',
): ClientShowcaseItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return clients.filter((client) => {
    const matchesCategory = category === 'Todos' || client.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      client.clientName.toLowerCase().includes(normalizedQuery) ||
      client.technique.toLowerCase().includes(normalizedQuery) ||
      client.city.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function calculateBookingSummary(
  service: ServiceItem | undefined,
  selectedAddOns: AddOnItem[],
): { totalBRL: number; totalMinutes: number } {
  const basePrice = service ? service.priceBRL : 0;
  const baseMinutes = service ? service.durationMinutes : 0;
  return selectedAddOns.reduce(
    (acc, item) => ({
      totalBRL: acc.totalBRL + item.priceBRL,
      totalMinutes: acc.totalMinutes + item.durationMinutes,
    }),
    { totalBRL: basePrice, totalMinutes: baseMinutes },
  );
}

export function validateBookingInput(input: BookingInput): BookingValidationResult {
  const errors: Partial<Record<keyof BookingInput, string>> = {};
  const trimmedName = input.clientName.trim();
  const digitsOnly = input.whatsapp.replace(/\D/g, '');

  if (trimmedName.length < 2) {
    errors.clientName = 'Informe seu nome completo para o atendimento.';
  }

  if (digitsOnly.length < 10 || digitsOnly.length > 13) {
    errors.whatsapp = 'Digite um WhatsApp válido com DDD (ex: 27 99999-0000).';
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

export function buildWhatsAppBookingUrl(
  studioPhone: string,
  input: BookingInput,
  service: ServiceItem,
  addOns: AddOnItem[],
): string {
  const summary = calculateBookingSummary(service, addOns);
  const addOnNames = addOns.length > 0 ? addOns.map((a) => a.name).join(', ') : 'Nenhum adicional';
  const lines = [
    `Olá, Lorrayne! Gostaria de solicitar um agendamento no *Áurea Studio Beauty* (@aureabyln).`,
    ``,
    `*Cliente:* ${input.clientName.trim()}`,
    `*WhatsApp:* ${input.whatsapp.trim()}`,
    `*Serviço:* ${service.name}`,
    `*Adicionais:* ${addOnNames}`,
    `*Data desejada:* ${input.preferredDate} · ${input.preferredPeriod}`,
    `*Investimento estimado:* ${formatBRL(summary.totalBRL)} (${formatDuration(summary.totalMinutes)})`,
  ];
  if (input.notes.trim()) {
    lines.push(`*Observações:* ${input.notes.trim()}`);
  }
  const encoded = encodeURIComponent(lines.join('\n'));
  const sanitizedPhone = studioPhone.replace(/\D/g, '');
  return `https://wa.me/${sanitizedPhone}?text=${encoded}`;
}
