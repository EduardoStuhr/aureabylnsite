import { CalendarCheck, Home, Sparkles, Users } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: 'inicio' | 'clientes' | 'servicos';
  onNavigate: (section: 'inicio' | 'clientes' | 'servicos') => void;
  onOpenBooking: () => void;
}

export function MobileBottomNav({
  activeSection,
  onNavigate,
  onOpenBooking,
}: MobileBottomNavProps) {
  const navItemClass = (isActive: boolean) =>
    `flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 ${
      isActive ? 'text-[#9A742E]' : 'text-[#5C564E] hover:text-[#141210]'
    }`;

  return (
    <nav
      aria-label="Navegação rápida mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#141210]/10 bg-[#FAF8F5]/96 md:hidden"
    >
      <div className="mx-auto grid h-14 max-w-md grid-cols-4 items-center px-2">
        <a
          href="#inicio"
          onClick={() => onNavigate('inicio')}
          className={navItemClass(activeSection === 'inicio')}
        >
          <Home className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          <span>Início</span>
        </a>

        <a
          href="#clientes"
          onClick={() => onNavigate('clientes')}
          className={navItemClass(activeSection === 'clientes')}
        >
          <Users className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          <span>Trabalhos</span>
        </a>

        <a
          href="#servicos"
          onClick={() => onNavigate('servicos')}
          className={navItemClass(activeSection === 'servicos')}
        >
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          <span>Serviços</span>
        </a>

        <button
          type="button"
          onClick={onOpenBooking}
          className="flex min-h-[44px] cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#141210] whitespace-nowrap transition-colors duration-150 hover:text-[#9A742E]"
        >
          <CalendarCheck className="h-[18px] w-[18px] text-[#9A742E]" strokeWidth={2} aria-hidden="true" />
          <span>Agendar</span>
        </button>
      </div>
    </nav>
  );
}
