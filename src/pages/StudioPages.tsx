import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ClientsShowcase } from '../components/ClientsShowcase';
import { HeroSection } from '../components/HeroSection';
import { InstagramArchive } from '../components/InstagramArchive';
import { STUDIO_COURSE, STUDIO_PROFILE, STUDIO_SERVICES, STUDIO_WORKS } from '../data/studioData';
import { useEffect, useState } from 'react';
import { studioWhatsAppUrl } from '../utils/studioLogic';
import './service-catalog.css';
import { formatServicePrice, formatServiceDuration } from '../utils/studioLogic';
import './service-prices.css';

type BookingProps = { onBook: (id?: string) => void };

export function ContactCallout({ onBook }: BookingProps) {
  return <section className="contact-callout editorial-shell">
    <p className="eyebrow">Um cuidado para o seu olhar</p>
    <h2 className="font-display">Vamos conversar?</h2>
    <p>Consulte possibilidades de atendimento com Lorrayne Nunes.</p>
    <button className="editorial-button" onClick={() => onBook()}>Consultar agendamento</button>
    <Link className="editorial-link" to="/contato">Informações de contato →</Link>
  </section>;
}

export function HomePage({ onBook }: BookingProps) {
  return <>
    <HeroSection onOpenBooking={() => onBook()} />
    <ClientsShowcase preview />
    <section className="editorial-shell editorial-split">
      <figure className="professional-portrait"><img src={STUDIO_PROFILE.instagramSpotlightImage} alt="Lorrayne Nunes no estúdio" width="800" height="1000" loading="lazy" /><figcaption>Lorrayne Nunes · ÁURA Beauty Studio</figcaption></figure>
      <div><p className="eyebrow">{STUDIO_PROFILE.city}</p><h2 className="font-display">Lorrayne Nunes</h2>
      <p>{STUDIO_PROFILE.roleTitle}</p><blockquote className="font-display">“{STUDIO_PROFILE.manifestoQuote}”</blockquote>
      <Link className="editorial-link" to="/sobre">Conheça a profissional →</Link></div>
    </section>
    <section className="course-teaser editorial-shell">
      <div><p className="eyebrow">Educação &amp; mentoria</p>
      <h2 className="font-display">Curso de Lash Design</h2><p>{STUDIO_COURSE.description}</p>
      <Link className="editorial-link" to="/curso">Conhecer a formação →</Link></div>
      <img src={import.meta.env.BASE_URL + 'src/assets/images/studio_lash_academy_1795019896448.jpg'}
        alt="Materiais da formação de Lash Design" width="800" height="1000" loading="lazy" />
    </section>
    <ContactCallout onBook={onBook} />
  </>;
}

export function PortfolioPage({ onBook }: BookingProps) {
  return <><ClientsShowcase /><ContactCallout onBook={onBook} /></>;
}

export function ServicesPage({ onBook }: BookingProps) {
  const [filter, setFilter] = useState('Todos');
  const [searchParams] = useSearchParams();
  const selected = searchParams.get('procedimento');
  useEffect(() => {
    if (!selected) return;
    const frame = requestAnimationFrame(() => {
      const item = document.getElementById('procedimento-' + selected);
      item?.scrollIntoView({ block: 'start', behavior: 'instant' });
      item?.querySelector('summary')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);
  return <section className="editorial-shell services-page service-catalog">
    <header className="catalog-intro">
      <p className="eyebrow">Atendimento · ÁURA Beauty Studio</p>
      <h1 className="font-display">Seu olhar, seu cuidado.</h1>
      <p>Explore os procedimentos, confira valores e escolha os cuidados para o seu atendimento.</p>
    </header>
    <div className="service-filters" role="group" aria-label="Filtrar serviços">
      {['Todos', 'Cílios', 'Sobrancelhas', 'Manutenção', 'Complementares'].map(category =>
        <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}
    </div>
    {(['Cílios', 'Sobrancelhas', 'Manutenção', 'Complementares'] as const).filter(category => filter === 'Todos' || filter === category).map(category =>
      <section key={category} className="catalog-group" aria-labelledby={'categoria-' + category}>
        <div className="catalog-category">
          <h2 className="font-display" id={'categoria-' + category}>{category}</h2>
          <span>{STUDIO_SERVICES.filter(service => service.category === category).length} procedimentos</span>
        </div>
        <ol className="catalog-list" role="list">
          {STUDIO_SERVICES.filter(service => service.category === category).map(service => {
            const work = STUDIO_WORKS.find(work => work.id === service.workId);
            return <li key={service.id} id={'procedimento-' + service.id.replace('srv-', '')} className="catalog-item">
              <div className="catalog-copy">
                <h3 className="font-display">{service.name}</h3>
                <p className="catalog-price"><span>{formatServicePrice(service)}</span><span>{formatServiceDuration(service)}</span></p>
              </div>
              <button className="catalog-book" onClick={() => onBook(service.id)} aria-label={'Agendar & consultar ' + service.name}>Agendar</button>
              <details className="catalog-details" open={selected === service.id.replace('srv-', '') || undefined}>
                <summary>Detalhes</summary>
                <div className="catalog-support">
                  {work && <img src={work.imageSrc} alt={work.imageAlt} width={work.id === 'henna' ? 810 : work.id === 'hibrido' ? 1031 : 1080} height={1440} loading="lazy" />}
                  <div>
                    {service.description && <p>{service.description}</p>}
                    <p>{service.availabilityNote} com o estúdio.</p>
                    {work && <Link className="editorial-link" to={'/portfolio?tecnica=' + work.id}>Ver resultado de {work.title} →</Link>}
                    <Link className="catalog-more" to={'/servicos/' + service.id.replace('srv-', '')}>Abrir página do procedimento</Link>
                  </div>
                </div>
              </details>
            </li>;
          })}
        </ol>
      </section>)}
    <p className="catalog-note">Valores e durações informados pelo estúdio. Design personalizado e Volume brown aguardam confirmação de valor e duração.</p>
  </section>;
}

export function ServicePage({ onBook }: BookingProps) {
  const { slug } = useParams();
  const service = STUDIO_SERVICES.find(item => item.id === 'srv-' + slug);
  if (!service) return <NotFoundPage />;
  const work = STUDIO_WORKS.find(item => item.id === service.workId);
  return <section className="editorial-shell detail-page">
    <Link className="editorial-link" to="/servicos">← Todos os procedimentos</Link>
    <div className={work ? 'editorial-split' : 'service-text-detail'}>
      {work && <img src={work.imageSrc} alt={work.imageAlt} width={work.id === 'henna' ? 810 : work.id === 'hibrido' ? 1031 : 1080} height={1440} />}
      <div><p className="eyebrow">{service.category}</p><h1 className="font-display">{service.name}</h1>
      {service.description && <p>{service.description}</p>}
      <p className="catalog-price"><span>{formatServicePrice(service)}</span><span>{formatServiceDuration(service)}</span></p>
      <button className="editorial-button" onClick={() => onBook(service.id)}>Consultar este procedimento</button>
      {work && <Link className="editorial-link" to={'/portfolio?tecnica=' + work.id}>Ver resultados reais →</Link>}</div>
    </div>
    {work?.secondImage && <img className="detail-extra" src={work.secondImage} alt="Outro resultado de volume egípcio" loading="lazy" />}
  </section>;
}

export function CoursePage({ onBook }: BookingProps) {
  return <section className="editorial-shell course-page">
    <p className="eyebrow">ÁURA · Formação presencial</p><h1 className="font-display">Aprender o olhar.</h1>
    <div className="editorial-split">
      <div><h2 className="font-display">{STUDIO_COURSE.name}</h2><p>{STUDIO_COURSE.description}</p>
      <ul className="course-topics"><li>Anatomia dos fios, saúde ocular e isolamento seguro</li><li>Mapping estratégico, Volume Brasileiro e Fox Eyes</li><li>Prática orientada presencial e suporte pós-curso</li></ul>
      <p>Com Lorrayne Nunes, {STUDIO_PROFILE.roleTitle}.</p>
      <p>Consulte diretamente as datas, condições e informações da formação.</p>
      <button className="editorial-button" onClick={() => onBook(STUDIO_COURSE.id)}>Consultar informações do curso</button></div>
      <img src={import.meta.env.BASE_URL + 'src/assets/images/studio_lash_academy_1795019896448.jpg'} alt="Materiais de trabalho na formação de Lash Design" width="800" height="1000" />
    </div>
    <blockquote className="font-display">“Não é sorte. É preparação, disciplina e constância.”</blockquote>
  </section>;
}

export function AboutPage() {
  return <section className="editorial-shell about-page">
    <p className="eyebrow">A profissional · O estúdio</p><h1 className="font-display">Lorrayne Nunes.</h1>
    <div className="editorial-split"><figure className="professional-portrait"><img src={STUDIO_PROFILE.instagramSpotlightImage} alt="Lorrayne Nunes no estúdio ÁURA" width="800" height="1000" /><figcaption>Lorrayne Nunes · ÁURA Beauty Studio</figcaption></figure>
      <div><h2 className="font-display">Técnica, cuidado<br />e um olhar individual.</h2>
      <p>{STUDIO_PROFILE.roleTitle}.</p><p>À frente da ÁURA em {STUDIO_PROFILE.city}, Lorrayne reúne atendimento em cílios e sobrancelhas e formação profissional em Lash Design.</p>
      <blockquote className="font-display">“{STUDIO_PROFILE.manifestoQuote}”</blockquote>
      <Link className="editorial-link" to="/servicos">Conhecer os procedimentos →</Link></div></div>
  </section>;
}

export function DiaryPage() {
  return <><div className="editorial-shell page-intro"><p className="eyebrow">Diário da ÁURA</p><h1 className="font-display">Entre olhares e encontros.</h1><p>Uma seleção editorial das publicações do estúdio.</p></div><InstagramArchive /></>;
}

export function ContactPage({ onBook }: BookingProps) {
  return <section className="editorial-shell contact-page">
    <p className="eyebrow">Contato · {STUDIO_PROFILE.city}</p><h1 className="font-display">O primeiro passo<br />é uma conversa.</h1>
    <p>{STUDIO_PROFILE.founderName} · {STUDIO_PROFILE.fullTitle}</p>
    <a className="editorial-link" href={STUDIO_PROFILE.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram {STUDIO_PROFILE.handle} ↗</a>
    <div className="contact-procedures"><h2 className="font-display">Qual cuidado você procura?</h2>
      {STUDIO_SERVICES.map(service => <button key={service.id} onClick={() => onBook(service.id)}>{service.name}<span>Consultar →</span></button>)}
    </div>
    <a className="editorial-link" href={studioWhatsAppUrl} target="_blank" rel="noopener noreferrer">WhatsApp {STUDIO_PROFILE.whatsappPhone} ↗</a>
  </section>;
}

export function NotFoundPage() {
  return <section className="editorial-shell page-intro"><p className="eyebrow">Página não encontrada</p><h1 className="font-display">Vamos voltar ao início?</h1><Link className="editorial-button" to="/">Início da ÁURA</Link></section>;
}
