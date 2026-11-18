interface HeaderProps {
  onOpenBooking: () => void;
}

export function Header({ onOpenBooking }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#141210]/10 bg-[#FAF8F5]/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:h-16 lg:px-10">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#inicio"
          className="font-display text-2xl font-semibold tracking-[0.14em] text-[#141210] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
        >
          ÁUREA
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C564E]"
        >
          <a
            href="#inicio"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-200 hover:text-[#141210] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
          >
            Início
          </a>
          <a
            href="#clientes"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-200 hover:text-[#141210] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
          >
            Clientes
          </a>
          <a
            href="#servicos"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-200 hover:text-[#141210] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
          >
            Serviços
          </a>
          <a
            href="#curso"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-200 hover:text-[#141210] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
          >
            Curso
          </a>
          <a
            href="#instagram"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-200 hover:text-[#141210] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A742E]"
          >
            Diário
          </a>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBooking}
            className="min-h-[40px] cursor-pointer rounded-full bg-[#141210] px-5 py-2 text-xs font-semibold tracking-wide text-[#FAF8F5] whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-[#2B2621] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A742E]"
          >
            Agendar
          </button>
        </div>
      </div>
    </header>
  );
}
