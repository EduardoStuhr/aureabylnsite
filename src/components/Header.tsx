import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Calendar, Instagram, Menu, X } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/studioData';

interface HeaderProps {
  onOpenBooking: () => void;
}

const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Trabalhos Realizados', href: '/portfolio' },
  { label: 'Serviços', href: '/servicos' },
  { label: 'Curso de Lash Design', href: '/curso' },
  { label: 'Sobre Lorrayne', href: '/sobre' },
  { label: 'Diário', href: '/diario' },
  { label: 'Contato', href: '/contato' },
];

export function Header({ onOpenBooking }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#141210]/10 bg-[#F2EDE5]">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 sm:px-6 lg:h-[72px] lg:px-10">
          {/* Zone 1 (Left): Minimal MENU trigger */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="studio-drawer-menu"
              aria-label="Abrir menu de navegação"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 pr-3 text-xs font-medium tracking-[0.2em] text-[#141210] uppercase whitespace-nowrap shrink-0 transition-colors hover:text-[#9A742E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E]"
            >
              <Menu className="h-4 w-4 stroke-[1.5]" aria-hidden="true" />
              <span>MENU</span>
            </button>
          </div>

          {/* Zone 2 (Center): Centered Editorial Brand Lockup */}
          <div className="flex flex-col items-center justify-center text-center">
            <Link
              to="/"
              className="brand-signature flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
            >
              <img src={import.meta.env.BASE_URL + 'assets/brand/ln-gold.svg'} width="62" height="39" alt="" />
              <span className="brand-name">
                <span className="font-display">{STUDIO_PROFILE.brandName}</span>
                <span className="brand-subtitle">BEAUTY STUDIO</span>
              </span>
            </Link>
          </div>

          {/* Zone 3 (Right): Instagram handle & Booking icon trigger */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <a
              href={STUDIO_PROFILE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @aurabyln"
              className="hidden min-h-[44px] items-center gap-2 text-xs font-medium text-[#141210] whitespace-nowrap shrink-0 transition-colors hover:text-[#9A742E] sm:inline-flex"
            >
              <Instagram className="h-4 w-4 stroke-[1.6]" aria-hidden="true" />
              <span>{STUDIO_PROFILE.handle}</span>
            </a>

            <button
              type="button"
              onClick={onOpenBooking}
              aria-label="Agendar horário"
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full text-[#141210] transition-colors hover:bg-[#F1EDE6] hover:text-[#9A742E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E]"
            >
              <Calendar className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Editorial Navigation Drawer */}
      {menuOpen && (
        <div
          id="studio-drawer-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação do estúdio"
          className="fixed inset-0 z-50 flex bg-[#141210]/55"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-sm flex-col justify-between bg-[#FAF8F5] p-6 text-[#141210] shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#141210]/10 pb-4">
                <div>
                  <p className="font-display text-2xl font-medium tracking-[0.12em]">
                    {STUDIO_PROFILE.brandName}
                  </p>
                  <p className="text-[10px] tracking-[0.26em] text-[#5C564E] uppercase">
                    BEAUTY STUDIO
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#141210]/15 text-[#141210] hover:bg-[#F1EDE6]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Links do menu" className="mt-8 flex flex-col divide-y divide-[#141210]/10">
                {NAV_ITEMS.map((item, idx) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[52px] items-center justify-between py-3 text-base font-medium text-[#141210] transition-colors hover:text-[#9A742E]"
                  >
                    <span className="font-display text-2xl">{item.label}</span>
                    <span className="text-xs tabular-nums text-[#5C564E]">0{idx + 1}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="space-y-3 border-t border-[#141210]/10 pt-6">
              <p className="text-xs text-[#5C564E]">
                {STUDIO_PROFILE.founderName} · {STUDIO_PROFILE.city}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBooking();
                }}
                className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-full bg-[#141210] px-6 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2621]"
              >
                Agendar horário agora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
