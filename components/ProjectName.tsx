"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Dict } from "@/lib/content";
import { getProjectName, MAX_NAME, onProjectName, setProjectName } from "@/lib/projectName";

/** The hero field: name your project, then watch the page build it. */
export default function ProjectName({ t }: { t: Dict["hero"] }) {
  const [value, setValue] = useState("");

  // Keep every "<span data-project-name>" on the page in step with the name.
  useEffect(() => {
    const paint = (name: string) => {
      document.querySelectorAll<HTMLElement>("[data-project-name]").forEach((el) => {
        el.textContent = name || el.dataset.default || "";
        el.classList.toggle("is-named", Boolean(name));
      });
    };
    const saved = getProjectName();
    if (saved) {
      setValue(saved);
      paint(saved);
    }
    return onProjectName(paint);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProjectName(value);
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form className="namer" onSubmit={onSubmit}>
      <label className="sr" htmlFor="project-name">
        {t.nameLabel}
      </label>
      <div className="namer__row">
        <span className="namer__term" aria-hidden="true">
          <svg viewBox="0 0 24 20" fill="none">
            <path
              d="M3 4.5L9.5 10L3 15.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 16.5H20.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          id="project-name"
          value={value}
          maxLength={MAX_NAME}
          placeholder={t.namePlaceholder}
          autoComplete="off"
          enterKeyHint="go"
          onChange={(e) => {
            setValue(e.target.value);
            setProjectName(e.target.value);
          }}
        />
        <span className="namer__circuit" aria-hidden="true">
          <svg viewBox="0 0 64 52" fill="none" preserveAspectRatio="none">
            <path
              d="M8 52L27 31L46 14L62 4M27 31L55 49M46 14L64 20M46 14L44 0"
              stroke="#00CFFF"
              strokeOpacity="0.42"
              strokeWidth="1"
            />
            <circle cx="11" cy="49" r="1.8" fill="#1D91F9" opacity="0.85" />
            <circle cx="27" cy="31" r="2.5" fill="#00CFFF" className="namer__node" />
            <circle cx="46" cy="14" r="2.8" fill="#00CFFF" className="namer__node" />
          </svg>
        </span>
        <button type="submit" className="btn btn--solid namer__cta">
          <svg className="namer__net" viewBox="0 0 22 20" fill="none" aria-hidden="true">
            <path d="M11 4.2L5 14.8H17L11 4.2Z" stroke="#00CFFF" strokeWidth="1.7" strokeLinejoin="round" />
            <circle cx="11" cy="4.2" r="2.3" fill="#04196A" stroke="#00CFFF" strokeWidth="1.7" />
            <circle cx="5" cy="14.8" r="2.3" fill="#04196A" stroke="#00CFFF" strokeWidth="1.7" />
            <circle cx="17" cy="14.8" r="2.3" fill="#04196A" stroke="#00CFFF" strokeWidth="1.7" />
          </svg>
          <span>{t.nameCta}</span>
          <svg className="namer__arrow" viewBox="0 0 18 16" fill="none" aria-hidden="true">
            <path
              d="M2.5 8H14.5M10 3.5L14.5 8L10 12.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="namer__hint">{t.nameHint}</p>
    </form>
  );
}
