import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, MapPin } from 'lucide-react';
import { StudioAddress } from './StudioLocation';
import { studioDirectionsUrl } from '../data/studioLocation';
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
              <li><Link to="/sobre" className="hover:text-[#FAF8F5]">Sobre Lorrayne</Link></li>
              <li><Link to="/diario" className="hover:text-[#FAF8F5]">Diário</Link></li>
              <li><Link to="/contato" className="hover:text-[#FAF8F5]">Contato</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-wide text-[#E7D5B3]">
              Estúdio &amp; Contato
            </p>
            <div className="mt-3 space-y-2.5 text-sm text-[#D7D0C6]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#C6A464]" aria-hidden="true" />
                <a className="underline underline-offset-4 hover:text-[#FAF8F5]" href={studioDirectionsUrl}>Como chegar ↗</a>
              </p>
              <StudioAddress />
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>{STUDIO_PROFILE.roleTitle}</p>
            <a
              href="https://kisestudio.com.br"
              className="inline-flex min-h-[44px] items-center"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D5B3]/40 px-3 py-1.5 text-[#E7D5B3] transition-colors hover:bg-[#E7D5B3] hover:text-[#141210]">
                Feito por Kise Studios
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
