import type { Dict } from "@/lib/content";
import { href, site, type Locale } from "@/lib/site";

export default function Footer({ locale, dict, day = false }: { locale: Locale; dict: Dict; day?: boolean }) {
  const home = href(locale, "/");
  return (
    <footer className={day ? "footer day" : "footer"}>
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a className="brand" href={home} aria-label={dict.nav.home}>
              <img src="/media/alpha-mark.webp" alt="" width={256} height={211} loading="lazy" />
              <span>ALPHA</span>
            </a>
            <p>{dict.footer.tagline}</p>
          </div>
          <nav aria-label={dict.footer.explore}>
            <h2>{dict.footer.explore}</h2>
            <ul>
              <li><a href={`${home}#services`}>{dict.nav.services}</a></li>
              <li><a href={`${home}#work`}>{dict.nav.work}</a></li>
              <li><a href={`${home}#process`}>{dict.nav.process}</a></li>
              <li><a href={`${home}#about`}>{dict.nav.about}</a></li>
            </ul>
          </nav>
          <div>
            <h2>{dict.footer.reach}</h2>
            <ul>
              <li><a href={`https://wa.me/${site.whatsapp}`} rel="noopener">WhatsApp</a></li>
              <li><a href={`tel:${site.phone}`} dir="ltr">{site.phoneDisplay}</a></li>
              <li><a href={`mailto:${site.email}`} dir="ltr">{site.email}</a></li>
            </ul>
          </div>
        </div>
        <p className="footer__base">
          © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
