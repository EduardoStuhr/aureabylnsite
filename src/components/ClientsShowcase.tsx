import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Expand, X } from 'lucide-react';
import { STUDIO_WORKS, type StudioWorkItem, type WorkCategory } from '../data/studioData';
import './portfolio.css';

export function ClientsShowcase({ preview = false }: { preview?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTechnique = preview ? null : searchParams.get('tecnica');
  const selectedWork = STUDIO_WORKS.find(work => work.id === selectedTechnique);
  const Heading = preview ? 'h2' : 'h1';
  const [category, setCategory] = useState<WorkCategory>('Todos');
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<StudioWorkItem | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const works = STUDIO_WORKS.filter(work =>
    (!selectedWork || selectedWork.id === work.id) &&
    (category === 'Todos' || category === work.category) &&
    (work.title + ' ' + work.technicalNote).toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR').trim())
  ).slice(0, preview ? 4 : undefined);

  useEffect(() => { if (detail) dialog.current?.showModal(); }, [detail]);

  useLayoutEffect(() => {
    const grid = gallery.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.portfolio-card'));
    const measure = () => {
      const gap = parseFloat(getComputedStyle(grid).rowGap);
      for (const card of cards) {
        const article = card.parentElement!;
        article.style.gridRowEnd = 'span ' + Math.ceil((card.getBoundingClientRect().height + gap) / (8 + gap));
      }
    };
    const observer = new ResizeObserver(measure);
    for (const card of cards) observer.observe(card);
    measure();
    return () => observer.disconnect();
  }, [category, query, preview, selectedTechnique]);

  return (
    <section className={'portfolio editorial-shell' + (preview ? '' : ' portfolio-exhibition')} aria-labelledby="trabalhos-heading">
      <div className="portfolio-heading">
        <p className="eyebrow">Olhares da ÁURA · Resultados reais</p>
        <Heading id="trabalhos-heading" className="font-display">Trabalhos realizados<br />&amp; resultados do estúdio.</Heading>
        {!preview && <p>Olhares, detalhes e resultados reais do estúdio.</p>}
        {selectedWork && <p className="selected-technique">{selectedWork.title} <button onClick={() => { setSearchParams({}); setCategory('Todos'); setQuery(''); }}>Ver todos os trabalhos</button></p>}
        {preview ? <Link className="editorial-link" to="/portfolio">Conhecer o portfólio completo →</Link> :
          <div className="portfolio-tools">
            <input type="search" aria-label="Buscar trabalho ou técnica" placeholder="Buscar técnica" value={query} onChange={e => setQuery(e.target.value)} />
            <div role="group" aria-label="Categorias">
              {(['Todos', 'Sobrancelhas', 'Cílios'] as WorkCategory[]).map(cat =>
                <button key={cat} aria-pressed={cat === category} onClick={() => setCategory(cat)}>{cat}</button>
              )}
            </div>
          </div>}
      </div>
      <div className="editorial-gallery" ref={gallery}>
        {works.map((work, index) => <article key={work.id} className="editorial-work"><div className="portfolio-card">
          <button className="portfolio-photo" aria-label={'Ver detalhes de ' + work.title}
            onClick={e => { opener.current = e.currentTarget; setDetail(work); }}>
            <img src={work.imageSrc} alt={work.imageAlt} loading="lazy" decoding="async"
              width={work.id === 'henna' ? 810 : work.id === 'hibrido' ? 1031 : 1080} height={1440} />
            <span className="photo-action"><Expand size={18} aria-hidden="true" /><span>Ver o resultado</span></span>
          </button>
          <div className="portfolio-caption"><p className="eyebrow">{String(index + 1).padStart(2, '0')} · {work.category}</p>
          <h3 className="font-display">{work.title}</h3>
          {preview && <p>{work.technicalNote}</p>}
          <Link className="editorial-link" to={preview ? '/servicos/' + work.id : '/servicos?procedimento=' + work.id}>Conhecer o procedimento →</Link>
          </div></div>
        </article>)}
      </div>
      {!works.length && <p role="status">Nenhum trabalho encontrado. <button className="editorial-link" onClick={() => { setQuery(''); setCategory('Todos'); }}>Limpar filtros</button></p>}
      <dialog ref={dialog} className="portfolio-dialog" aria-labelledby="work-title"
        onClose={() => { setDetail(null); opener.current?.focus({ preventScroll: true }); }}
        onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
        {detail && <div>
          <button className="portfolio-close" aria-label="Fechar detalhes" onClick={() => dialog.current?.close()}><X /></button>
          <h3 id="work-title" className="font-display">{detail.title}</h3>
          <p className="eyebrow">{detail.category}</p>
          <img src={detail.imageSrc} alt={detail.imageAlt} />
          {detail.secondImage && <img src={detail.secondImage} alt="Outro resultado de volume egípcio no estúdio" />}
          <Link className="editorial-link" to={'/servicos?procedimento=' + detail.id}>Conhecer o procedimento →</Link>
        </div>}
      </dialog>
    </section>
  );
}
