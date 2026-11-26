"use client";

import { useEffect } from "react";

/**
 * Scroll choreography for the DOM side of the page.
 *
 *  [data-pin]            gets --p (0..1): progress through its sticky scene
 *  [data-pin][data-steps] also gets data-step and .is-active on [data-step] children
 *  [data-track]          horizontal scene: --travel is how far the track slides
 *  [data-reveal]         gets .in the first time it is seen
 *  [data-tilt]           gets --rx / --ry from the pointer
 *
 * `html.js-on` is the switch: without JavaScript every scene is plain, readable flow.
 */
export default function Scroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    let disposed = false;

    const reveal = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window)) {
      reveal.forEach((el) => el.classList.add("in"));
      return;
    }
    root.classList.add("js-on");
    cleanups.push(() => root.classList.remove("js-on"));

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    reveal.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    const pins = Array.from(document.querySelectorAll<HTMLElement>("[data-pin]")).map((el) => ({
      el,
      steps: Number(el.dataset.steps || 0),
      items: Array.from(el.querySelectorAll<HTMLElement>("[data-step]")),
      track: el.querySelector<HTMLElement>("[data-track]"),
      last: -1,
    }));

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navEntry =
      typeof performance !== "undefined" && typeof performance.getEntriesByType === "function"
        ? (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)
        : undefined;
    const isReload =
      Boolean((window as Window & { __alphaReloadClearedHash?: boolean }).__alphaReloadClearedHash) ||
      navEntry?.type === "reload";
    const path = window.location.pathname;
    const isHomepage = path === "/" || path === "/ar" || path === "/ar/";
    if (isHomepage && isReload && window.location.hash) {
      window.history.replaceState(null, "", path + window.location.search);
    }

    const initialHash = isHomepage && isReload ? "" : window.location.hash;
    let userInteracted = false;
    const markInteracted = () => {
      userInteracted = true;
    };
    window.addEventListener("wheel", markInteracted, { passive: true, once: true });
    window.addEventListener("touchstart", markInteracted, { passive: true, once: true });
    window.addEventListener("keydown", markInteracted, { passive: true, once: true });
    window.addEventListener("pointerdown", markInteracted, { passive: true, once: true });
    cleanups.push(() => {
      window.removeEventListener("wheel", markInteracted);
      window.removeEventListener("touchstart", markInteracted);
      window.removeEventListener("keydown", markInteracted);
      window.removeEventListener("pointerdown", markInteracted);
    });

    const alignInitialScroll = () => {
      if (userInteracted) return;
      if (!initialHash && !window.location.hash) {
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      } else if (initialHash) {
        const id = decodeURIComponent(initialHash.slice(1));
        const target = id ? document.getElementById(id) : null;
        if (target) {
          const top = window.scrollY + target.getBoundingClientRect().top;
          window.scrollTo(0, Math.max(0, top));
        }
      }
    };

    const measure = () => {
      for (const pin of pins) {
        if (!pin.track) continue;
        const wide = window.innerWidth >= 760;
        const travel = wide ? Math.max(0, pin.track.scrollWidth - pin.track.clientWidth) : 0;
        pin.el.style.setProperty("--travel", `${travel}px`);
        pin.el.style.height = wide ? `${window.innerHeight + travel}px` : "";
      }
      if (!userInteracted && !initialHash && !window.location.hash && window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };
    alignInitialScroll();
    measure();
    alignInitialScroll();
    const initialSettleTimer = window.setTimeout(alignInitialScroll, 120);
    cleanups.push(() => window.clearTimeout(initialSettleTimer));
    window.addEventListener("resize", measure);
    cleanups.push(() => window.removeEventListener("resize", measure));

    const update = () => {
      const vh = window.innerHeight;
      for (const pin of pins) {
        const r = pin.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        pin.el.style.setProperty("--p", p.toFixed(4));
        if (pin.steps) {
          const step = Math.min(pin.steps - 1, Math.floor(p * pin.steps));
          if (step !== pin.last) {
            pin.last = step;
            pin.el.dataset.step = String(step);
            pin.items.forEach((item) => item.classList.toggle("is-active", Number(item.dataset.step) === step));
          }
        }
      }
      const max = root.scrollHeight - vh;
      root.style.setProperty("--page", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    update();

    // Smooth, weighted scrolling on desktop. Touch devices keep native scroll.
    let raf = 0;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const loop = (lenis?: { raf: (t: number) => void }) => {
      const tick = (t: number) => {
        if (disposed) return;
        lenis?.raf(t);
        update();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (fine) {
      import("lenis").then(({ default: Lenis }) => {
        if (disposed) return;
        const lenis = new Lenis({ lerp: 0.085, anchors: true });
        cleanups.push(() => lenis.destroy());
        if (!userInteracted) {
          if (!initialHash && !window.location.hash) {
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });
          } else if (initialHash) {
            const id = decodeURIComponent(initialHash.slice(1));
            const target = id ? document.getElementById(id) : null;
            if (target) {
              lenis.scrollTo(target, { immediate: true });
            }
          }
        }
        loop(lenis);
      });
    } else {
      loop();
    }
    cleanups.push(() => cancelAnimationFrame(raf));

    if (fine) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--rx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          el.style.setProperty("--ry", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        };
        const leave = () => {
          el.style.setProperty("--rx", "0");
          el.style.setProperty("--ry", "0");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
