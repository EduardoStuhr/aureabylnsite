import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { STUDIO_SERVICES, STUDIO_WORKS } from './data/studioData';
import { HomePage, PortfolioPage as Portfolio, ServicesPage as Services, ServicePage as Service,
  CoursePage as Course, AboutPage as About, DiaryPage as Diary, ContactPage as Contact,
  NotFoundPage as NotFound } from './pages/StudioPages';
import './pages/editorial.css';

const titles: Record<string, string> = {
  '/': 'ÁURA Beauty Studio', '/portfolio': 'Trabalhos realizados', '/servicos': 'Procedimentos',
  '/curso': 'Curso de Lash Design', '/sobre': 'Lorrayne Nunes', '/diario': 'Diário da ÁURA',
  '/contato': 'Contato e agendamento',
};

function PageMetadata() {
  const { pathname } = useLocation();
  const work = STUDIO_WORKS.find(w => pathname === '/servicos/' + w.id);
  useEffect(() => {
    const title = (work?.title ?? titles[pathname] ?? 'Página não encontrada') + ' | ÁURA';
    const description = work?.technicalNote ?? ({
      '/': 'Cílios, sobrancelhas e formação profissional com Lorrayne Nunes em Afonso Cláudio.',
      '/portfolio': 'Os oito procedimentos da ÁURA em fotografias reais do estúdio.',
      '/servicos': 'Conheça os procedimentos de cílios e sobrancelhas da ÁURA.',
      '/curso': 'Informações sobre a formação presencial de Lash Design com Lorrayne Nunes.',
      '/sobre': 'Conheça o posicionamento e a filosofia de cuidado de Lorrayne Nunes.',
      '/diario': 'Publicações e momentos do estúdio ÁURA.',
      '/contato': 'Entre em contato com a ÁURA e consulte procedimentos e agendamento.',
    } as Record<string, string>)[pathname] ?? 'Navegue pelo site da ÁURA Beauty Studio.';
    document.title = title;
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
      document.querySelector(selector)?.setAttribute('content', description);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
  }, [pathname, work]);
  return null;
}

function StudioLayout() {
  const [booking, setBooking] = useState<string | null>(null);
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const onBook = useCallback((id?: string) => setBooking(id ?? STUDIO_SERVICES[0].id), []);
  const closeBooking = useCallback(() => setBooking(null), []);
  return <div className="min-h-screen bg-[#FAF8F5] text-[#141210]">
    <a href="#conteudo-principal" className="skip-link">Ir para o conteúdo</a>
    <Header onOpenBooking={() => onBook()} />
    <PageMetadata />
    <main id="conteudo-principal" tabIndex={-1} ref={main} key={pathname} className="route-content">

        <Routes>
          <Route path="/" element={<HomePage onBook={onBook} />} />
          <Route path="/portfolio" element={<Portfolio onBook={onBook} />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/servicos/:slug" element={<Service onBook={onBook} />} />
          <Route path="/curso" element={<Course onBook={onBook} />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/diario" element={<Diary />} />
          <Route path="/contato" element={<Contact onBook={onBook} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

    </main>
    <Footer onOpenBooking={() => onBook()} />
    <MobileBottomNav onOpenBooking={() => onBook()} />
    <BookingModal isOpen={booking !== null} initialServiceId={booking ?? STUDIO_SERVICES[0].id} onClose={closeBooking} />
  </div>;
}

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}><StudioLayout /></BrowserRouter>;
}
