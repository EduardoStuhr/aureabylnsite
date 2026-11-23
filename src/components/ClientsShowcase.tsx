import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { STUDIO_WORKS, type StudioWorkItem, type WorkCategory } from '../data/studioData';
import { filterWorksByCategory } from '../utils/studioLogic';
import './portfolio.css';

const categories: WorkCategory[] = ['Todos', 'Sobrancelhas', 'Cílios'];
const desktopQuery = '(min-width: 64rem) and (min-height: 40rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function ClientsShowcase() {
  const [category, setCategory] = useState<WorkCategory>('Todos');
  const [query, setQuery] = useState('');
  const works = useMemo(() => filterWorksByCategory(STUDIO_WORKS, category, query), [category, query]);
  const [current, setCurrent] = useState(0);
  const [detail, setDetail] = useState<StudioWorkItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const pin = useRef(false);

  useEffect(() => {
    if (detail) dialog.current?.showModal();
  }, [detail]);

  useLayoutEffect(() => {
    const root = section.current!;
    const panel = stage.current!;
    const strip = rail.current;
    if (!strip) {
      root.style.removeProperty('height');
      return;
    }
    const media = matchMedia(desktopQuery);
    const offsets = () => Array.from(strip.children, card => (card as HTMLElement).offsetLeft);
    let stops: number[] = [];
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pin.current) {
        strip.scrollLeft = Math.max(0, parseFloat(getComputedStyle(panel).top) - root.getBoundingClientRect().top);
      }
      const x = strip.scrollLeft;
      setCurrent(stops.reduce((best, value, idx) => Math.abs(value - x) < Math.abs(stops[best] - x) ? idx : best, 0));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      stops = offsets();
      pin.current = media.matches && stops.length > 1 && panel.offsetHeight <= window.innerHeight - 72;
      root.toggleAttribute('data-pinned', pin.current);
      root.style.height = pin.current ? panel.offsetHeight + strip.scrollWidth - strip.clientWidth + 'px' : '';
      update();
    };
    strip.scrollLeft = 0;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    observer.observe(strip);
    media.addEventListener('change', measure);
    window.addEventListener('scroll', schedule, { passive: true });
    strip.addEventListener('scroll', schedule, { passive: true });
    return () => {
      observer.disconnect();
      media.removeEventListener('change', measure);
      window.removeEventListener('scroll', schedule);
      strip.removeEventListener('scroll', schedule);
      cancelAnimationFrame(frame);
      root.removeAttribute('data-pinned');
      root.style.removeProperty('height');
      pin.current = false;
    };
  }, [works]);

  function go(index: number, instant = false) {
    const strip = rail.current!;
    const card = strip.children[index] as HTMLElement | undefined;
    if (!card) return;
    const behavior = instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (pin.current) {
      window.scrollTo({ top: window.scrollY + section.current!.getBoundingClientRect().top - 72 + card.offsetLeft, behavior });
    } else {
      strip.scrollTo({ left: card.offsetLeft, behavior });
    }
  }

  return (
    <section id="clientes" className="portfolio" ref={section} aria-labelledby="trabalhos-heading">
      <div ref={stage} className="portfolio-stage">
        <div className="portfolio-head">
          <h2 id="trabalhos-heading" className="font-display">Trabalhos realizados<br />&amp; resultados do estúdio.</h2>
          <div className="portfolio-tools">
            <input type="search" aria-label="Buscar trabalho ou técnica" placeholder="Buscar técnica" value={query} onChange={e => setQuery(e.target.value)} />
            <div role="group" aria-label="Categorias">{categories.map(cat =>
              <button key={cat} aria-pressed={cat === category} onClick={() => setCategory(cat)}>{cat}</button>
            )}</div>
          </div>
        </div>
        {works.length ? <>
          <div ref={rail} className="portfolio-rail" aria-label="Galeria de trabalhos" role="region"
            onKeyDown={event => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              const next = Math.min(works.length - 1, Math.max(0, current + (event.key === 'ArrowRight' ? 1 : -1)));
              const button = rail.current?.children[next]?.querySelector('button');
              button?.focus({ preventScroll: true });
              go(next);
            }}>
            {works.map((work, index) => (
              <article key={work.id} data-current={current === index}>
                <button className="portfolio-photo" aria-label={'Ver detalhes de ' + work.title}
                  onFocus={e => { if (e.currentTarget.matches(':focus-visible')) go(index, true); }}
                  onClick={() => setDetail(work)}>
                  <img src={work.imageSrc} alt={work.imageAlt} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
                  <span><Expand size={17} /></span>
                </button>
                <p className="portfolio-category">{work.category}</p>
                <h3 className="font-display">{work.title}</h3>
                <p className="portfolio-note">{work.technicalNote}</p>
              </article>
            ))}
          </div>
          <div className="portfolio-controls">
            <span aria-label="Posição na galeria">{current + 1} / {works.length}</span>
            <button aria-label="Trabalho anterior" disabled={!current} onClick={() => go(current - 1)}><ArrowLeft /></button>
            <button aria-label="Próximo trabalho" disabled={current >= works.length - 1} onClick={() => go(current + 1)}><ArrowRight /></button>
          </div>
        </> : <p>Nenhum trabalho encontrado. <button className="underline" onClick={() => { setCategory('Todos'); setQuery(''); }}>Limpar filtros</button></p>}
      </div>
      <dialog ref={dialog} className="portfolio-dialog" aria-labelledby="work-title" onClose={() => setDetail(null)}
        onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
        {detail && <div>
          <button className="portfolio-close" aria-label="Fechar detalhes" onClick={() => dialog.current?.close()}><X /></button>
          <h3 id="work-title" className="font-display">{detail.title}</h3>
          <p>{detail.technicalNote}</p>
          <img src={detail.imageSrc} alt={detail.imageAlt} />
          {detail.secondImage && <img src={detail.secondImage} alt="Outro resultado de volume egípcio no estúdio" />}
        </div>}
      </dialog>
    </section>
  );
}
