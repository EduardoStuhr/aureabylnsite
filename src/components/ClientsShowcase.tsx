import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { STUDIO_WORKS, type StudioWorkItem, type WorkCategory } from '../data/studioData';
import { filterWorksByCategory } from '../utils/studioLogic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './portfolio.css';

gsap.registerPlugin(ScrollTrigger);

const categories: WorkCategory[] = ['Todos', 'Sobrancelhas', 'Cílios'];
export function ClientsShowcase({ onBook }: { onBook: () => void }) {
  const [category, setCategory] = useState<WorkCategory>('Todos');
  const [query, setQuery] = useState('');
  const works = useMemo(() => filterWorksByCategory(STUDIO_WORKS, category, query), [category, query]);
  const [current, setCurrent] = useState(0);
  const [detail, setDetail] = useState<StudioWorkItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const section = useRef<HTMLElement>(null);
  const showBooking = category === 'Todos' && !query.trim();
  const rail = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (detail) dialog.current?.showModal();
  }, [detail]);

  useLayoutEffect(() => {
    const track = rail.current;
    const root = section.current;
    setCurrent(0);
    if (!track || !root) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 767px) and (max-height: 35rem)');
    let ctx: gsap.Context;
    let frame = 0;
    const distance = () => Math.max(0, track.scrollWidth - root.clientWidth);
    function configure() {
      if (!track || !root) return;
      ctx?.revert();
      trigger.current = null;
      delete root.dataset.layout;
      setCurrent(0);
      if (motion.matches || !distance()) {
        root.dataset.layout = 'grid';
      } else if (compact.matches) {
        root.dataset.layout = 'snap';
      } else {
        ctx = gsap.context(() => {
          const cards = Array.from(track.querySelectorAll('article'));
          const horizontalTween = gsap.to(track, {
            x: () => -distance(), ease: 'none',
            onUpdate: () => {
              const center = -Number(gsap.getProperty(track, 'x')) + root.clientWidth / 2;
              const nearest = cards.reduce((best, card, i) =>
                Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) <
                Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - center) ? i : best, 0);
              setCurrent(Math.abs(Number(gsap.getProperty(track, 'x'))) < 1 ? 0 : nearest);
            },
            scrollTrigger: {
              trigger: root, pin: true, start: 'top top', end: () => '+=' + distance(),
              scrub: true, invalidateOnRefresh: true,
            },
          });
          trigger.current = horizontalTween.scrollTrigger!;
          for (const card of cards) {
            const childTrigger = { trigger: card, containerAnimation: horizontalTween };
            gsap.fromTo(card.querySelectorAll('.portfolio-category, h3'), { yPercent: 60, opacity: 0 }, {
              yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.05,
              scrollTrigger: { ...childTrigger, start: 'left 85%', toggleActions: 'play none none reverse' },
            });
          }
        }, root);
      }
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(configure);
    }
    configure();
    let width = root.clientWidth;
    const observer = new ResizeObserver(() => {
      if (width !== root.clientWidth) {
        width = root.clientWidth;
        schedule();
      }
    });
    observer.observe(root);
    motion.addEventListener('change', schedule);
    compact.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', schedule);
      compact.removeEventListener('change', schedule);
      ctx?.revert();
      delete root.dataset.layout;
      trigger.current = null;
    };
  }, [works, showBooking]);

  function resetFilterPosition() {
    const animation = trigger.current;
    if (animation?.isActive) window.scrollTo({ top: animation.start, behavior: 'instant' });
  }

  function revealFocusedCard(card: HTMLElement) {
    const animation = trigger.current;
    if (!animation) return;
    const travel = animation.end - animation.start;
    const offset = gsap.utils.clamp(0, travel, card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2);
    window.scrollTo({ top: animation.start + offset, behavior: 'instant' });
  }

  return (
    <section id="clientes" className="portfolio" ref={section} aria-labelledby="trabalhos-heading">
      <div className="portfolio-stage">
        <div className="portfolio-head">
          <h2 id="trabalhos-heading" className="font-display">Trabalhos realizados<br />&amp; resultados do estúdio.</h2>
          <div className="portfolio-tools">
            <input type="search" aria-label="Buscar trabalho ou técnica" placeholder="Buscar técnica" value={query} onChange={e => { resetFilterPosition(); setQuery(e.target.value); }} />
            <div role="group" aria-label="Categorias">{categories.map(cat =>
              <button key={cat} aria-pressed={cat === category} onClick={() => { resetFilterPosition(); setCategory(cat); }}>{cat}</button>
            )}</div>
          </div>
        </div>
        {works.length ? <>
          <div className="portfolio-window" role="region" aria-label="Galeria de trabalhos">
            <div ref={rail} className="portfolio-rail">
            {works.map((work, index) => {
              const width = work.id === 'henna' ? 810 : work.id === 'hibrido' ? 1031 : 1080;
              return (
              <article key={work.id} data-current={current === index} style={{ '--photo-ratio': width / 1440 } as CSSProperties}>
                <button className="portfolio-photo" aria-label={'Ver detalhes de ' + work.title}
                  onFocus={e => { if (e.currentTarget.matches(':focus-visible')) revealFocusedCard(e.currentTarget.parentElement!); }}
                  onClick={() => setDetail(work)}>
                  <img src={work.imageSrc} alt={work.imageAlt} loading="lazy" width={width} height={1440} decoding="async" />
                  <b className="portfolio-number font-display" aria-hidden="true">{String(index + 1).padStart(2, '0')}</b>
                  <span><Expand size={17} /></span>
                </button>
                <p className="portfolio-category">{work.category}</p>
                <h3 className="font-display">{work.title}</h3>
                <p className="portfolio-note">{work.technicalNote}</p>
              </article>
              );
            })}
            {showBooking && <aside className="portfolio-booking">
              <h3 className="font-display">Quer o seu resultado aqui?</h3>
              <button onClick={onBook} onFocus={e => { if (e.currentTarget.matches(':focus-visible')) revealFocusedCard(e.currentTarget.parentElement!); }}>Consultar agendamento</button>
            </aside>}
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
