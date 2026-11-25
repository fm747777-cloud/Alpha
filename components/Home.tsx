import ContactForm from "./ContactForm";
import Footer from "./Footer";
import Header from "./Header";
import JsonLd from "./JsonLd";
import ProjectName from "./ProjectName";
import Scroll from "./Scroll";
import type { Dict } from "@/lib/content";
import { projects } from "@/lib/projects";
import { homeLd } from "@/lib/seo";
import { href, site, type Locale } from "@/lib/site";

const two = (n: number) => String(n).padStart(2, "0");

export default function Home({ locale, dict }: { locale: Locale; dict: Dict }) {
  const services = dict.pack.items;
  const steps = dict.hunt.steps;

  return (
    <>
      <Header locale={locale} dict={dict} altHref={href(locale === "ar" ? "en" : "ar", "/")} />
      <main id="main">
        {/* 1. The Alpha, standing on the pack */}
        <section className="hero" data-stage="hero" data-floor>
          <img
            className="hero__poster hero__poster--dark"
            src="/media/alpha-hologram-fallback-dark.webp"
            width={1600}
            height={1000}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="hero__poster hero__poster--light"
            src="/media/alpha-hologram-fallback-light.webp"
            width={1600}
            height={1000}
            alt=""
            loading="lazy"
            decoding="async"
          />
          {/* Static hologram artwork; the entrance animation is handled in CSS. */}
          <div className="hero__hologram" aria-hidden="true">
            <img
              className="hero__hologram-art"
              src="/media/alpha-hologram-pack.webp"
              width={1536}
              height={1024}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero__hologram-scan" />
          </div>
          {/* Preserve the static phone in front of the wolves when WebGL is unavailable. */}
          <img
            className="hero__phone-foreground hero__phone-foreground--dark"
            src="/media/alpha-hologram-fallback-dark.webp"
            width={1600}
            height={1000}
            alt=""
            aria-hidden="true"
            decoding="async"
          />
          <img
            className="hero__phone-foreground hero__phone-foreground--light"
            src="/media/alpha-hologram-fallback-light.webp"
            width={1600}
            height={1000}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="wrap hero__copy">
            <h1>
              <span className="hero__kicker">{dict.hero.kicker}</span>
              <span className="hero__display">{dict.hero.display}</span>
            </h1>
            <p className="hero__lede">
              <span className="hero__lede-lead">{dict.hero.ledeLead}</span>
              <span className="hero__lede-body">{dict.hero.lede}</span>
            </p>
            <ProjectName t={dict.hero} />
            <div className="hero__actions">
              <a className="btn btn--ghost" href="#contact">
                {dict.hero.primary}
              </a>
              <a className="btn btn--ghost" href="#work">
                {dict.hero.secondary}
              </a>
            </div>
          </div>
          <span className="cue" aria-hidden="true">
            {dict.hero.scroll}
          </span>
        </section>

        {/* 2. The life cycle: the visitor's project is planned, designed, built, tested and launched */}
        <section
          className="pin pin--journey"
          id="process"
          data-pin
          data-steps={steps.length}
          data-stage="journey"
          data-idea={dict.hero.idea}
          data-live={dict.hunt.live}
          data-fallback={dict.hero.defaultName}
          aria-labelledby="process-title"
        >
          <div className="pin__stick">
            <div className="wrap process">
              <div className="process__copy">
                <header>
                  <h2 className="h2" id="process-title">
                    {dict.hunt.titleBefore}
                    <bdi className="pname" data-project-name data-default={dict.hero.defaultName}>
                      {dict.hero.defaultName}
                    </bdi>
                    {dict.hunt.titleAfter}
                  </h2>
                  <p className="lede">{dict.hunt.lede}</p>
                </header>
                <ol className="process__list">
                  {steps.map((s, i) => (
                    <li key={s.name} className={i === 0 ? "move is-active" : "move"} data-step={i}>
                      <span className="move__num" aria-hidden="true">
                        {two(i + 1)}
                      </span>
                      <h3>{s.name}</h3>
                      <p>{s.text}</p>
                    </li>
                  ))}
                </ol>
                <div className="ticks" aria-hidden="true">
                  {steps.map((s, i) => (
                    <span key={s.name} data-step={i} className={i === 0 ? "is-active" : undefined} />
                  ))}
                </div>
                <ul className="toasts" aria-hidden="true">
                  {dict.hunt.toasts.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Services: one turn of the mark per discipline */}
        <section
          className="pin pin--services"
          id="services"
          data-pin
          data-steps={services.length}
          data-stage="services"
          aria-labelledby="services-title"
        >
          <div className="pin__stick">
            <div className="wrap services">
              <div className="services__copy">
                <header>
                  <h2 className="h2" id="services-title">
                    {dict.pack.title}
                  </h2>
                  <p className="lede">{dict.pack.lede}</p>
                </header>
                <ol className="services__list">
                  {services.map((s, i) => (
                    <li key={s.name} className={i === 0 ? "service is-active" : "service"} data-step={i}>
                      <span className="service__num" aria-hidden="true">
                        {two(i + 1)}
                      </span>
                      <div>
                        <h3>{s.name}</h3>
                        <p>{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="meter" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Work: a horizontal walk through what we shipped */}
        <section className="pin pin--work" id="work" data-pin data-stage="work" aria-labelledby="work-title">
          <div className="pin__stick">
            <div className="work">
              <header className="wrap work__head">
                <h2 className="h2" id="work-title">
                  {dict.work.title}
                </h2>
                <p className="lede">{dict.work.lede}</p>
              </header>
              <ul className="work__track" data-track>
                {projects.map((p, i) => (
                  <li key={p.slug} className="case">
                    <a href={href(locale, `/work/${p.slug}`)}>
                      <div className="case__shot" data-tilt>
                        <img
                          src={`/media/work/${p.image}-760.webp`}
                          srcSet={`/media/work/${p.image}-760.webp 760w, /media/work/${p.image}-1400.webp 1400w`}
                          sizes="(max-width: 760px) 82vw, 520px"
                          width={1400}
                          height={1084}
                          alt={`${p.title} — ${p.category[locale]}`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="case__meta">
                        <span>{two(i + 1)}</span>
                        <span>{p.category[locale]}</span>
                        {p.live ? <span className="live">{dict.work.live}</span> : null}
                      </div>
                      <h3>
                        <bdi>{p.title}</bdi>
                      </h3>
                      <p>{p.summary[locale]}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Principles, around the mark */}
        <section className="pin pin--about" id="about" data-pin data-stage="about" aria-labelledby="about-title">
          <div className="pin__stick">
            <div className="wrap about">
              <header className="about__head">
                <h2 className="h2" id="about-title">
                  {dict.about.title}
                </h2>
                <p className="lede">{dict.about.lede}</p>
              </header>
              <dl className="about__points">
                {dict.about.principles.map((p) => (
                  <div key={p.name}>
                    <dt>{p.name}</dt>
                    <dd>{p.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 7. Industries and questions */}
        <section className="section" data-stage="quiet" aria-labelledby="industries-title">
          <div className="wrap">
            <p className="statement" data-reveal>
              {dict.manifesto.text}
            </p>
            <h2 className="eyebrow" id="industries-title">
              {dict.about.industriesTitle}
            </h2>
            <ul className="industries">
              {dict.about.industries.map((x) => (
                <li key={x} data-reveal>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="wrap faq__grid">
            <h2 className="h2" id="faq-title" data-reveal>
              {dict.faq.title}
            </h2>
            <div>
              {dict.faq.items.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8. The pack again, then the form */}
        <section className="outro" data-stage="outro" data-floor aria-labelledby="outro-title">
          <div className="wrap">
            <h2 className="outro__title" id="outro-title" data-reveal>
              {dict.contact.outroBefore}
              <bdi className="pname" data-project-name data-default={dict.hero.defaultName}>
                {dict.hero.defaultName}
              </bdi>
              {dict.contact.outroAfter}
            </h2>
            <p className="lede" data-reveal>
              {dict.contact.outro}
            </p>
            <a className="btn btn--solid" href="#contact">
              {dict.contact.outroCta}
            </a>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="wrap contact__grid">
            <div>
              <h2 className="h2" id="contact-title">
                {dict.nav.cta}
              </h2>
              <p className="lede">{dict.contact.lede}</p>
              <div className="contact__ways">
                <a className="btn btn--ghost" href={`https://wa.me/${site.whatsapp}`} rel="noopener">
                  {dict.contact.whatsapp}
                </a>
                <dl>
                  <dt>{dict.contact.call}</dt>
                  <dd>
                    <a className="link" href={`tel:${site.phone}`} dir="ltr">
                      {site.phoneDisplay}
                    </a>
                  </dd>
                  <dt>{dict.contact.emailLabel}</dt>
                  <dd>
                    <a className="link" href={`mailto:${site.email}`} dir="ltr">
                      {site.email}
                    </a>
                  </dd>
                </dl>
              </div>
            </div>
            <ContactForm t={dict.contact.form} prefill={dict.contact.prefill} />
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
      <div className="progress" aria-hidden="true" />
      <Scroll />
      <JsonLd data={homeLd(locale)} />
    </>
  );
}