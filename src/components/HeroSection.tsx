import { useState } from 'react';
import { ArrowDownRight, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { STUDIO_METRICS, STUDIO_PROFILE } from '../data/studioData';
import { AuraWebGLCanvas } from './AuraWebGLCanvas';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#141210]/10 bg-[#FAF8F5]"
    >
      {/* Interactive Three.js WebGL Silk & Champagne Dust Layer */}
      <AuraWebGLCanvas className="absolute inset-0 z-0 h-full w-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
        {/* Split-Screen Editorial Hero — Portrait appears first on Mobile so both photo + headline shine above the fold */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Portrait Column (1st on Mobile, Right on Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="order-first lg:order-last lg:col-span-6"
          >
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl border border-[#141210]/12 bg-[#DFDFDF] sm:h-[460px] lg:h-[600px]">
              {!heroImgFailed ? (
                <img
                  src={STUDIO_PROFILE.heroImage}
                  alt="Lorrayne Nunes, fundadora do Áurea Studio Beauty (@aureabyln), em retrato editorial"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="h-full w-full object-cover object-[50%_15%] lg:object-contain lg:object-bottom"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EBE7DF] to-[#D8CFC0] p-8 text-center">
                  <span className="font-display text-3xl font-semibold text-[#141210]">
                    ÁUREA STUDIO BEAUTY
                  </span>
                  <span className="mt-2 text-sm text-[#5C564E]">
                    Lorrayne Nunes · @aureabyln
                  </span>
                </div>
              )}

              {/* Subtle bottom-left editorial label with solid dark legibility scrim */}
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl bg-[#141210]/85 px-3.5 py-2 text-[#FAF8F5] sm:bottom-4 sm:left-4">
                <p className="text-[11px] font-medium tracking-wide text-[#E7D5B3]">
                  Fundadora &amp; Educadora · {STUDIO_PROFILE.handle}
                </p>
                <p className="font-display text-lg leading-tight font-medium text-[#FAF8F5]">
                  {STUDIO_PROFILE.founderName}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Editorial Typographic Column (2nd on Mobile, Left on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-last flex flex-col justify-between lg:order-first lg:col-span-6 lg:py-4"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-[#5C564E]">
                {STUDIO_PROFILE.handle} · {STUDIO_PROFILE.city} · Lash Design &amp; Sobrancelhas
              </p>

              <h1
                className="font-display mt-3 text-[clamp(2.15rem,5.5vw,4.35rem)] leading-[1.04] font-medium tracking-tight text-[#141210] lg:mt-5"
                style={{ textWrap: 'balance' }}
              >
                Beleza que transforma no detalhe do olhar.
              </h1>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#46413B] sm:mt-5 sm:text-base lg:text-lg">
                Sob a assinatura de{' '}
                <strong className="font-semibold text-[#141210]">
                  {STUDIO_PROFILE.founderName}
                </strong>
                , Embaixadora Florescer Beauty e educadora, o Áurea Studio Beauty
                une visagismo de precisão, retenção impecável e acolhimento para
                revelar sua melhor expressão.
              </p>

              {/* Primary CTA & Secondary Action */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#141210] px-6 py-3 text-sm font-semibold text-[#FAF8F5] whitespace-nowrap transition-all duration-200 hover:bg-[#2B2621] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E] sm:flex-none sm:px-7"
                >
                  <span>Agendar horário</span>
                  <ArrowDownRight className="h-4 w-4 text-[#C6A464]" aria-hidden="true" />
                </button>

                <a
                  href="#clientes"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#141210]/20 bg-[#FAF8F5]/95 px-5 py-3 text-sm font-medium text-[#141210] whitespace-nowrap transition-colors duration-200 hover:border-[#141210] hover:bg-[#F1EDE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E] sm:flex-none sm:px-6"
                >
                  Ver clientes
                </a>
              </div>
            </div>

            {/* Founder Signature Quote */}
            <div className="mt-7 border-t border-[#141210]/10 pt-4 lg:mt-10 lg:pt-5">
              <p className="font-display text-base italic leading-snug text-[#2B2621] sm:text-xl">
                “{STUDIO_PROFILE.manifestoQuote}”
              </p>
              <div className="mt-2.5 flex flex-col gap-1 text-xs text-[#5C564E] sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                <span className="font-semibold text-[#141210]">
                  {STUDIO_PROFILE.founderName} · {STUDIO_PROFILE.roleTitle}
                </span>
                <a
                  href={STUDIO_PROFILE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#9A742E] underline-offset-4 hover:underline"
                >
                  <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{STUDIO_PROFILE.handle}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Authority Strip below the split */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#141210]/12 pt-6 sm:gap-6 lg:mt-14 lg:grid-cols-4 lg:pt-8">
          {STUDIO_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-display text-2xl font-semibold tabular-nums text-[#141210] sm:text-3xl">
                {metric.value}
              </p>
              <p className="text-sm font-semibold text-[#141210]">{metric.label}</p>
              <p className="text-xs leading-relaxed text-[#5C564E]">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Editorial Marquee Divider */}
      <div className="overflow-hidden border-t border-[#141210]/10 bg-[#141210] py-2.5 text-[#FAF8F5]">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap text-xs font-medium tracking-[0.16em] text-[#E7D5B3]">
          {[0, 1].map((loopIndex) => (
            <div key={loopIndex} className="flex items-center gap-8">
              <span>ÁUREA STUDIO BEAUTY</span>
              <span aria-hidden="true">·</span>
              <span>@AUREABYLN</span>
              <span aria-hidden="true">·</span>
              <span>LASH DESIGN &amp; SOBRANCELHAS</span>
              <span aria-hidden="true">·</span>
              <span>AFONSO CLÁUDIO / ES</span>
              <span aria-hidden="true">·</span>
              <span>EMBAIXADORA FLORESCER BEAUTY</span>
              <span aria-hidden="true">·</span>
              <span>CURSO VIP TURMAS ABERTAS</span>
              <span aria-hidden="true">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
