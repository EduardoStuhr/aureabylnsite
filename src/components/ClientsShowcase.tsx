import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import {
  STUDIO_WORKS,
  type StudioWorkItem,
  type WorkCategory,
} from '../data/studioData';
import { filterWorksByCategory } from '../utils/studioLogic';

interface ClientsShowcaseProps {
  onBookService: (serviceId: string) => void;
}

const CATEGORIES: WorkCategory[] = ['Todos', 'Lash Design', 'Fox Eyes', 'Sobrancelhas', 'Estúdio'];

export function ClientsShowcase({ onBookService }: ClientsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<WorkCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWork, setActiveWork] = useState<StudioWorkItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredWorks = useMemo(
    () => filterWorksByCategory(STUDIO_WORKS, selectedCategory, searchQuery),
    [selectedCategory, searchQuery],
  );

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="clientes"
      aria-labelledby="trabalhos-heading"
      className="scroll-mt-20 border-b border-[#141210]/10 bg-[#FAF8F5] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#5C564E]">
              Portfólio Oficial · Fotos reais de @aureabyln
            </p>
            <h2
              id="trabalhos-heading"
              className="font-display mt-2 text-[clamp(2rem,4vw,3.1rem)] leading-[1.08] font-medium tracking-tight text-[#141210]"
              style={{ textWrap: 'balance' }}
            >
              Trabalhos realizados &amp; resultados do estúdio.
            </h2>
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <label htmlFor="work-search" className="sr-only">
                Buscar trabalho ou técnica
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5C564E]"
                aria-hidden="true"
              />
              <input
                id="work-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar trabalho ou técnica..."
                className="min-h-[44px] w-full rounded-full border border-[#141210]/15 bg-[#F1EDE6]/70 pr-4 pl-10 text-sm text-[#141210] placeholder:text-[#5C564E] focus:border-[#9A742E] focus:bg-[#FAF8F5] focus:outline-none sm:w-60"
              />
            </div>

            <div
              role="group"
              aria-label="Filtrar trabalhos por técnica"
              className="flex items-center gap-1 overflow-x-auto rounded-full border border-[#141210]/10 bg-[#F1EDE6] p-1"
            >
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={isActive}
                    className={`min-h-[38px] cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E] ${
                      isActive
                        ? 'bg-[#141210] text-[#FAF8F5]'
                        : 'text-[#5C564E] hover:text-[#141210]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real Studio Works Gallery — HD Photography */}
        {filteredWorks.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#141210]/10 bg-[#F1EDE6]/60 p-10 text-center">
            <p className="font-display text-2xl font-medium text-[#141210]">
              Nenhum trabalho encontrado para essa busca.
            </p>
            <p className="mt-2 text-sm text-[#5C564E]">
              Tente outro termo ou exiba todas as técnicas realizadas no estúdio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-[#141210] px-6 py-2.5 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div
            data-testid="clients-grid"
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredWorks.map((work) => {
              const isBroken = failedImages[work.id];
              return (
                <article
                  key={work.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#141210]/10 bg-[#F1EDE6]/45 transition-colors duration-200 hover:border-[#141210]/25"
                >
                  <button
                    type="button"
                    onClick={() => setActiveWork(work)}
                    aria-label={`Ver trabalho ${work.title} — ${work.technique}`}
                    className="flex flex-1 cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9A742E]"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E7E1D7]">
                      {!isBroken ? (
                        <img
                          src={work.imageSrc}
                          alt={work.imageAlt}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(work.id)}
                          className="h-full w-full object-cover object-[center_22%] transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EDE7DD] to-[#D8CEBE] p-6 text-center">
                          <span className="font-display text-2xl font-medium text-[#141210]">
                            {work.title}
                          </span>
                          <span className="mt-1 text-xs text-[#5C564E]">{work.technique}</span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141210]/85 via-[#141210]/35 to-transparent px-4 pt-14 pb-3.5 text-[#FAF8F5]">
                        <p className="text-xs font-medium text-[#E7D5B3]">{work.category}</p>
                        <h3 className="font-display text-2xl font-medium text-[#FAF8F5]">
                          {work.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="text-sm font-semibold text-[#141210]">
                          {work.technique}
                        </p>
                        <p className="mt-1 text-xs text-[#5C564E]">
                          {work.publishedLabel}
                        </p>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#46413B]">
                          {work.technicalNote}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#141210]/10 pt-3 text-xs font-semibold text-[#141210]">
                        <span>Ver detalhes &amp; agendar</span>
                        <ArrowUpRight
                          className="h-4 w-4 text-[#9A742E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Work Detail Modal / Mobile Sheet */}
      {activeWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-modal-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#141210]/65 p-0 sm:items-center sm:p-6"
          onClick={() => setActiveWork(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#FAF8F5] text-[#141210] shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-[#141210]/15 sm:hidden" />

            <button
              type="button"
              onClick={() => setActiveWork(null)}
              aria-label="Fechar detalhes do trabalho"
              className="absolute top-4 right-4 z-10 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#141210]/15 bg-[#FAF8F5] text-[#141210] transition-colors hover:bg-[#F1EDE6]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="aspect-[3/4] w-full overflow-hidden bg-[#E7E1D7] sm:col-span-5 sm:aspect-auto sm:min-h-[380px]">
                {!failedImages[activeWork.id] ? (
                  <img
                    src={activeWork.imageSrc}
                    alt={activeWork.imageAlt}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-6 text-center">
                    <span className="font-display text-2xl">{activeWork.title}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between p-6 sm:col-span-7 sm:p-8">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#5C564E]">
                    <span>{activeWork.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeWork.publishedLabel}</span>
                  </div>
                  <h3
                    id="work-modal-title"
                    className="font-display mt-2 text-3xl font-medium text-[#141210]"
                  >
                    {activeWork.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#9A742E]">
                    {activeWork.technique}
                  </p>

                  <dl className="mt-5 space-y-2.5 border-y border-[#141210]/10 py-4 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5C564E]">Especificação</dt>
                      <dd className="text-right font-medium text-[#141210]">
                        {activeWork.mappingSpec}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5C564E]">Atendimento</dt>
                      <dd className="font-medium text-[#141210]">
                        Com hora marcada · Valores sob consulta
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-sm leading-relaxed text-[#2B2621]">
                    {activeWork.technicalNote}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      const targetServiceId = activeWork.serviceId;
                      setActiveWork(null);
                      onBookService(targetServiceId);
                    }}
                    className="inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center rounded-full bg-[#141210] px-5 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
                  >
                    Agendar esse trabalho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
