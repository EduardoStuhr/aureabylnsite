import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { STUDIO_WORKS, type StudioWorkItem, type WorkCategory } from '../data/studioData';
import { filterWorksByCategory } from '../utils/studioLogic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './portfolio.css';

gsap.registerPlugin(ScrollTrigger);

const categories: WorkCategory[] = ['Todos', 'Sobrancelhas', 'Cílios'];
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
  const trigger = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (detail) dialog.current?.showModal();
  }, [detail]);

  useLayoutEffect(() => {
    const strip = rail.current;
    const panel = stage.current;
    const root = section.current;
    setCurrent(0);
    if (!strip || !panel || !root || works.length < 2) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, strip.scrollWidth - strip.clientWidth);
      const headerHeight = () => document.querySelector('header')?.offsetHeight ?? 0;
      const tween = gsap.to(strip, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          pin: panel,
          start: () => 'top ' + Math.min(headerHeight(), window.innerHeight - panel.offsetHeight) + 'px',
          end: () => '+=' + distance(),
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: self => setCurrent(Math.round(self.progress * (works.length - 1))),
        },
      });
      trigger.current = tween.scrollTrigger!;
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(strip);
      return () => {
        observer.disconnect();
        trigger.current = null;
      };
    });
    return () => media.revert();
  }, [works]);

  function revealFocusedCard(card: HTMLElement) {
    const animation = trigger.current;
    const strip = rail.current;
    if (!animation || !strip) return;
    const travel = strip.scrollWidth - strip.clientWidth;
    const offset = Math.max(0, Math.min(travel, card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2));
    if (travel) window.scrollTo({ top: animation.start + offset, behavior: 'instant' });
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
          <div className="portfolio-window" role="region" aria-label="Galeria de trabalhos">
            <div ref={rail} className="portfolio-rail">
            {works.map((work, index) => (
              <article key={work.id} data-current={current === index}>
                <button className="portfolio-photo" aria-label={'Ver detalhes de ' + work.title}
                  onFocus={e => { if (e.currentTarget.matches(':focus-visible')) revealFocusedCard(e.currentTarget.parentElement!); }}
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
          </div>
          <p className="portfolio-progress" aria-label="Posição na galeria">
            {String(current + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
          </p>
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
