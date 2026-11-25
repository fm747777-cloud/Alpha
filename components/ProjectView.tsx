import Footer from "./Footer";
import Header from "./Header";
import JsonLd from "./JsonLd";
import Scroll from "./Scroll";
import type { Dict } from "@/lib/content";
import { projects, type Project } from "@/lib/projects";
import { projectLd } from "@/lib/seo";
import { href, type Locale } from "@/lib/site";

export default function ProjectView({ locale, dict, project: p }: { locale: Locale; dict: Dict; project: Project }) {
  const t = dict.project;
  const home = href(locale, "/");
  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];
  const sections = p.sections[locale];
  const other: Locale = locale === "ar" ? "en" : "ar";

  return (
    <>
      <Header locale={locale} dict={dict} altHref={href(other, `/work/${p.slug}`)} />
      <main id="main" className="project">
        <article className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><a href={home}>{t.crumbHome}</a></li>
              <li><a href={`${home}#work`}>{t.crumbWork}</a></li>
              <li aria-current="page"><bdi>{p.title}</bdi></li>
            </ol>
          </nav>

          <header className="project__head">
            <div>
              <p className="project__cat">{p.category[locale]}</p>
              <h1><bdi>{p.title}</bdi></h1>
              <p className="project__summary">{p.summary[locale]}</p>
              {p.url ? (
                <div className="project__actions">
                  <a className="btn btn--solid" href={p.url} target="_blank" rel="noopener noreferrer">
                    {t.visit}
                  </a>
                </div>
              ) : null}
            </div>
            <figure className="project__shot" data-tilt>
              <img
                src={`/media/work/${p.image}-1400.webp`}
                srcSet={`/media/work/${p.image}-760.webp 760w, /media/work/${p.image}-1400.webp 1400w`}
                sizes="(max-width: 860px) 92vw, 620px"
                width={1400}
                height={1084}
                alt={`${p.title} — ${p.category[locale]}`}
                fetchPriority="high"
              />
            </figure>
          </header>

          <section className="project__body" aria-labelledby="overview-title">
            <h2 id="overview-title">{t.overview}</h2>
            <div>
              <p>{p.overview[locale]}</p>
            </div>
          </section>

          {sections.length ? (
            <section className="project__body" aria-labelledby="built-title">
              <h2 id="built-title">{t.built}</h2>
              <dl className="built">
                {sections.map((s) => (
                  <div key={s.title}>
                    <dt>{s.title}</dt>
                    <dd>{s.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {p.tags.length ? (
            <section className="project__body" aria-labelledby="stack-title">
              <h2 id="stack-title">{t.stack}</h2>
              <ul className="tags">
                {p.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {p.video ? (
            <section className="project__body" aria-labelledby="video-title">
              <h2 id="video-title">{t.video}</h2>
              <video
                controls
                preload="none"
                playsInline
                poster={`/media/video/${p.slug}.webp`}
                aria-label={`${t.videoAria}: ${p.title}`}
              >
                <source src={`/media/video/${p.slug}.mp4`} type="video/mp4" />
              </video>
            </section>
          ) : null}

          <div className="project__next">
            <a className="next" href={href(locale, `/work/${next.slug}`)}>
              <span>{t.next}</span>
              <strong><bdi>{next.title}</bdi></strong>
            </a>
            <div>
              <p style={{ marginBlockEnd: "1rem" }}>
                <strong>{t.ctaTitle}</strong> {t.ctaText}
              </p>
              <a className="btn btn--solid" href={`${home}#contact`}>
                {dict.nav.cta}
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer locale={locale} dict={dict} />
      <div className="progress" aria-hidden="true" />
      <Scroll />
      <JsonLd data={projectLd(locale, p)} />
    </>
  );
}
