"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/site";

const two = (n: number) => String(n).padStart(2, "0");

export default function ServicesKinetic({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const services = dict.pack.items;
  const [activeService, setActiveService] = useState(0);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectService = (index: number, moveFocus = false) => {
    const next = ((index % services.length) + services.length) % services.length;
    setActiveService(next);
    if (moveFocus) {
      btnRefs.current[next]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      selectService(index + 1, true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      selectService(index - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectService(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      selectService(services.length - 1, true);
    }
  };

  return (
    <section
      className="services-kinetic"
      id="services"
      data-stage="services"
      aria-labelledby="services-title"
    >
      {/* Ambient background wave ribbons matching reference */}
      <div className="services-kinetic__bg" aria-hidden="true">
        <svg
          className="services-kinetic__wave-top"
          viewBox="0 0 1440 420"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="skTopWave1" x1="560" y1="260" x2="1440" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#055FD9" stopOpacity="0" />
              <stop offset="38%" stopColor="#1D91F9" stopOpacity="0.45" />
              <stop offset="72%" stopColor="#00CFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="skTopWave2" x1="640" y1="310" x2="1440" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#055FD9" stopOpacity="0" />
              <stop offset="50%" stopColor="#9B5DE5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d="M620 270 C 830 250, 980 82, 1215 56 C 1320 44, 1390 62, 1440 84"
            stroke="url(#skTopWave1)"
            strokeWidth="3"
          />
          <path
            d="M690 296 C 900 265, 1060 112, 1270 86 C 1350 76, 1405 92, 1440 112"
            stroke="url(#skTopWave2)"
            strokeWidth="1.75"
          />
        </svg>

        <svg
          className="services-kinetic__wave-bottom"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="skBotWave1" x1="0" y1="110" x2="1440" y2="155" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.85" />
              <stop offset="28%" stopColor="#1D91F9" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#055FD9" stopOpacity="0.18" />
              <stop offset="82%" stopColor="#1D91F9" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M-20 82 C 160 175, 420 208, 720 184 C 1010 160, 1230 108, 1460 156"
            stroke="url(#skBotWave1)"
            strokeWidth="2.8"
          />
          <path
            d="M-20 110 C 180 194, 450 216, 750 194 C 1030 172, 1245 128, 1460 174"
            stroke="url(#skBotWave1)"
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />
        </svg>
      </div>

      <div className="wrap services-kinetic__wrap">
        <header className="services-kinetic__head">
          <h2 className="services-kinetic__title" id="services-title">
            {locale === "ar" ? (
              <span className="services-kinetic__title-line">{dict.pack.title}</span>
            ) : (
              <>
                <span className="services-kinetic__title-line">We Don&apos;t Just Build Tech.</span>
                <span className="services-kinetic__title-line">
                  {" "}We Build <span className="services-kinetic__title-accent">What&apos;s Next.</span>
                </span>
              </>
            )}
          </h2>
          <p className="services-kinetic__lede">{dict.pack.lede}</p>
        </header>

        {/* Interactive Six-Service Kinetic Signal Strips */}
        <ol className="kstrips" aria-label={dict.nav.services}>
          {services.map((s, i) => {
            const idx = i + 1;
            const isActive = activeService === i;
            return (
              <li
                key={s.name}
                className={`kstrip kstrip--0${idx} ${isActive ? "is-active" : "is-compact"}`}
                data-step={i}
                data-active={isActive ? "true" : "false"}
              >
                <div className="kstrip__glass" aria-hidden="true">
                  <span className="kstrip__edge-glow" />
                  <span className="kstrip__corner-flare" />
                  <span className="kstrip__sheen" />
                </div>

                <button
                  ref={(el) => {
                    btnRefs.current[i] = el;
                  }}
                  type="button"
                  className="kstrip__btn"
                  aria-expanded={isActive}
                  aria-controls={`kstrip-panel-${idx}`}
                  id={`kstrip-btn-${idx}`}
                  onClick={() => selectService(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                >
                  <span className="kstrip__inner">
                    <span className="kstrip__lead">
                      <span className="kstrip__num" aria-hidden="true">
                        {two(idx)}
                      </span>
                      <span className="kstrip__slash" aria-hidden="true" />
                      <span className="kstrip__copy">
                        <span className="kstrip__title-row">
                          <h3 className="kstrip__title">{s.name}</h3>
                        </span>
                        <span
                          className="kstrip__desc-wrap"
                          id={`kstrip-panel-${idx}`}
                          aria-hidden={!isActive}
                        >
                          <p className="kstrip__desc">{s.text}</p>
                        </span>
                      </span>
                    </span>

                    {/* Service-Specific Decorative Visuals (01 to 06) */}
                    <span className="kstrip__art-col" aria-hidden="true">
                      <span className="kstrip__art">
                        {/* 01 — SOFTWARE DEVELOPMENT: Animated Code Lines */}
                        {idx === 1 && (
                          <span className="kstrip__code" dir="ltr">
                            <span className="kstrip__code-line">
                              <span className="kstrip__code-ln">01</span>
                              <span className="kstrip__code-src">const app = createApp()</span>
                            </span>
                            <span className="kstrip__code-line">
                              <span className="kstrip__code-ln">02</span>
                              <span className="kstrip__code-src">app.use(ai())</span>
                            </span>
                            <span className="kstrip__code-line">
                              <span className="kstrip__code-ln">03</span>
                              <span className="kstrip__code-src">app.connect(cloud)</span>
                            </span>
                            <span className="kstrip__code-line kstrip__code-line--active">
                              <span className="kstrip__code-ln">04</span>
                              <span className="kstrip__code-src">
                                app.deploy()<span className="kstrip__code-caret" />
                              </span>
                            </span>
                          </span>
                        )}

                        {/* 02 — AI AND MACHINE LEARNING: Neural-Network Wave Connections */}
                        {idx === 2 && (
                          <span className="kstrip__neural">
                            <svg
                              className="kstrip__neural-svg"
                              viewBox="0 0 460 116"
                              fill="none"
                              preserveAspectRatio="xMidYMid slice"
                            >
                              <defs>
                                <linearGradient id="skNeuralGrad1" x1="0" y1="58" x2="460" y2="58" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#055FD9" stopOpacity="0.05" />
                                  <stop offset="28%" stopColor="#1D91F9" stopOpacity="0.65" />
                                  <stop offset="68%" stopColor="#00CFFF" stopOpacity="0.9" />
                                  <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.92" />
                                </linearGradient>
                                <linearGradient id="skNeuralGrad2" x1="0" y1="58" x2="460" y2="58" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#1D91F9" stopOpacity="0" />
                                  <stop offset="40%" stopColor="#00CFFF" stopOpacity="0.45" />
                                  <stop offset="85%" stopColor="#9B5DE5" stopOpacity="0.78" />
                                  <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.7" />
                                </linearGradient>
                              </defs>
                              <g className="kstrip__neural-waves">
                                <path d="M8 78 C 68 34, 128 96, 188 54 C 248 12, 308 98, 368 42 C 404 12, 434 28, 456 54" stroke="url(#skNeuralGrad1)" strokeWidth="1.6" />
                                <path d="M8 72 C 68 40, 128 90, 188 48 C 248 18, 308 92, 368 36 C 404 16, 434 34, 456 60" stroke="url(#skNeuralGrad2)" strokeWidth="1.15" />
                                <path d="M8 66 C 68 46, 128 84, 188 42 C 248 24, 308 86, 368 30 C 404 20, 434 40, 456 66" stroke="url(#skNeuralGrad2)" strokeWidth="0.95" strokeOpacity="0.75" />
                                <path d="M8 60 C 68 52, 128 78, 188 36 C 248 30, 308 80, 368 24 C 404 26, 434 46, 456 72" stroke="url(#skNeuralGrad2)" strokeWidth="0.8" strokeOpacity="0.55" />
                                <path d="M20 44 C 84 94, 148 24, 212 76 C 276 106, 336 16, 398 74 C 424 94, 444 82, 458 64" stroke="url(#skNeuralGrad1)" strokeWidth="1.45" />
                                <path d="M20 50 C 84 88, 148 30, 212 70 C 276 98, 336 22, 398 68 C 424 88, 444 76, 458 58" stroke="url(#skNeuralGrad2)" strokeWidth="1.05" />
                                <path d="M20 56 C 84 82, 148 36, 212 64 C 276 90, 336 28, 398 62 C 424 82, 444 70, 458 52" stroke="url(#skNeuralGrad2)" strokeWidth="0.85" strokeOpacity="0.65" />
                                <path d="M98 63 L 154 44 L 204 68 L 258 34 L 314 74 L 368 36 L 418 70" stroke="url(#skNeuralGrad1)" strokeWidth="0.9" strokeDasharray="3 3" />
                              </g>
                              <g className="kstrip__neural-nodes">
                                <circle cx="98" cy="63" r="3" fill="#00CFFF" />
                                <circle cx="98" cy="63" r="7" fill="#00CFFF" fillOpacity="0.24" />
                                <circle cx="154" cy="44" r="3.2" fill="#00CFFF" />
                                <circle cx="154" cy="44" r="8" fill="#00CFFF" fillOpacity="0.28" />
                                <circle cx="204" cy="68" r="3.5" fill="#00CFFF" />
                                <circle cx="204" cy="68" r="9" fill="#1D91F9" fillOpacity="0.3" />
                                <circle cx="258" cy="34" r="3.6" fill="#FFFFFF" />
                                <circle cx="258" cy="34" r="9.5" fill="#00CFFF" fillOpacity="0.38" />
                                <circle cx="290" cy="78" r="3" fill="#00CFFF" />
                                <circle cx="314" cy="74" r="3.2" fill="#00CFFF" />
                                <circle cx="314" cy="74" r="8" fill="#00CFFF" fillOpacity="0.25" />
                                <circle cx="368" cy="36" r="3.5" fill="#9B5DE5" />
                                <circle cx="368" cy="36" r="9" fill="#9B5DE5" fillOpacity="0.32" />
                                <circle cx="436" cy="74" r="3" fill="#9B5DE5" />
                                <circle cx="436" cy="74" r="7" fill="#9B5DE5" fillOpacity="0.28" />
                              </g>
                            </svg>
                          </span>
                        )}

                        {/* 03 — AUTOMATION: Connected Workflow Circuit Paths */}
                        {idx === 3 && (
                          <span className="kstrip__workflow">
                            <svg
                              className="kstrip__workflow-svg"
                              viewBox="0 0 440 100"
                              fill="none"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="skFlowLine1" x1="10" y1="50" x2="430" y2="50" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#055FD9" stopOpacity="0.1" />
                                  <stop offset="32%" stopColor="#1D91F9" stopOpacity="0.75" />
                                  <stop offset="68%" stopColor="#00CFFF" stopOpacity="0.95" />
                                  <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.85" />
                                </linearGradient>
                                <linearGradient id="skFlowLine2" x1="10" y1="50" x2="430" y2="50" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#055FD9" stopOpacity="0.05" />
                                  <stop offset="45%" stopColor="#1D91F9" stopOpacity="0.5" />
                                  <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.65" />
                                </linearGradient>
                              </defs>
                              <path
                                className="kstrip__workflow-path"
                                d="M12 68 H 84 L 112 34 H 178 L 208 66 H 266 L 296 36 H 426"
                                stroke="url(#skFlowLine1)"
                                strokeWidth="2.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                className="kstrip__workflow-path kstrip__workflow-path--alt"
                                d="M36 78 H 96 L 124 46 H 168 L 198 76 H 276 L 306 48 H 426"
                                stroke="url(#skFlowLine2)"
                                strokeWidth="1.35"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M62 24 H 148 M 292 64 H 426"
                                stroke="url(#skFlowLine2)"
                                strokeWidth="1.15"
                                strokeLinecap="round"
                              />
                              <g className="kstrip__workflow-nodes">
                                <circle cx="148" cy="34" r="7.5" fill="#030B1E" stroke="#00CFFF" strokeWidth="2.2" />
                                <circle cx="148" cy="34" r="3" fill="#FFFFFF" />
                                <circle cx="226" cy="66" r="7.5" fill="#030B1E" stroke="#00CFFF" strokeWidth="2.2" />
                                <circle cx="226" cy="66" r="3" fill="#00CFFF" />
                                <circle cx="272" cy="48" r="6.5" fill="#030B1E" stroke="#1D91F9" strokeWidth="2" />
                                <circle cx="272" cy="48" r="2.5" fill="#00CFFF" />
                                <circle cx="386" cy="36" r="7" fill="#030B1E" stroke="#9B5DE5" strokeWidth="2" />
                                <circle cx="386" cy="36" r="2.6" fill="#FFFFFF" />
                                <circle cx="382" cy="64" r="7.5" fill="#030B1E" stroke="#9B5DE5" strokeWidth="2.2" />
                                <circle cx="382" cy="64" r="3.2" fill="#FFFFFF" />
                              </g>
                            </svg>
                          </span>
                        )}

                        {/* 04 — IT AND CLOUD: Cloud Architecture & Connected Server Nodes */}
                        {idx === 4 && (
                          <span className="kstrip__cloud">
                            <svg
                              className="kstrip__cloud-svg"
                              viewBox="0 0 440 100"
                              fill="none"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="skCloudBus" x1="16" y1="50" x2="424" y2="50" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#055FD9" stopOpacity="0.12" />
                                  <stop offset="35%" stopColor="#1D91F9" stopOpacity="0.8" />
                                  <stop offset="72%" stopColor="#00CFFF" stopOpacity="0.95" />
                                  <stop offset="100%" stopColor="#1D91F9" stopOpacity="0.85" />
                                </linearGradient>
                              </defs>

                              {/* Redundant mesh backbone links */}
                              <path
                                d="M24 52 H 116 L 146 28 H 236 L 266 52 H 340 M 116 52 L 146 76 H 236 L 266 52"
                                stroke="url(#skCloudBus)"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M52 34 H 96 L 116 52 M 52 70 H 96 L 116 52"
                                stroke="url(#skCloudBus)"
                                strokeWidth="1.25"
                                strokeDasharray="3 3"
                              />

                              {/* Left server cluster nodes */}
                              <g className="kstrip__cloud-racks">
                                <rect x="148" y="16" width="84" height="22" rx="5" fill="rgba(3, 16, 44, 0.85)" stroke="#00CFFF" strokeWidth="1.4" />
                                <circle cx="160" cy="27" r="2.5" fill="#00CFFF" />
                                <circle cx="170" cy="27" r="2.5" fill="#1D91F9" />
                                <line x1="182" y1="27" x2="220" y2="27" stroke="#00CFFF" strokeWidth="1.5" strokeOpacity="0.7" />

                                <rect x="148" y="64" width="84" height="22" rx="5" fill="rgba(3, 16, 44, 0.85)" stroke="#1D91F9" strokeWidth="1.4" />
                                <circle cx="160" cy="75" r="2.5" fill="#00CFFF" />
                                <circle cx="170" cy="75" r="2.5" fill="#00CFFF" />
                                <line x1="182" y1="75" x2="220" y2="75" stroke="#1D91F9" strokeWidth="1.5" strokeOpacity="0.7" />
                              </g>

                              {/* Right cloud core node & availability rings */}
                              <g className="kstrip__cloud-hub">
                                <circle cx="358" cy="52" r="30" stroke="#1D91F9" strokeWidth="1.1" strokeOpacity="0.38" strokeDasharray="4 4" />
                                <circle cx="358" cy="52" r="21" fill="rgba(5, 95, 217, 0.16)" stroke="#00CFFF" strokeWidth="1.5" />
                                <path
                                  d="M347 57 H 368 C 372.5 57, 375.5 53.8, 375.5 49.8 C 375.5 46.1, 372.8 43.2, 369.2 42.8 C 367.8 37.8, 363.2 34.5, 357.8 34.5 C 351.6 34.5, 346.6 39.1, 346.1 45 C 342.8 45.6, 340.5 48.4, 340.5 51.8 C 340.5 54.8, 343.3 57, 347 57 Z"
                                  fill="rgba(0, 207, 255, 0.22)"
                                  stroke="#FFFFFF"
                                  strokeWidth="1.6"
                                  strokeLinejoin="round"
                                />
                                <circle cx="116" cy="52" r="5.5" fill="#030B1E" stroke="#00CFFF" strokeWidth="2" />
                                <circle cx="266" cy="52" r="5.5" fill="#030B1E" stroke="#00CFFF" strokeWidth="2" />
                                <circle cx="266" cy="52" r="2.2" fill="#FFFFFF" />
                              </g>
                            </svg>
                          </span>
                        )}

                        {/* 05 — DIGITAL TRANSFORMATION: Interconnected Digital Layers & Systems */}
                        {idx === 5 && (
                          <span className="kstrip__layers">
                            <svg
                              className="kstrip__layers-svg"
                              viewBox="0 0 440 100"
                              fill="none"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="skLayerStroke" x1="40" y1="50" x2="410" y2="50" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#1D91F9" stopOpacity="0.2" />
                                  <stop offset="45%" stopColor="#00CFFF" stopOpacity="0.9" />
                                  <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.9" />
                                </linearGradient>
                              </defs>

                              {/* Connecting transformation streams */}
                              <path
                                d="M24 66 C 82 66, 118 32, 174 32 H 370"
                                stroke="url(#skLayerStroke)"
                                strokeWidth="1.7"
                              />
                              <path
                                d="M24 38 C 82 38, 118 70, 174 70 H 370"
                                stroke="url(#skLayerStroke)"
                                strokeWidth="1.4"
                                strokeDasharray="4 3"
                              />

                              {/* Three Isometric Digital Architecture Planes */}
                              <g className="kstrip__layers-planes">
                                <polygon
                                  points="150,52 204,24 258,52 204,80"
                                  fill="rgba(5, 95, 217, 0.18)"
                                  stroke="#1D91F9"
                                  strokeWidth="1.4"
                                />
                                <polygon
                                  points="218,52 272,24 326,52 272,80"
                                  fill="rgba(0, 207, 255, 0.18)"
                                  stroke="#00CFFF"
                                  strokeWidth="1.6"
                                />
                                <polygon
                                  points="286,52 340,24 394,52 340,80"
                                  fill="rgba(155, 93, 229, 0.2)"
                                  stroke="#9B5DE5"
                                  strokeWidth="1.6"
                                />
                              </g>

                              {/* Axis bridge & synchronized nodes */}
                              <line x1="120" y1="52" x2="416" y2="52" stroke="#00CFFF" strokeWidth="1.6" />
                              <circle cx="204" cy="52" r="4.5" fill="#030B1E" stroke="#1D91F9" strokeWidth="2" />
                              <circle cx="272" cy="52" r="5" fill="#FFFFFF" stroke="#00CFFF" strokeWidth="2" />
                              <circle cx="340" cy="52" r="4.5" fill="#030B1E" stroke="#9B5DE5" strokeWidth="2" />
                              <circle cx="394" cy="52" r="3.5" fill="#00CFFF" />
                            </svg>
                          </span>
                        )}

                        {/* 06 — TECHNOLOGY CONSULTING: Technical Architecture Diagrams & Data Paths */}
                        {idx === 6 && (
                          <span className="kstrip__arch">
                            <svg
                              className="kstrip__arch-svg"
                              viewBox="0 0 440 100"
                              fill="none"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="skArchPath" x1="20" y1="50" x2="420" y2="50" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#055FD9" stopOpacity="0.15" />
                                  <stop offset="40%" stopColor="#1D91F9" stopOpacity="0.85" />
                                  <stop offset="78%" stopColor="#00CFFF" stopOpacity="0.95" />
                                  <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.85" />
                                </linearGradient>
                              </defs>

                              {/* Architectural blueprint grid & data paths */}
                              <path
                                d="M24 50 H 104 L 136 26 H 210 L 242 50 H 314 L 342 26 H 412"
                                stroke="url(#skArchPath)"
                                strokeWidth="1.9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M104 50 L 136 74 H 210 L 242 50 M 314 50 L 342 74 H 412"
                                stroke="url(#skArchPath)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Blueprint architecture modules */}
                              <rect x="148" y="15" width="50" height="22" rx="4" fill="rgba(3, 14, 38, 0.9)" stroke="#00CFFF" strokeWidth="1.4" />
                              <rect x="148" y="63" width="50" height="22" rx="4" fill="rgba(3, 14, 38, 0.9)" stroke="#1D91F9" strokeWidth="1.4" />
                              <rect x="256" y="38" width="46" height="24" rx="5" fill="rgba(5, 95, 217, 0.24)" stroke="#00CFFF" strokeWidth="1.6" />
                              <rect x="352" y="15" width="52" height="22" rx="4" fill="rgba(3, 14, 38, 0.9)" stroke="#9B5DE5" strokeWidth="1.4" />
                              <rect x="352" y="63" width="52" height="22" rx="4" fill="rgba(3, 14, 38, 0.9)" stroke="#00CFFF" strokeWidth="1.4" />

                              {/* Module internal schematic lines & nodes */}
                              <line x1="158" y1="26" x2="188" y2="26" stroke="#00CFFF" strokeWidth="1.5" />
                              <line x1="158" y1="74" x2="188" y2="74" stroke="#1D91F9" strokeWidth="1.5" />
                              <circle cx="279" cy="50" r="4" fill="#FFFFFF" />
                              <line x1="362" y1="26" x2="394" y2="26" stroke="#9B5DE5" strokeWidth="1.5" />
                              <line x1="362" y1="74" x2="394" y2="74" stroke="#00CFFF" strokeWidth="1.5" />

                              <circle cx="104" cy="50" r="4.5" fill="#030B1E" stroke="#00CFFF" strokeWidth="2" />
                              <circle cx="242" cy="50" r="4.5" fill="#030B1E" stroke="#00CFFF" strokeWidth="2" />
                              <circle cx="314" cy="50" r="4.5" fill="#030B1E" stroke="#1D91F9" strokeWidth="2" />
                            </svg>
                          </span>
                        )}
                      </span>

                      {/* Subtle compact state signal indicator */}
                      <span className="kstrip__compact-cue">
                        <span className="kstrip__compact-line" />
                        <span className="kstrip__compact-node" />
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
