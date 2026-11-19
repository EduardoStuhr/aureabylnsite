import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { STUDIO_METRICS, STUDIO_PROFILE } from '../data/studioData';
import { AuraWebGLCanvas } from './AuraWebGLCanvas';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

const HERO_HIGHLIGHTS = [
  {
    id: 'manifesto',
    label: 'Manifesto do Estúdio',
    text: '“Cuidar de você também é saúde, autoestima e bem-estar. Pequenos detalhes fazem grandes diferenças.”',
  },
  {
    id: 'tecnica',
    label: 'Visagismo & Técnica',
    text: 'Mapping personalizado para o formato de cada olho, fios tecnológicos em seda e isolamento fio a fio seguro.',
  },
  {
    id: 'formacao',
    label: 'Educação & Mentoria',
    text: 'Formação presencial em Afonso Cláudio/ES com Lorrayne Nunes — Embaixadora Florescer Beauty.',
  },
];

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(0);

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#141210]/10 bg-[#FAF8F5]"
    >
      {/* Interactive Three.js WebGL Silk & Champagne Dust Layer */}
      <AuraWebGLCanvas className="absolute inset-0 z-0 h-full w-full" />

      <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-10 lg:pt-2">
        {/* Split-Screen Editorial Hero matching reference proportions & seamless table edge */}
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-0">
          {/* Portrait & Organic Brushstrokes Column (Top on Mobile, Right on Desktop — flush bottom/right) */}
          <div className="relative order-first flex min-h-[400px] items-end justify-end sm:min-h-[540px] lg:order-last lg:col-span-7 lg:-mr-10 lg:min-h-[670px]">
            {/* Subtle Organic Curved Brushstroke Ribbons behind portrait */}
            <svg
              aria-hidden="true"
              viewBox="0 0 640 520"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
              fill="none"
            >
              <g className="origin-center max-lg:motion-safe:animate-spin max-lg:motion-safe:[animation-duration:32s]">
                <path
                  d="M78 440C42 290 128 118 286 64C415 20 532 95 572 222"
                  stroke="#EAE1D5"
                  strokeWidth="36"
                  strokeLinecap="round"
                />
                <path
                  d="M148 475C168 310 264 166 434 128C536 105 606 142 630 198"
                  stroke="#EFE7DC"
                  strokeWidth="26"
                  strokeLinecap="round"
                />
                <path
                  d="M44 218C96 134 198 116 286 154"
                  stroke="#F2ECE2"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
              </g>
            </svg>

            {/* Full-scale Portrait with untouched natural grayscale tonality, table cutting flush at bottom/right */}
            <div className="relative flex h-[410px] w-full items-end justify-center sm:h-[550px] lg:h-[680px] lg:justify-end">
              {!heroImgFailed ? (
                <img
                  src={STUDIO_PROFILE.heroImage}
                  alt="Lorrayne Nunes, Lash Designer e Educadora do Áurea Studio Beauty (@aureabyln)"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="h-full w-auto max-w-none object-contain object-right-bottom"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-[#F1EDE6] p-8 text-center">
                  <span className="font-display text-3xl font-semibold text-[#141210]">
                    ÁUREA STUDIO BEAUTY
                  </span>
                  <span className="mt-2 text-sm text-[#5C564E]">
                    Lorrayne Nunes · @aureabyln
                  </span>
                </div>
              )}
            </div>

            {/* Editorial Side Callout in clean open cream space beside portrait */}
            <div className="pointer-events-none absolute right-2 bottom-4 rounded-xl bg-[#FAF8F5]/95 px-3 py-2 sm:right-4 sm:bottom-12 lg:top-[20%] lg:right-0 lg:bottom-auto lg:translate-y-0 lg:bg-transparent lg:p-0">
              <div className="border-l border-[#9A742E] pl-3 sm:pl-4">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9A742E] uppercase sm:text-[11px]">
                  {STUDIO_PROFILE.founderName}
                </p>
                <p className="font-display mt-0.5 text-lg leading-tight italic text-[#141210] sm:text-xl">
                  Lash Designer
                  <br />e Educadora
                </p>
              </div>
            </div>
          </div>

          {/* Left Typographic Column (2nd on Mobile, Left on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-last flex flex-col justify-center pb-8 lg:order-first lg:col-span-5 lg:py-12"
          >
            {/* Line + Kicker */}
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-7 shrink-0 bg-[#9A742E]" aria-hidden="true" />
              <p className="text-[11px] font-medium tracking-[0.18em] text-[#46413B] uppercase">
                Cílios · Sobrancelhas · Lash Design
              </p>
            </div>

            <h1
              className="font-display mt-4 text-[clamp(2.35rem,5.2vw,4.35rem)] leading-[1.02] font-medium tracking-tight text-[#141210] sm:mt-5"
              style={{ textWrap: 'balance' }}
            >
              Beleza que transforma no detalhe do olhar.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#46413B] sm:mt-5 sm:text-base">
              Sob a assinatura de{' '}
              <strong className="font-semibold text-[#141210]">
                {STUDIO_PROFILE.founderName}
              </strong>{' '}
              ({STUDIO_PROFILE.handle}), Embaixadora Florescer Beauty em{' '}
              {STUDIO_PROFILE.city}: visagismo de precisão, cuidado individual e
              resultado natural.
            </p>

            {/* Pill Buttons adapted to studio palette */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:mt-8">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#141210] px-7 py-3 text-sm font-semibold text-[#FAF8F5] whitespace-nowrap transition-all duration-200 hover:bg-[#2B2621] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E] sm:flex-none"
              >
                <span>Agendar horário</span>
                <ArrowRight className="h-4 w-4 text-[#C6A464]" aria-hidden="true" />
              </button>

              <a
                href="#clientes"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-[#141210] bg-transparent px-7 py-3 text-sm font-semibold text-[#141210] whitespace-nowrap transition-colors duration-200 hover:bg-[#F1EDE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E] sm:flex-none"
              >
                Ver trabalhos
              </a>
            </div>

            {/* Interactive 3-step highlight switcher */}
            <div className="mt-8 border-t border-[#141210]/10 pt-5 lg:mt-10">
              <div className="flex items-center gap-2" role="tablist" aria-label="Destaques do estúdio">
                {HERO_HIGHLIGHTS.map((item, idx) => {
                  const isActive = activeHighlight === idx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={item.label}
                      onClick={() => setActiveHighlight(idx)}
                      className="flex min-h-[36px] min-w-[28px] cursor-pointer items-center justify-center rounded-full px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E]"
                    >
                      <span
                        className={`block h-2.5 rounded-full transition-all duration-200 ${
                          isActive
                            ? 'w-6 bg-[#9A742E]'
                            : 'w-2.5 border border-[#5C564E]/60 bg-transparent hover:border-[#141210]'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs font-medium text-[#5C564E]">
                  {HERO_HIGHLIGHTS[activeHighlight].label}
                </span>
              </div>
              <p className="font-display mt-2.5 min-h-[48px] text-base italic leading-snug text-[#2B2621] sm:text-lg">
                {HERO_HIGHLIGHTS[activeHighlight].text}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Authority Strip directly beneath the cut bench edge */}
        <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-[#141210]/12 bg-[#FAF8F5] py-7 sm:gap-6 lg:grid-cols-4 lg:py-8">
          {STUDIO_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-display text-2xl font-semibold text-[#141210] sm:text-3xl">
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
