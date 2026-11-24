import { Link, useParams } from 'react-router-dom';
import { ClientsShowcase } from '../components/ClientsShowcase';
import { HeroSection } from '../components/HeroSection';
import { InstagramArchive } from '../components/InstagramArchive';
import { STUDIO_COURSE, STUDIO_PROFILE, STUDIO_SERVICES, STUDIO_WORKS } from '../data/studioData';
import { useState } from 'react';

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
    <section className="editorial-shell home-specialties">
      <p className="eyebrow">Especialidades</p><h2 className="font-display">O detalhe muda o olhar.</h2>
      <div><Link to="/servicos" className="font-display">Cílios</Link><Link to="/servicos" className="font-display">Sobrancelhas</Link></div>
      <Link className="editorial-link" to="/servicos">Explorar os oito procedimentos →</Link>
    </section>
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

export function ServicesPage() {
  const [filter, setFilter] = useState('Todos');
  return <section className="editorial-shell services-page">
    <p className="eyebrow">Procedimentos · ÁURA</p><h1 className="font-display">Um desenho<br />para o seu olhar.</h1>
    <div className="service-filters" role="group" aria-label="Filtrar serviços">{['Todos', 'Sobrancelhas', 'Cílios'].map(cat =>
      <button key={cat} aria-pressed={filter === cat} onClick={() => setFilter(cat)}>{cat}</button>)}</div>
    {STUDIO_SERVICES.filter(s => filter === 'Todos' || s.category === filter).map(service => {
      const work = STUDIO_WORKS.find(w => 'srv-' + w.id === service.id)!;
      return <Link key={service.id} to={'/servicos/' + work.id} className="service-row">
        <img src={work.imageSrc} alt={work.imageAlt} width="1080" height="1440" loading="lazy" />
        <div><p className="eyebrow">{service.category}</p><h2 className="font-display">{service.name}</h2><p>{service.description}</p></div>
        <span className="editorial-link">Conhecer →</span>
      </Link>;
    })}
  </section>;
}

export function ServicePage({ onBook }: BookingProps) {
  const { slug } = useParams();
  const work = STUDIO_WORKS.find(w => w.id === slug);
  if (!work) return <NotFoundPage />;
  return <section className="editorial-shell detail-page">
    <Link className="editorial-link" to="/servicos">← Todos os procedimentos</Link>
    <div className="editorial-split"><img src={work.imageSrc} alt={work.imageAlt} width="1080" height="1440" />
      <div><p className="eyebrow">{work.category}</p><h1 className="font-display">{work.title}</h1>
      <p>{work.technicalNote}</p><p>Horários e valores sob consulta.</p>
      <button className="editorial-button" onClick={() => onBook('srv-' + work.id)}>Consultar este procedimento</button>
      <Link className="editorial-link" to="/portfolio">Ver os trabalhos do estúdio →</Link></div>
    </div>
    {work.secondImage && <img className="detail-extra" src={work.secondImage} alt="Outro resultado de volume egípcio" loading="lazy" />}
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
    {!STUDIO_PROFILE.whatsappPhone && <p>O WhatsApp comercial está em confirmação. Para informações, entre em contato pelo Instagram oficial.</p>}
  </section>;
}

export function NotFoundPage() {
  return <section className="editorial-shell page-intro"><p className="eyebrow">Página não encontrada</p><h1 className="font-display">Vamos voltar ao início?</h1><Link className="editorial-button" to="/">Início da ÁURA</Link></section>;
}
