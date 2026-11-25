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

export function buildWhatsAppBookingUrl(
  input: BookingInput,
  service: ServiceItem,
  addOns: AddOnItem[],
): string {
  const addOnNames = addOns.length > 0 ? addOns.map((a) => a.name).join(', ') : 'Nenhum adicional';
  const lines = [
    `Olá, Lorrayne! Gostaria de consultar horários e valores no *ÁURA Studio Beauty* (@aurabyln).`,
    ``,
    `*Nome:* ${input.clientName.trim()}`,
    `*WhatsApp:* ${input.whatsapp.trim()}`,
    `*Interesse:* ${service.name}`,
    `*Valor do procedimento:* ${formatServicePrice(service)}`,
    `*Duração:* ${formatServiceDuration(service)}`,
    `*Solicitação sujeita à disponibilidade e confirmação do estúdio.*`,
    `*Observações adicionais:* ${addOnNames}`,
    `*Preferência de data:* ${input.preferredDate} · ${input.preferredPeriod}`,
  ];
  if (input.notes.trim()) {
    lines.push(`*Mensagem:* ${input.notes.trim()}`);
  }
  const encoded = encodeURIComponent(lines.join('\n'));
  return `${studioWhatsAppUrl}?text=${encoded}`;
}
