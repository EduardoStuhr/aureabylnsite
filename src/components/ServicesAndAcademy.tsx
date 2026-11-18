import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { STUDIO_SERVICES, type ServiceItem } from '../data/studioData';
import { formatBRL, formatDuration } from '../utils/studioLogic';

interface ServicesAndAcademyProps {
  onSelectService: (serviceId: string) => void;
}

type ServiceTab = 'Todos' | 'Cílios' | 'Sobrancelhas' | 'Formação';

export function ServicesAndAcademy({ onSelectService }: ServicesAndAcademyProps) {
  const [activeTab, setActiveTab] = useState<ServiceTab>('Todos');
  const [academyImgFailed, setAcademyImgFailed] = useState(false);

  const visibleServices: ServiceItem[] =
    activeTab === 'Todos'
      ? STUDIO_SERVICES.filter((s) => s.category !== 'Formação')
      : STUDIO_SERVICES.filter((s) => s.category === activeTab);

  return (
    <section
      id="servicos"
      aria-labelledby="servicos-heading"
      className="border-b border-[#141210]/10 bg-[#F1EDE6]/60 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Menu de Serviços */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#5C564E]">
              Protocolos Personalizados · Afonso Cláudio/ES
            </p>
            <h2
              id="servicos-heading"
              className="font-display mt-2 text-[clamp(2rem,4vw,3.1rem)] leading-[1.08] font-medium tracking-tight text-[#141210]"
            >
              Menu de serviços &amp; valores
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar serviços por categoria"
            className="flex items-center gap-1 self-start rounded-full border border-[#141210]/10 bg-[#FAF8F5] p-1"
          >
            {(['Todos', 'Cílios', 'Sobrancelhas'] as const).map((tab) => {
              const selected = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab)}
                  className={`min-h-[38px] cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    selected
                      ? 'bg-[#141210] text-[#FAF8F5]'
                      : 'text-[#5C564E] hover:text-[#141210]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Service Rows — zero nested card clutter */}
        <div className="mt-8 divide-y divide-[#141210]/12 border-y border-[#141210]/12">
          {visibleServices.map((service, index) => (
            <div
              key={service.id}
              className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-12 lg:items-center lg:gap-8"
            >
              <div className="lg:col-span-4">
                <div className="flex items-center gap-2 text-xs text-[#5C564E]">
                  <span className="tabular-nums">0{index + 1}.</span>
                  <span aria-hidden="true">·</span>
                  <span>{service.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{formatDuration(service.durationMinutes)}</span>
                </div>
                <h3 className="font-display mt-1 text-2xl font-semibold text-[#141210]">
                  {service.name}
                </h3>
              </div>

              <div className="lg:col-span-5">
                <p className="text-sm leading-relaxed text-[#46413B]">{service.description}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C564E]">
                  {service.highlights.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-[#9A742E]" aria-hidden="true" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:justify-end">
                <div className="text-left lg:text-right">
                  <p className="font-display text-2xl font-semibold tabular-nums text-[#141210]">
                    {formatBRL(service.priceBRL)}
                  </p>
                  <p className="text-[11px] text-[#5C564E]">{service.maintenanceInfo}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-[#141210]/20 bg-[#FAF8F5] px-5 py-2.5 text-xs font-semibold text-[#141210] whitespace-nowrap shrink-0 transition-colors hover:border-[#141210] hover:bg-[#141210] hover:text-[#FAF8F5]"
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Curso de Lash Design Spotlight */}
        <div
          id="curso"
          className="mt-14 grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#141210]/12 bg-[#141210] text-[#FAF8F5] lg:grid-cols-12"
        >
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#E7D5B3]">
                Educação · Embaixadora Florescer Beauty
              </p>
              <h3
                className="font-display mt-3 text-[clamp(1.85rem,3.6vw,2.85rem)] leading-[1.08] font-medium text-[#FAF8F5]"
                style={{ textWrap: 'balance' }}
              >
                Curso de Lash Design · Turmas Abertas
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#D7D0C6] sm:text-base">
                “Não é sorte. É preparação, disciplina e constância.” Transforme sua
                paixão pela beleza em uma profissão de sucesso com formação presencial,
                prática em modelo real e mentoria direta com Lorrayne Nunes.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-[#EDE7DF]">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-[#C6A464]" aria-hidden="true" />
                  <span>Anatomia dos fios, saúde ocular e isolamento seguro</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-[#C6A464]" aria-hidden="true" />
                  <span>Mapping estratégico, Volume Brasileiro e Fox Eyes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-[#C6A464]" aria-hidden="true" />
                  <span>Apostila exclusiva, kit inicial e certificado reconhecido</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#FAF8F5]/15 pt-6">
              <div>
                <p className="text-xs text-[#D7D0C6]">Formação VIP Presencial</p>
                <p className="font-display text-2xl font-semibold tabular-nums text-[#E7D5B3]">
                  {formatBRL(1490)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectService('srv-curso-lash')}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#E7D5B3] px-6 py-3 text-xs font-semibold text-[#141210] whitespace-nowrap transition-colors hover:bg-[#FAF8F5]"
              >
                <span>Garantir vaga na turma</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[260px] bg-[#24201C] lg:col-span-6">
            {!academyImgFailed ? (
              <img
                src="/src/assets/images/studio_lash_academy_1795019896448.jpg"
                alt="Mesa de trabalho do curso de Lash Design do Áurea Studio Beauty com pinças douradas e fios de seda"
                referrerPolicy="no-referrer"
                onError={() => setAcademyImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-8 text-center text-[#E7D5B3]">
                <span className="font-display text-2xl">Curso VIP de Lash Design</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
