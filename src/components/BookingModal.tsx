import { useEffect, useMemo, useState, useRef, type FormEvent } from 'react';
import { CheckCircle2, ExternalLink, X } from 'lucide-react';
import {
  BOOKING_ADDONS,
  STUDIO_COURSE,
  STUDIO_PROFILE,
  STUDIO_SERVICES,
} from '../data/studioData';
import {
  buildWhatsAppBookingUrl,
  validateBookingInput,
  type BookingInput,
} from '../utils/studioLogic';

interface BookingModalProps {
  isOpen: boolean;
  initialServiceId: string;
  onClose: () => void;
}

const PERIOD_OPTIONS: BookingInput['preferredPeriod'][] = [
  'Manhã (08h30–12h)',
  'Tarde (13h30–18h)',
  'Sábado (08h–14h)',
];

export function BookingModal({
  isOpen,
  initialServiceId,
  onClose,
}: BookingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [clientName, setClientName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || STUDIO_SERVICES[0].id);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [preferredPeriod, setPreferredPeriod] =
    useState<BookingInput['preferredPeriod']>('Tarde (13h30–18h)');
  const [preferredDate, setPreferredDate] = useState('2026-11-25');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof BookingInput, string>>>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSubmittedUrl(null);
      setErrors({});
    }
  }, [isOpen]);

  const courseInquiry = initialServiceId === STUDIO_COURSE.id;
  const selectedService = useMemo(
    () => courseInquiry ? STUDIO_COURSE : STUDIO_SERVICES.find((s) => s.id === serviceId) ?? STUDIO_SERVICES[0],
    [courseInquiry, serviceId],
  );

  const selectedAddOns = useMemo(
    () => BOOKING_ADDONS.filter((a) => selectedAddOnIds.includes(a.id)),
    [selectedAddOnIds],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = modalRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, textarea, a[href]') ?? []);
    focusable()[0]?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    panel?.addEventListener('keydown', keys);
    return () => {
      panel?.removeEventListener('keydown', keys);
      document.body.style.overflow = originalOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const input: BookingInput = {
      clientName,
      whatsapp,
      serviceId,
      preferredPeriod,
      preferredDate,
      notes,
    };
    const result = validateBookingInput(input);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    const url = buildWhatsAppBookingUrl(
      input,
      selectedService,
      selectedAddOns,
    );
    setSubmittedUrl(url);
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141210]/65 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-[#FAF8F5] p-6 text-[#141210] shadow-2xl sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#141210]/15 sm:hidden" />

        <div className="flex items-start justify-between gap-4 border-b border-[#141210]/10 pb-4">
          <div>
            <p className="text-xs font-medium text-[#9A742E]">
              {STUDIO_PROFILE.fullTitle} · {STUDIO_PROFILE.city}
            </p>
            <h2
              id="booking-modal-title"
              className="font-display mt-1 text-3xl font-medium text-[#141210]"
            >
              Agendar &amp; consultar valores
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de agendamento"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#141210]/15 text-[#141210] transition-colors hover:bg-[#F1EDE6]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {submittedUrl ? (
          <div className="py-6" data-testid="booking-confirmation">
            <div className="flex items-center gap-3 text-[#141210]">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-[#9A742E]" aria-hidden="true" />
              <h3 className="font-display text-2xl font-semibold">
                Solicitação preparada para {clientName}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#46413B]">
              Seu resumo para <strong>{selectedService.name}</strong> está pronto.
              Clique abaixo para confirmar horários disponíveis e valores diretamente
              com a Lorrayne Nunes no WhatsApp.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={submittedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[#141210] px-6 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
              >
                <span>Conversar no WhatsApp</span>
                <ExternalLink className="h-4 w-4 text-[#C6A464]" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setSubmittedUrl(null)}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border border-[#141210]/20 px-5 py-3 text-xs font-medium text-[#141210] hover:bg-[#F1EDE6]"
              >
                Editar dados
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-xs font-semibold text-[#141210]"
                >
                  Seu nome completo
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Maria Clara Oliveira"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#141210]/20 bg-[#FAF8F5] px-3.5 text-sm text-[#141210] focus:border-[#9A742E] focus:outline-none"
                />
                {errors.clientName && (
                  <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-whatsapp"
                  className="block text-xs font-semibold text-[#141210]"
                >
                  WhatsApp com DDD
                </label>
                <input
                  id="booking-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  autoComplete="tel"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#141210]/20 bg-[#FAF8F5] px-3.5 text-sm text-[#141210] focus:border-[#9A742E] focus:outline-none"
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {errors.whatsapp}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-service"
                className="block text-xs font-semibold text-[#141210]"
              >
                {courseInquiry ? 'Curso' : 'Procedimento'}
              </label>
              <select
                id="booking-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#141210]/20 bg-[#FAF8F5] px-3.5 text-sm text-[#141210] focus:border-[#9A742E] focus:outline-none"
              >
                {(courseInquiry ? [STUDIO_COURSE] : STUDIO_SERVICES).map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — {srv.category}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {errors.serviceId}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="text-xs font-semibold text-[#141210]">
                Complementos (opcional)
              </legend>
              <div className="mt-2 space-y-2">
                {BOOKING_ADDONS.map((addon) => {
                  const checked = selectedAddOnIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2 text-xs transition-colors ${
                        checked
                          ? 'border-[#141210] bg-[#F1EDE6]'
                          : 'border-[#141210]/12 bg-[#FAF8F5]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddOn(addon.id)}
                          className="h-4 w-4 accent-[#141210]"
                        />
                        <span className="font-medium text-[#141210]">{addon.name}</span>
                      </span>
                      <span className="text-[11px] text-[#5C564E]">{addon.detail}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-xs font-semibold text-[#141210]"
                >
                  Data desejada
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#141210]/20 bg-[#FAF8F5] px-3.5 text-sm text-[#141210] focus:border-[#9A742E] focus:outline-none"
                />
                {errors.preferredDate && (
                  <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {errors.preferredDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-period"
                  className="block text-xs font-semibold text-[#141210]"
                >
                  Período de preferência
                </label>
                <select
                  id="booking-period"
                  value={preferredPeriod}
                  onChange={(e) =>
                    setPreferredPeriod(e.target.value as BookingInput['preferredPeriod'])
                  }
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#141210]/20 bg-[#FAF8F5] px-3.5 text-sm text-[#141210] focus:border-[#9A742E] focus:outline-none"
                >
                  {PERIOD_OPTIONS.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
                {errors.preferredPeriod && (
                  <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {errors.preferredPeriod}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-notes"
                className="block text-xs font-semibold text-[#141210]"
              >
                Observações (opcional)
              </label>
              <textarea
                id="booking-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Primeira vez fazendo cílios, prefiro efeito mais natural."
                className="mt-1.5 w-full rounded-xl border border-[#141210]/20 bg-[#FAF8F5] p-3 text-sm text-[#141210] focus:border-[#9A742E] focus:outline-none"
              />
            </div>

            {/* Direct Contact Footer & Submit */}
            <div className="flex flex-col gap-4 border-t border-[#141210]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-[#141210]">
                  Atendimento direto com Lorrayne Nunes
                </p>
                <p className="text-[11px] text-[#5C564E]">
                  Valores e horários confirmados diretamente via WhatsApp
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full bg-[#141210] px-7 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
              >
                Continuar para WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
