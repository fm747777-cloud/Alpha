"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/site";

const two = (n: number) => String(n).padStart(2, "0");

export default function ProcessConstellation({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setInView(true);
      el.classList.add("is-inview");
      return;
    }

    if (el.classList.contains("is-inview")) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            el.classList.add("is-inview");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Split company philosophy (dict.manifesto.text) into two columns at the first sentence boundary
  // while preserving 100% of the original wording and order.
  const manifestoText = dict.manifesto.text;
  const dotIdx = manifestoText.indexOf(". ");
  const philosophyLead = dotIdx !== -1 ? manifestoText.slice(0, dotIdx + 1) : manifestoText;
  const philosophyBody = dotIdx !== -1 ? manifestoText.slice(dotIdx + 2) : "";

  // Split heading ("Complex technology. Clear outcomes.") at sentence boundary for clean typographic balance
  // while keeping exact text intact.
  const titleText = dict.about.title;
  const titleDotIdx = titleText.indexOf(". ");
  const titlePart1 = titleDotIdx !== -1 ? titleText.slice(0, titleDotIdx + 1) : titleText;
  const titlePart2 = titleDotIdx !== -1 ? titleText.slice(titleDotIdx + 2) : "";

  const principles = dict.about.principles;
  const industries = dict.about.industries;

  return (
    <section
      ref={sectionRef}
      className={`constellation${inView ? " is-inview" : ""}`}
      id="about"
      data-stage="about"
      aria-labelledby="about-title"
    >
      {/* Ambient background glows and horizon waves matching Process Constellation reference */}
      <div className="constellation__bg" aria-hidden="true">
        <div className="constellation__glow-top" />
        <div className="constellation__glow-mid" />
        <div className="constellation__glow-bottom" />
        <svg
          className="constellation__wave-bottom"
          viewBox="0 0 1440 180"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pcBottomWave1" x1="0" y1="70" x2="1440" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9B5DE5" stopOpacity="0.72" />
              <stop offset="32%" stopColor="#1D91F9" stopOpacity="0.65" />
              <stop offset="68%" stopColor="#00CFFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#055FD9" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="pcBottomWave2" x1="140" y1="130" x2="1440" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#055FD9" stopOpacity="0" />
              <stop offset="48%" stopColor="#00CFFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1D91F9" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M-40 56 C 240 128, 540 168, 880 142 C 1140 122, 1310 116, 1480 132"
            stroke="url(#pcBottomWave1)"
            strokeWidth="2"
          />
          <path
            d="M-40 118 C 320 156, 720 162, 1080 134 C 1260 120, 1380 122, 1480 138"
            stroke="url(#pcBottomWave2)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="wrap constellation__wrap">
        {/* 01 — TOP CONSTELLATION ZONE: Heading + Cyan Pathway + 3 Value Propositions + Layered Architecture */}
        <div className="constellation__top">
          {/* Desktop Curved Cyan Pathway + Orbital Dotted Guides + Layered Technical Architecture SVG */}
          <div className="constellation__art" aria-hidden="true">
            <svg
              className="constellation__svg"
              viewBox="0 0 1240 560"
              fill="none"
            >
              <defs>
                {/* Luminous Cyan Pathway Gradient */}
                <linearGradient id="pcCyanPath" x1="120" y1="382" x2="800" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#055FD9" stopOpacity="0.2" />
                  <stop offset="26%" stopColor="#00CFFF" stopOpacity="0.95" />
                  <stop offset="65%" stopColor="#00CFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#5CE1FF" stopOpacity="1" />
                </linearGradient>

                {/* Left Sweeping Wave Into Baseline */}
                <linearGradient id="pcLeftSweep" x1="-40" y1="220" x2="430" y2="382" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1D91F9" stopOpacity="0.78" />
                  <stop offset="55%" stopColor="#00CFFF" stopOpacity="0.52" />
                  <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.9" />
                </linearGradient>

                {/* Left Under-Wave */}
                <linearGradient id="pcLeftUnder" x1="-40" y1="260" x2="520" y2="480" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#9B5DE5" stopOpacity="0.28" />
                  <stop offset="55%" stopColor="#055FD9" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#055FD9" stopOpacity="0" />
                </linearGradient>

                {/* Manifold Branches Into Architecture Stack */}
                <linearGradient id="pcManifold" x1="420" y1="382" x2="740" y2="382" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.95" />
                  <stop offset="65%" stopColor="#1D91F9" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.45" />
                </linearGradient>

                {/* Isometric Glass Surfaces */}
                <linearGradient id="pcLayerTopFill" x1="720" y1="304" x2="995" y2="352" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#082458" stopOpacity="0.76" />
                  <stop offset="55%" stopColor="#05183C" stopOpacity="0.68" />
                  <stop offset="100%" stopColor="#0D347A" stopOpacity="0.78" />
                </linearGradient>
                <linearGradient id="pcLayerMidFill" x1="720" y1="346" x2="995" y2="394" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#071F4E" stopOpacity="0.82" />
                  <stop offset="60%" stopColor="#041537" stopOpacity="0.76" />
                  <stop offset="100%" stopColor="#0C2F72" stopOpacity="0.82" />
                </linearGradient>
                <linearGradient id="pcLayerBotFill" x1="720" y1="388" x2="995" y2="436" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#071B46" stopOpacity="0.86" />
                  <stop offset="55%" stopColor="#041332" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#16286A" stopOpacity="0.86" />
                </linearGradient>

                {/* Isometric Layer Stroke Gradients */}
                <linearGradient id="pcLayerStroke" x1="710" y1="300" x2="1005" y2="430" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1D91F9" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#00CFFF" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#48A9FF" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="pcLayerBotStroke" x1="710" y1="388" x2="1005" y2="436" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1D91F9" stopOpacity="0.8" />
                  <stop offset="62%" stopColor="#00CFFF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.85" />
                </linearGradient>

                {/* Node Halo Radial Glow */}
                <radialGradient id="pcNodeHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#00CFFF" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#00CFFF" stopOpacity="0" />
                </radialGradient>

                {/* Product Layer Dot Matrix Pattern */}
                <pattern id="pcDotMatrix" width="10" height="6" patternUnits="userSpaceOnUse" patternTransform="skewX(-40)">
                  <circle cx="2.5" cy="3" r="0.85" fill="#00CFFF" fillOpacity="0.46" />
                </pattern>

                {/* Soft Cyan Glow Filter */}
                <filter id="pcCyanGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Concentric Dotted Orbital Arcs (Constellation Background Guides) */}
              <g className="constellation__orbits">
                <path
                  d="M 378 368 A 400 370 0 0 1 735 12"
                  stroke="#3A78C9"
                  strokeOpacity="0.34"
                  strokeWidth="1.15"
                  strokeDasharray="2.5 6.5"
                />
                <path
                  d="M 432 346 A 338 312 0 0 1 756 32"
                  stroke="#3A78C9"
                  strokeOpacity="0.28"
                  strokeWidth="1.1"
                  strokeDasharray="2 6"
                />
                <path
                  d="M 556 184 A 185 170 0 0 1 710 46"
                  stroke="#00CFFF"
                  strokeOpacity="0.26"
                  strokeWidth="1"
                  strokeDasharray="2 5.5"
                />
              </g>

              {/* Left Ambient Horizon Waves */}
              <path
                className="constellation__wave-under"
                d="M -40 254 C 95 304, 235 398, 470 492"
                stroke="url(#pcLeftUnder)"
                strokeWidth="1.5"
              />
              <path
                className="constellation__wave-lead"
                d="M -40 246 C 110 300, 260 382, 424 398"
                stroke="url(#pcLeftSweep)"
                strokeWidth="2"
              />
              <path
                className="constellation__baseline-left"
                d="M 0 398 L 424 398"
                stroke="url(#pcCyanPath)"
                strokeWidth="1.6"
              />

              {/* Manifold Connection Branches Toward Technical Architecture Stack */}
              <g className="constellation__manifold">
                {/* Main horizontal trunk from nexus to split point */}
                <path
                  className="constellation__branch constellation__branch--trunk"
                  d="M 424 398 L 606 398"
                  stroke="url(#pcManifold)"
                  strokeWidth="2"
                  pathLength={100}
                />
                {/* Top branch -> PRODUCT layer */}
                <path
                  className="constellation__branch constellation__branch--top"
                  d="M 594 398 C 632 398, 640 364, 676 364 L 732 364"
                  stroke="url(#pcManifold)"
                  strokeWidth="1.35"
                  pathLength={100}
                />
                {/* Middle branch -> AI LAYER */}
                <path
                  className="constellation__branch constellation__branch--mid"
                  d="M 606 398 L 732 398"
                  stroke="url(#pcManifold)"
                  strokeWidth="1.65"
                  pathLength={100}
                />
                {/* Bottom branch -> PLATFORM layer */}
                <path
                  className="constellation__branch constellation__branch--bot"
                  d="M 594 398 C 632 398, 640 432, 676 432 L 732 432"
                  stroke="url(#pcManifold)"
                  strokeWidth="1.35"
                  pathLength={100}
                />
              </g>

              {/* Main Curved Cyan Staircase Pathway Connecting 01 -> 02 -> 03 */}
              {/* Soft outer glow duplicate */}
              <path
                className="constellation__path-glow"
                d="M 424 398 C 462 398, 482 308, 520 308 L 568 308 Q 590 308, 590 286 L 590 212 Q 590 190, 612 190 L 686 190 Q 708 190, 708 168 L 708 112 Q 708 90, 730 90 L 778 90 Q 800 90, 800 68 L 800 46"
                stroke="#00CFFF"
                strokeOpacity="0.38"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#pcCyanGlow)"
                pathLength={100}
              />
              {/* Crisp luminous core line */}
              <path
                className="constellation__path-core"
                d="M 424 398 C 462 398, 482 308, 520 308 L 568 308 Q 590 308, 590 286 L 590 212 Q 590 190, 612 190 L 686 190 Q 708 190, 708 168 L 708 112 Q 708 90, 730 90 L 778 90 Q 800 90, 800 68 L 800 46"
                stroke="url(#pcCyanPath)"
                strokeWidth="2.35"
                strokeLinecap="round"
                pathLength={100}
              />

              {/* Base Nexus Sparkle Point */}
              <g className="constellation__nexus" transform="translate(424, 398)">
                <circle r="13" fill="url(#pcNodeHalo)" />
                <circle r="3.2" fill="#FFFFFF" />
              </g>

              {/* Node 01 (Bottom-Left of Staircase — Built for scale) */}
              <g className="constellation__node constellation__node--01" transform="translate(590, 244)">
                <circle className="constellation__node-halo" r="20" fill="url(#pcNodeHalo)" />
                <circle
                  className="constellation__node-ring"
                  r="9.5"
                  fill="#04122C"
                  stroke="#00CFFF"
                  strokeWidth="1.8"
                />
                <circle className="constellation__node-core" r="4.8" fill="#00CFFF" />
                <circle r="2.1" fill="#FFFFFF" />
              </g>

              {/* Node 02 (Middle of Staircase — Innovation that works) */}
              <g className="constellation__node constellation__node--02" transform="translate(708, 146)">
                <circle className="constellation__node-halo" r="20" fill="url(#pcNodeHalo)" />
                <circle
                  className="constellation__node-ring"
                  r="9.5"
                  fill="#04122C"
                  stroke="#00CFFF"
                  strokeWidth="1.8"
                />
                <circle className="constellation__node-core" r="4.8" fill="#00CFFF" />
                <circle r="2.1" fill="#FFFFFF" />
              </g>

              {/* Node 03 (Top-Right of Staircase — Engineering with care) */}
              <g className="constellation__node constellation__node--03" transform="translate(800, 46)">
                <circle className="constellation__node-halo" r="20" fill="url(#pcNodeHalo)" />
                <circle
                  className="constellation__node-ring"
                  r="9.5"
                  fill="#04122C"
                  stroke="#00CFFF"
                  strokeWidth="1.8"
                />
                <circle className="constellation__node-core" r="4.8" fill="#00CFFF" />
                <circle r="2.1" fill="#FFFFFF" />
              </g>

              {/* 08 — TECHNICAL ARCHITECTURE ILLUSTRATION (PRODUCT / AI LAYER / PLATFORM) */}
              <g className="constellation__arch" transform="translate(0, 28)">
                {/* 4 Technical L-Corner Framing Brackets */}
                <g className="constellation__arch-brackets" stroke="#8CA3C8" strokeOpacity="0.58" strokeWidth="1.25">
                  {/* Top-Left */}
                  <path d="M 688 308 L 688 295 L 703 295" />
                  {/* Top-Right */}
                  <path d="M 1028 295 L 1043 295 L 1043 308" />
                  {/* Bottom-Left */}
                  <path d="M 688 424 L 688 437 L 703 437" />
                  {/* Bottom-Right */}
                  <path d="M 1028 437 L 1043 437 L 1043 424" />
                </g>

                {/* Ambient Under-Glow Beneath Platform Layer */}
                <ellipse
                  cx="860"
                  cy="428"
                  rx="145"
                  ry="24"
                  fill="#1D91F9"
                  fillOpacity="0.18"
                  filter="url(#pcCyanGlow)"
                />

                {/* LAYER 3 (BOTTOM): PLATFORM */}
                <g className="constellation__layer constellation__layer--platform">
                  {/* Isometric Base Plane */}
                  <polygon
                    points="768,386 1002,386 954,430 720,430"
                    fill="url(#pcLayerBotFill)"
                    stroke="url(#pcLayerBotStroke)"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  {/* Recessed Inner Circuit Sub-Plane */}
                  <polygon
                    points="832,395 954,395 934,415 812,415"
                    fill="#04112B"
                    fillOpacity="0.75"
                    stroke="#1D91F9"
                    strokeOpacity="0.58"
                    strokeWidth="1"
                  />
                  {/* Inner Cyan Delta / Execution Indicator */}
                  <polygon points="856,401 866,405 856,409" fill="#00CFFF" />
                  {/* Left Circuit Bus Trace */}
                  <path
                    d="M 744 405 L 802 405"
                    stroke="#00CFFF"
                    strokeOpacity="0.5"
                    strokeWidth="1"
                  />
                  {/* 4 Front-Left Port Nodes (o o o o) */}
                  <circle cx="758" cy="421" r="2.2" fill="#04122C" stroke="#00CFFF" strokeWidth="1.1" />
                  <circle cx="769" cy="421" r="2.2" fill="#04122C" stroke="#00CFFF" strokeWidth="1.1" />
                  <circle cx="780" cy="421" r="2.2" fill="#04122C" stroke="#00CFFF" strokeWidth="1.1" />
                  <circle cx="791" cy="421" r="2.2" fill="#04122C" stroke="#00CFFF" strokeWidth="1.1" />

                  {/* Callout Pin + Horizontal Line + PLATFORM Label */}
                  <circle cx="964" cy="410" r="2.6" fill="#E6F4FF" />
                  <line x1="964" y1="410" x2="1072" y2="410" stroke="#7BA2D6" strokeOpacity="0.75" strokeWidth="1.1" />
                  <text
                    x="1092"
                    y="414"
                    className="constellation__arch-label"
                    fill="#E2ECFF"
                    fontSize="11"
                    fontWeight="600"
                    letterSpacing="0.18em"
                  >
                    PLATFORM
                  </text>
                </g>

                {/* LAYER 2 (MIDDLE): AI LAYER */}
                <g className="constellation__layer constellation__layer--ai">
                  {/* Isometric Middle Plane */}
                  <polygon
                    points="768,344 1002,344 954,388 720,388"
                    fill="url(#pcLayerMidFill)"
                    stroke="url(#pcLayerStroke)"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  {/* Inner Circuit Trace Bus Across Plane */}
                  <line
                    x1="742"
                    y1="366"
                    x2="968"
                    y2="366"
                    stroke="#00CFFF"
                    strokeOpacity="0.34"
                    strokeWidth="1"
                  />
                  <rect x="838" y="361" width="4.5" height="3" fill="#00CFFF" fillOpacity="0.85" />
                  <rect x="845" y="361" width="4.5" height="3" fill="#00CFFF" fillOpacity="0.55" />

                  {/* Left 3D Isometric Processor Cube Module */}
                  <g stroke="#39A7FF" strokeWidth="1.05" fill="#061A40" fillOpacity="0.72">
                    {/* Top face */}
                    <polygon points="782,346 814,346 802,357 770,357" />
                    {/* Front face */}
                    <polygon points="770,357 802,357 802,377 770,377" />
                    {/* Right side face */}
                    <polygon points="802,357 814,346 814,366 802,377" />
                    {/* Internal vertical fin bars */}
                    <line x1="778" y1="357" x2="778" y2="377" stroke="#00CFFF" strokeOpacity="0.55" />
                    <line x1="786" y1="357" x2="786" y2="377" stroke="#00CFFF" strokeOpacity="0.55" />
                    <line x1="794" y1="357" x2="794" y2="377" stroke="#00CFFF" strokeOpacity="0.55" />
                  </g>

                  {/* Right 3D Isometric Processor Cube Module */}
                  <g stroke="#39A7FF" strokeWidth="1.05" fill="#061A40" fillOpacity="0.72">
                    {/* Top face */}
                    <polygon points="902,347 932,347 921,357 891,357" />
                    {/* Front face */}
                    <polygon points="891,357 921,357 921,375 891,375" />
                    {/* Right side face */}
                    <polygon points="921,357 932,347 932,365 921,375" />
                    {/* Internal vertical fin bars */}
                    <line x1="899" y1="357" x2="899" y2="375" stroke="#00CFFF" strokeOpacity="0.55" />
                    <line x1="906" y1="357" x2="906" y2="375" stroke="#00CFFF" strokeOpacity="0.55" />
                    <line x1="913" y1="357" x2="913" y2="375" stroke="#00CFFF" strokeOpacity="0.55" />
                  </g>

                  {/* Callout Pin + Horizontal Line + AI LAYER Label */}
                  <circle cx="964" cy="368" r="2.6" fill="#E6F4FF" />
                  <line x1="964" y1="368" x2="1072" y2="368" stroke="#7BA2D6" strokeOpacity="0.75" strokeWidth="1.1" />
                  <text
                    x="1092"
                    y="372"
                    className="constellation__arch-label"
                    fill="#E2ECFF"
                    fontSize="11"
                    fontWeight="600"
                    letterSpacing="0.18em"
                  >
                    AI LAYER
                  </text>
                </g>

                {/* LAYER 1 (TOP): PRODUCT */}
                <g className="constellation__layer constellation__layer--product">
                  {/* Isometric Top Plane */}
                  <polygon
                    points="768,302 1002,302 954,346 720,346"
                    fill="url(#pcLayerTopFill)"
                    stroke="url(#pcLayerStroke)"
                    strokeWidth="1.35"
                    strokeLinejoin="round"
                  />
                  {/* Fine Isometric Dot-Matrix Surface Grid */}
                  <polygon
                    points="770,304 998,304 952,344 724,344"
                    fill="url(#pcDotMatrix)"
                  />

                  {/* Callout Pin + Horizontal Line + PRODUCT Label */}
                  <circle cx="964" cy="328" r="2.6" fill="#FFFFFF" />
                  <line x1="964" y1="328" x2="1072" y2="328" stroke="#7BA2D6" strokeOpacity="0.75" strokeWidth="1.1" />
                  <text
                    x="1092"
                    y="332"
                    className="constellation__arch-label"
                    fill="#E2ECFF"
                    fontSize="11"
                    fontWeight="600"
                    letterSpacing="0.18em"
                  >
                    PRODUCT
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Left Column: Main Heading & Subtitle */}
          <header className="constellation__head">
            <h2 className="constellation__title" id="about-title">
              <span className="constellation__title-part">{titlePart1}</span>
              {titlePart2 ? (
                <>
                  {" "}
                  <span className="constellation__title-part">{titlePart2}</span>
                </>
              ) : null}
            </h2>
            <p className="constellation__lede">{dict.about.lede}</p>
          </header>

          {/* Right Column: Three Value Propositions Positioned Next to Pathway Nodes */}
          <dl className="constellation__values">
            {principles.map((p, idx) => {
              const num = two(idx + 1);
              return (
                <div
                  key={p.name}
                  className={`constellation__value constellation__value--${num}`}
                  data-value-index={idx}
                >
                  <div className="constellation__value-num" aria-hidden="true">
                    {num}
                  </div>
                  <span className="constellation__value-sep" aria-hidden="true" />
                  <div className="constellation__value-copy">
                    <dt className="constellation__value-title">{p.name}</dt>
                    <dd className="constellation__value-desc">{p.text}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>

        {/* 02 — TWO-COLUMN COMPANY PHILOSOPHY STATEMENT */}
        <div className="constellation__philosophy" data-stage="quiet">
          <div className="constellation__philosophy-left">
            <p className="constellation__philosophy-lead">{philosophyLead}</p>
            <span className="constellation__philosophy-underline" aria-hidden="true" />
          </div>
          <span className="constellation__philosophy-divider" aria-hidden="true" />
          <div className="constellation__philosophy-right">
            {philosophyBody ? (
              <p className="constellation__philosophy-body">{philosophyBody}</p>
            ) : null}
          </div>
        </div>

        {/* 03 — FIVE FULL-WIDTH INDUSTRY NAVIGATION ROWS */}
        <div className="constellation__industries-block" aria-labelledby="industries-title">
          <h2 className="constellation__industries-eyebrow" id="industries-title">
            <span>{locale === "ar" ? dict.about.industriesTitle : "INDUSTRIES"}</span>
            {locale === "en" ? <span className="sr"> — {dict.about.industriesTitle}</span> : null}
          </h2>

          <ul
            className="constellation__industries"
            onMouseLeave={() => setHoveredIndustry(1)}
          >
            {industries.map((industry, idx) => {
              const num = two(idx + 1);
              const isHighlighted = hoveredIndustry === idx;
              return (
                <li
                  key={industry}
                  className={`constellation__industry-row${isHighlighted ? " is-highlighted" : ""}`}
                  data-industry-index={idx}
                  tabIndex={0}
                  onMouseEnter={() => setHoveredIndustry(idx)}
                  onFocus={() => setHoveredIndustry(idx)}
                  onClick={() => setHoveredIndustry(idx)}
                >
                  <span className="constellation__industry-sweep" aria-hidden="true" />
                  <div className="constellation__industry-main">
                    <span className="constellation__industry-num" aria-hidden="true">
                      {num}
                    </span>
                    <span className="constellation__industry-sep" aria-hidden="true" />
                    <span className="constellation__industry-name">{industry}</span>
                  </div>
                  <div className="constellation__industry-end" aria-hidden="true">
                    <span className="constellation__industry-line" />
                    <svg
                      className="constellation__industry-arrow"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M7 4.5L12.75 10L7 15.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
