import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import {
  CLIENT_SHOWCASE,
  type ClientCategory,
  type ClientShowcaseItem,
} from '../data/studioData';
import { filterClientsByCategory, formatDuration } from '../utils/studioLogic';

interface ClientsShowcaseProps {
  onBookService: (serviceId: string) => void;
}

const CATEGORIES: ClientCategory[] = ['Todos', 'Lash Design', 'Fox Eyes', 'Sobrancelhas'];

export function ClientsShowcase({ onBookService }: ClientsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClientCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClient, setActiveClient] = useState<ClientShowcaseItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredClients = useMemo(
    () => filterClientsByCategory(CLIENT_SHOWCASE, selectedCategory, searchQuery),
    [selectedCategory, searchQuery],
  );

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="clientes"
      aria-labelledby="clientes-heading"
      className="border-b border-[#141210]/10 bg-[#FAF8F5] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#5C564E]">
              Portfólio Real · @aureabyln
            </p>
            <h2
              id="clientes-heading"
              className="font-display mt-2 text-[clamp(2rem,4vw,3.1rem)] leading-[1.08] font-medium tracking-tight text-[#141210]"
              style={{ textWrap: 'balance' }}
            >
              Principais clientes &amp; resultados que acompanham sua rotina.
            </h2>
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <label htmlFor="client-search" className="sr-only">
                Buscar cliente ou técnica
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5C564E]"
                aria-hidden="true"
              />
              <input
                id="client-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente ou técnica..."
                className="min-h-[44px] w-full rounded-full border border-[#141210]/15 bg-[#F1EDE6]/70 pr-4 pl-10 text-sm text-[#141210] placeholder:text-[#5C564E] focus:border-[#9A742E] focus:bg-[#FAF8F5] focus:outline-none sm:w-60"
              />
            </div>

            <div
              role="group"
              aria-label="Filtrar clientes por técnica"
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

        {/* Client Cards Grid — Mobile-first stack / Desktop 3-column gallery */}
        {filteredClients.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#141210]/10 bg-[#F1EDE6]/60 p-10 text-center">
            <p className="font-display text-2xl font-medium text-[#141210]">
              Nenhuma transformação encontrada para essa busca.
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
            {filteredClients.map((client) => {
              const isBroken = failedImages[client.id];
              return (
                <article
                  key={client.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#141210]/10 bg-[#F1EDE6]/45 transition-colors duration-200 hover:border-[#141210]/25"
                >
                  <button
                    type="button"
                    onClick={() => setActiveClient(client)}
                    aria-label={`Ver detalhes de ${client.clientName} — ${client.technique}`}
                    className="flex flex-1 cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9A742E]"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E7E1D7]">
                      {!isBroken ? (
                        <img
                          src={client.imageSrc}
                          alt={client.imageAlt}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(client.id)}
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EDE7DD] to-[#D8CEBE] p-6 text-center">
                          <span className="font-display text-2xl font-medium text-[#141210]">
                            {client.clientName}
                          </span>
                          <span className="mt-1 text-xs text-[#5C564E]">{client.technique}</span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141210]/80 via-[#141210]/30 to-transparent px-4 pt-12 pb-3.5 text-[#FAF8F5]">
                        <p className="text-xs font-medium text-[#E7D5B3]">{client.category}</p>
                        <h3 className="font-display text-2xl font-medium text-[#FAF8F5]">
                          {client.clientName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="text-sm font-semibold text-[#141210]">
                          {client.technique}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#5C564E] tabular-nums">
                          <span>{client.city}</span>
                          <span aria-hidden="true">·</span>
                          <span>{client.retention}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDuration(client.durationMinutes)}</span>
                        </div>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#46413B]">
                          “{client.quote}”
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#141210]/10 pt-3 text-xs font-semibold text-[#141210]">
                        <span>Ver mapping &amp; detalhes</span>
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

      {/* Client Detail Modal / Mobile Sheet */}
      {activeClient && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="client-modal-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#141210]/65 p-0 sm:items-center sm:p-6"
          onClick={() => setActiveClient(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#FAF8F5] text-[#141210] shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-[#141210]/15 sm:hidden" />

            <button
              type="button"
              onClick={() => setActiveClient(null)}
              aria-label="Fechar detalhes da cliente"
              className="absolute top-4 right-4 z-10 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#141210]/15 bg-[#FAF8F5] text-[#141210] transition-colors hover:bg-[#F1EDE6]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#E7E1D7] sm:col-span-5 sm:aspect-auto sm:min-h-[380px]">
                {!failedImages[activeClient.id] ? (
                  <img
                    src={activeClient.imageSrc}
                    alt={activeClient.imageAlt}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-6 text-center">
                    <span className="font-display text-2xl">{activeClient.clientName}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between p-6 sm:col-span-7 sm:p-8">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#5C564E]">
                    <span>{activeClient.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeClient.city}</span>
                  </div>
                  <h3
                    id="client-modal-title"
                    className="font-display mt-2 text-3xl font-medium text-[#141210]"
                  >
                    {activeClient.clientName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#9A742E]">
                    {activeClient.technique}
                  </p>

                  <dl className="mt-5 space-y-2.5 border-y border-[#141210]/10 py-4 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5C564E]">Especificação</dt>
                      <dd className="text-right font-medium text-[#141210]">
                        {activeClient.mappingSpec}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5C564E]">Durabilidade</dt>
                      <dd className="font-medium tabular-nums text-[#141210]">
                        {activeClient.retention}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5C564E]">Tempo de sessão</dt>
                      <dd className="font-medium tabular-nums text-[#141210]">
                        {formatDuration(activeClient.durationMinutes)}
                      </dd>
                    </div>
                  </dl>

                  <blockquote className="font-display mt-5 text-lg italic leading-relaxed text-[#2B2621]">
                    “{activeClient.quote}”
                  </blockquote>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      const targetServiceId = activeClient.serviceId;
                      setActiveClient(null);
                      onBookService(targetServiceId);
                    }}
                    className="inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center rounded-full bg-[#141210] px-5 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
                  >
                    Quero este resultado
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
