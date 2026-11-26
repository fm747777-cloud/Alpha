"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Dict } from "@/lib/content";
import { projects } from "@/lib/projects";
import { href, type Locale } from "@/lib/site";

const two = (n: number) => String(n).padStart(2, "0");

export default function WorkShowcase({ locale, dict }: { locale: Locale; dict: Dict }) {
  const total = projects.length;
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number; id: number; locked: "x" | "y" | null } | null>(null);
  const didDragRef = useRef(false);
  const lastNavTimeRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const isRtl = locale === "ar";

  const canNavigate = () => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastNavTimeRef.current < 120) return false;
    lastNavTimeRef.current = now;
    return true;
  };

  const applyActiveIndex = useCallback(
    (index: number) => {
      if (total <= 1) return;
      const nextIdx = ((index % total) + total) % total;
      const w = typeof window !== "undefined" ? (window as Window & { __alphaSetWorkIndex?: (idx: number) => void }) : undefined;
      if (typeof w?.__alphaSetWorkIndex === "function") {
        w.__alphaSetWorkIndex(nextIdx);
      }
      setActive(nextIdx);
    },
    [total],
  );

  const goTo = useCallback(
    (index: number) => {
      if (total <= 1) return;
      const w = typeof window !== "undefined" ? (window as Window & { __alphaNavWork?: (d: number, idx?: number) => void }) : undefined;
      if (typeof w?.__alphaNavWork === "function") {
        w.__alphaNavWork(0, index);
        return;
      }
      if (!canNavigate()) return;
      applyActiveIndex(index);
    },
    [total, applyActiveIndex],
  );

  const prev = useCallback(() => {
    if (total <= 1) return;
    const w = typeof window !== "undefined" ? (window as Window & { __alphaNavWork?: (d: number, idx?: number) => void }) : undefined;
    if (typeof w?.__alphaNavWork === "function") {
      w.__alphaNavWork(-1);
      return;
    }
    if (!canNavigate()) return;
    setActive((curr) => ((curr - 1) % total + total) % total);
  }, [total]);

  const next = useCallback(() => {
    if (total <= 1) return;
    const w = typeof window !== "undefined" ? (window as Window & { __alphaNavWork?: (d: number, idx?: number) => void }) : undefined;
    if (typeof w?.__alphaNavWork === "function") {
      w.__alphaNavWork(1);
      return;
    }
    if (!canNavigate()) return;
    setActive((curr) => (curr + 1) % total);
  }, [total]);

  // Keep React state synchronized if the inline DOM controller navigated before or during hydration
  useEffect(() => {
    const sec = document.getElementById("work");
    if (!sec) return;
    const syncFromDom = () => {
      const raw = Number(sec.getAttribute("data-active-index") ?? "0");
      if (!Number.isNaN(raw) && raw >= 0 && raw < total) {
        setActive(raw);
      }
    };
    syncFromDom();
    const obs = new MutationObserver(syncFromDom);
    obs.observe(sec, { attributes: true, attributeFilter: ["data-active-index"] });
    return () => obs.disconnect();
  }, [total]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (isRtl) next();
      else prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (isRtl) prev();
      else next();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(total - 1);
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a")) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId, locked: null };
    didDragRef.current = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const state = dragStartRef.current;
    if (!state || state.id !== e.pointerId) return;
    const dx = e.clientX - state.x;
    const dy = e.clientY - state.y;

    if (!state.locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      state.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (state.locked === "x") {
        setDragging(true);
        didDragRef.current = true;
      }
    }

    if (state.locked === "x") {
      setDragOffset(Math.max(-180, Math.min(180, dx)));
    }
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const state = dragStartRef.current;
    if (!state || state.id !== e.pointerId) return;
    const dx = e.clientX - state.x;
    const wasHorizontal = state.locked === "x";
    dragStartRef.current = null;
    setDragging(false);
    setDragOffset(0);

    if (wasHorizontal && Math.abs(dx) >= 44) {
      if (isRtl) {
        if (dx > 0) next();
        else prev();
      } else {
        if (dx < 0) next();
        else prev();
      }
    }
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  };

  // Preload immediate adjacent project images so transitions remain instant and sharp
  useEffect(() => {
    if (total <= 1) return;
    const preloadIndices = [((active - 1) + total) % total, (active + 1) % total];
    preloadIndices.forEach((idx) => {
      const p = projects[idx];
      if (!p) return;
      const img = new Image();
      img.src = `/media/work/${p.image}-1400.webp`;
    });
  }, [active, total]);

  if (total === 0) return null;

  const currentProject = projects[active] ?? projects[0];
  const exploreLabel = locale === "ar" ? "استكشف المشروع" : "Explore project";
  const prevAria = locale === "ar" ? "المشروع السابق" : "Previous project";
  const nextAria = locale === "ar" ? "المشروع التالي" : "Next project";
  const goToProjectAria = (i: number, title: string) =>
    locale === "ar" ? `عرض المشروع ${two(i + 1)}: ${title}` : `Go to project ${two(i + 1)}: ${title}`;

  const getRelativeOffset = (index: number) => {
    let diff = index - active;
    const half = Math.floor(total / 2);
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
  };

  const titleLines = dict.work.title.split("\n");

  return (
    <section
      className="work-section"
      id="work"
      data-stage="work"
      data-active-index={active}
      data-total={total}
      data-live-label={dict.work.live}
      data-explore-label={exploreLabel}
      aria-labelledby="work-title"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Subtle atmospheric background glow & digital horizon waves */}
      <div className="work-bg" aria-hidden="true">
        <div className="work-bg__glow" />
        <svg className="work-bg__waves" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
          <path
            d="M-60 220 C 320 155, 580 265, 920 195 C 1180 140, 1340 185, 1500 165"
            stroke="url(#workWaveGrad1)"
            strokeWidth="1.25"
          />
          <path
            d="M-60 250 C 280 190, 640 285, 980 218 C 1220 170, 1360 210, 1500 195"
            stroke="url(#workWaveGrad2)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="workWaveGrad1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#055FD9" stopOpacity="0" />
              <stop offset="32%" stopColor="#1D91F9" stopOpacity="0.28" />
              <stop offset="52%" stopColor="#00CFFF" stopOpacity="0.46" />
              <stop offset="72%" stopColor="#9B5DE5" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#055FD9" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="workWaveGrad2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#055FD9" stopOpacity="0" />
              <stop offset="50%" stopColor="#1D91F9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#055FD9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="wrap work-showcase">
        {/* 1. Centered Section Header */}
        <header className="work-showcase__head">
          <h2 className="h2 work-showcase__title" id="work-title">
            <span className="work-showcase__title-line">{titleLines[0]}</span>
            {titleLines[1] ? (
              <span className="work-showcase__title-line work-showcase__title-accent">{titleLines[1]}</span>
            ) : null}
          </h2>
          <p className="lede work-showcase__subtitle">{dict.work.lede}</p>
        </header>

        {/* 2. Interactive 3-Laptop Showcase Rail */}
        <div
          ref={stageRef}
          className={`work-rail${dragging ? " is-dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Left Circular Navigation Arrow */}
          <button
            type="button"
            className="work-nav work-nav--prev"
            onClick={prev}
            aria-label={prevAria}
            disabled={total <= 1}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={isRtl ? "M9 6L15 12L9 18" : "M15 6L9 12L15 18"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 3D Perspective Laptop Stage */}
          <div
            className="work-rail__viewport"
            style={
              dragOffset !== 0
                ? { transform: `translate3d(${(dragOffset * 0.22).toFixed(1)}px, 0, 0)` }
                : undefined
            }
          >
            {/* Glowing Elliptical Light Pedestal Beneath Active Laptop */}
            <div className="work-pedestal" aria-hidden="true">
              <span className="work-pedestal__core" />
              <span className="work-pedestal__ring" />
            </div>

            <ul className="work-rail__list" aria-live="polite">
              {projects.map((p, i) => {
                const offset = getRelativeOffset(i);
                const isCenter = offset === 0;
                const isPrev = offset === -1;
                const isNext = offset === 1;
                const isVisible = Math.abs(offset) <= 1;
                const statePos = isCenter ? "center" : isPrev ? "prev" : isNext ? "next" : offset < -1 ? "far-prev" : "far-next";
                const projectHref = href(locale, `/work/${p.slug}`);

                return (
                  <li
                    key={p.slug}
                    className={`work-slide work-slide--${statePos}`}
                    data-index={i}
                    data-offset={offset}
                    data-slug={p.slug}
                    data-num={two(i + 1)}
                    data-title={p.title}
                    data-category={p.category[locale]}
                    data-summary={p.summary[locale]}
                    data-href={projectHref}
                    data-live={p.live ? "true" : "false"}
                    data-image={p.image}
                    aria-hidden={!isCenter}
                  >
                    <div
                      className="work-slide__device"
                      onClick={(e) => {
                        if (didDragRef.current) {
                          e.preventDefault();
                          return;
                        }
                        if (isPrev) {
                          e.preventDefault();
                          prev();
                        } else if (isNext) {
                          e.preventDefault();
                          next();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!isCenter && isVisible && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isPrev) prev();
                          else if (isNext) next();
                        }
                      }}
                      role={!isCenter && isVisible ? "button" : undefined}
                      tabIndex={!isCenter && isVisible ? 0 : undefined}
                      aria-label={!isCenter && isVisible ? goToProjectAria(i, p.title) : undefined}
                    >
                      <div className="work-slide__halo" aria-hidden="true" />
                      <div className="work-slide__shot" data-tilt={isCenter ? "" : undefined}>
                        <img
                          src={`/media/work/${p.image}-${isCenter ? "1400" : "760"}.webp`}
                          srcSet={`/media/work/${p.image}-760.webp 760w, /media/work/${p.image}-1400.webp 1400w`}
                          sizes="(max-width: 760px) 88vw, (max-width: 1180px) 62vw, 680px"
                          width={1400}
                          height={1084}
                          alt={`${p.title} — ${p.category[locale]}`}
                          loading={isVisible ? "eager" : "lazy"}
                          decoding="async"
                          draggable={false}
                        />
                        <a
                          href={projectHref}
                          className="work-slide__center-link"
                          aria-label={`${exploreLabel}: ${p.title}`}
                          tabIndex={isCenter ? 0 : -1}
                          onClick={(e) => {
                            if (didDragRef.current || !isCenter) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <div className="work-slide__reflection" aria-hidden="true" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Circular Navigation Arrow */}
          <button
            type="button"
            className="work-nav work-nav--next"
            onClick={next}
            aria-label={nextAria}
            disabled={total <= 1}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={isRtl ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 3. Active Project Details */}
        <div className="work-info">
          <div className="work-info__meta">
            <span className="work-info__num">{two(active + 1)}</span>
            <span className="work-info__sep" aria-hidden="true">
              —
            </span>
            <span className="work-info__cat">{currentProject.category[locale]}</span>
            <span
              className="live work-info__live"
              style={currentProject.live ? undefined : { display: "none" }}
            >
              {dict.work.live}
            </span>
          </div>

          <h3 className="work-info__title">
            <a className="work-info__title-link" href={href(locale, `/work/${currentProject.slug}`)}>
              <bdi className="work-info__title-text">{currentProject.title}</bdi>
            </a>
          </h3>

          <p className="work-info__desc">{currentProject.summary[locale]}</p>

          <div className="work-info__actions">
            <a className="work-explore-btn" href={href(locale, `/work/${currentProject.slug}`)}>
              <span>{exploreLabel}</span>
              <svg className="work-explore-btn__arrow" viewBox="0 0 18 16" fill="none" aria-hidden="true">
                <path
                  d="M2.5 8H14.5M10 3.5L14.5 8L10 12.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* 4. Segmented Horizontal Progress Indicator (01 / 07) */}
        <div className="work-progress" role="group" aria-label={dict.work.all}>
          <div className="work-progress__count" aria-live="polite">
            <span className="work-progress__current">{two(active + 1)}</span>
            <span className="work-progress__slash" aria-hidden="true">
              {" / "}
            </span>
            <span className="work-progress__total">{two(total)}</span>
          </div>

          <div className="work-progress__segments" role="tablist" aria-label={dict.work.title}>
            {projects.map((p, i) => {
              const isSelected = i === active;
              return (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  data-seg-index={i}
                  aria-selected={isSelected}
                  aria-label={goToProjectAria(i, p.title)}
                  className={`work-progress__seg${isSelected ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                >
                  <span className="work-progress__bar" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
