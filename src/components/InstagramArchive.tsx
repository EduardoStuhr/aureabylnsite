import { useState } from 'react';
import { ExternalLink, Maximize2, X } from 'lucide-react';
import { INSTAGRAM_MOMENTS, STUDIO_PROFILE } from '../data/studioData';

export function InstagramArchive() {
  const [boardOpen, setBoardOpen] = useState(false);
  const [boardImgFailed, setBoardImgFailed] = useState(false);

  return (
    <section
      id="instagram"
      aria-labelledby="instagram-heading"
      className="border-b border-[#141210]/10 bg-[#FAF8F5] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Column: Feed Moments from @aureabyln */}
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-wide text-[#5C564E]">
              Instagram {STUDIO_PROFILE.handle} · Diário do Estúdio
            </p>
            <h2
              id="instagram-heading"
              className="font-display mt-2 text-[clamp(2rem,4vw,3.1rem)] leading-[1.08] font-medium tracking-tight text-[#141210]"
            >
              Acompanhe o dia a dia e as publicações oficiais.
            </h2>

            <div className="mt-7 divide-y divide-[#141210]/10 border-y border-[#141210]/10">
              {INSTAGRAM_MOMENTS.map((moment) => (
                <div key={moment.id} className="py-4">
                  <div className="flex items-center gap-2 text-xs text-[#5C564E]">
                    <span className="font-medium text-[#9A742E]">{moment.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{moment.dateLabel}</span>
                  </div>
                  <h3 className="font-display mt-1 text-xl font-semibold text-[#141210]">
                    {moment.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#46413B]">
                    {moment.caption}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={STUDIO_PROFILE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#141210] px-6 py-2.5 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
              >
                <span>Seguir {STUDIO_PROFILE.handle}</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#C6A464]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Feed Contact Board */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-[#141210]/12 bg-[#141210]">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {!boardImgFailed ? (
                  <img
                    src={STUDIO_PROFILE.feedBoardImage}
                    alt="Prancha oficial de trabalhos e publicações do perfil @aureabyln no Instagram"
                    referrerPolicy="no-referrer"
                    onError={() => setBoardImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-8 text-center text-[#E7D5B3]">
                    <span className="font-display text-2xl">Feed @aureabyln</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-xs text-[#FAF8F5]">
                <span className="text-[#D7D0C6]">
                  Prancha de trabalhos · {STUDIO_PROFILE.handle}
                </span>
                <button
                  type="button"
                  onClick={() => setBoardOpen(true)}
                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 font-semibold text-[#E7D5B3] underline-offset-4 hover:underline"
                >
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Ampliar acervo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Board Lightbox */}
      {boardOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Acervo completo do Instagram @aureabyln"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141210]/85 p-4"
          onClick={() => setBoardOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-[#141210]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setBoardOpen(false)}
              aria-label="Fechar acervo ampliado"
              className="absolute top-3 right-3 z-10 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-[#FAF8F5] text-[#141210]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <img
              src={STUDIO_PROFILE.feedBoardImage}
              alt="Acervo completo do perfil @aureabyln"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
