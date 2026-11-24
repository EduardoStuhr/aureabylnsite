import { Link } from 'react-router-dom';
import { Instagram, MapPin } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/studioData';

interface FooterProps {
  onOpenBooking: () => void;
}

export function Footer({ onOpenBooking }: FooterProps) {
  return (
    <footer className="bg-[#141210] pb-20 text-[#FAF8F5] md:pb-12">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 border-b border-[#FAF8F5]/15 pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-semibold tracking-[0.14em] text-[#FAF8F5]">
              {STUDIO_PROFILE.brandName}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#D7D0C6]">
              {STUDIO_PROFILE.fullTitle} por {STUDIO_PROFILE.founderName}.
              Lash Design, Design de Sobrancelhas e Formação Profissional com
              atendimento exclusivo em {STUDIO_PROFILE.city}.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-wide text-[#E7D5B3]">
              Navegação
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#D7D0C6]">
              <li>
                <Link to="/" className="hover:text-[#FAF8F5]">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-[#FAF8F5]">
                  Trabalhos Realizados
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="hover:text-[#FAF8F5]">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/curso" className="hover:text-[#FAF8F5]">
                  Curso de Lash Design
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-wide text-[#E7D5B3]">
              Estúdio &amp; Contato
            </p>
            <div className="mt-3 space-y-2.5 text-sm text-[#D7D0C6]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#C6A464]" aria-hidden="true" />
                <span>{STUDIO_PROFILE.city}</span>
              </p>
              <a
                href={STUDIO_PROFILE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FAF8F5] hover:text-[#E7D5B3]"
              >
                <Instagram className="h-4 w-4 shrink-0 text-[#C6A464]" aria-hidden="true" />
                <span>{STUDIO_PROFILE.handle}</span>
              </a>
              <button
                type="button"
                onClick={onOpenBooking}
                className="mt-2 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-[#E7D5B3]/40 px-5 py-2 text-xs font-semibold text-[#E7D5B3] transition-colors hover:bg-[#E7D5B3] hover:text-[#141210]"
              >
                Agendar horário agora
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-[#9C9488] sm:flex-row sm:items-center">
          <p>© 2026 {STUDIO_PROFILE.fullTitle} · Todos os direitos reservados.</p>
          <p>{STUDIO_PROFILE.roleTitle}</p>
        </div>
      </div>
    </footer>
  );
}
