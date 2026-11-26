import type { ReactNode } from "react";
import JsonLd from "./JsonLd";
import Stage from "./Stage";
import { getDict } from "@/lib/content";
import { organizationLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

/** The <html> document shared by the Arabic and English root layouts. */
export default function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDict(locale);
  const arabic = locale === "ar";
  return (
    <html lang={locale} dir={arabic ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={`/fonts/alexandria-${arabic ? "arabic" : "latin"}-wght-normal.woff2`}
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={`/fonts/ibm-plex-sans-arabic-${arabic ? "arabic" : "latin"}-400-normal.woff2`}
        />
        <meta name="theme-color" content="#03060d" />
        {/* Apply a saved light-mode choice before first paint and provide resilient theme toggling. Dark is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if("scrollRestoration"in history){history.scrollRestoration="manual";}var nav=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];var isReload=Boolean((nav&&nav.type==="reload")||(performance.navigation&&performance.navigation.type===1));var p=location.pathname;var isHome=p==="/"||p==="/ar"||p==="/ar/";if(isHome&&isReload&&location.hash){window.__alphaReloadClearedHash=true;history.replaceState(null,"",p+location.search);}if(!location.hash){window.scrollTo(0,0);var u=false;var stop=function(){u=true;};window.addEventListener("wheel",stop,{passive:true,once:true});window.addEventListener("touchstart",stop,{passive:true,once:true});window.addEventListener("pointerdown",stop,{passive:true,once:true});window.addEventListener("keydown",stop,{passive:true,once:true});var lock=function(){if(!u&&!location.hash&&window.scrollY>0){window.scrollTo(0,0);}};window.addEventListener("DOMContentLoaded",lock,{once:true});window.addEventListener("load",function(){lock();setTimeout(lock,60);},{once:true});window.addEventListener("pageshow",function(e){if(e&&e.persisted&&!location.hash){u=false;window.scrollTo(0,0);}});}}catch(e){}var last=0;function apply(light,save){var r=document.documentElement;if(light){r.setAttribute("data-theme","light");}else{r.removeAttribute("data-theme");}var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",light?"#F1F6FF":"#03060d");if(save){try{localStorage.setItem("alpha-theme",light?"light":"dark");}catch(e){}}}try{apply(localStorage.getItem("alpha-theme")==="light",false);}catch(e){apply(false,false);}window.__alphaToggleTheme=function(){var now=Date.now();if(now-last<80)return;last=now;var next=document.documentElement.getAttribute("data-theme")!=="light";apply(next,true);return next;};var workLast=0;window.__alphaSetWorkIndex=function(targetIdx){var sec=document.getElementById("work");if(!sec)return;var slides=sec.querySelectorAll(".work-slide");var total=slides.length;if(total<=1)return;var next=((targetIdx%total)+total)%total;sec.setAttribute("data-active-index",String(next));var half=Math.floor(total/2);for(var i=0;i<total;i++){var sl=slides[i];var diff=i-next;if(diff>half)diff-=total;if(diff<-half)diff+=total;var isCenter=diff===0;var isPrev=diff===-1;var isNext=diff===1;var pos=isCenter?"center":isPrev?"prev":isNext?"next":diff<-1?"far-prev":"far-next";sl.className="work-slide work-slide--"+pos;sl.setAttribute("data-offset",String(diff));sl.setAttribute("aria-hidden",isCenter?"false":"true");var dev=sl.querySelector(".work-slide__device");if(dev){if(!isCenter&&(isPrev||isNext)){dev.setAttribute("role","button");dev.setAttribute("tabindex","0");}else{dev.removeAttribute("role");dev.removeAttribute("tabindex");}}var cl=sl.querySelector(".work-slide__center-link");if(cl){cl.setAttribute("tabindex",isCenter?"0":"-1");}var img=sl.querySelector("img");var imgBase=sl.getAttribute("data-image");if(img&&imgBase){var targetSrc="/media/work/"+imgBase+"-"+(isCenter?"1400":"760")+".webp";if(img.getAttribute("src")!==targetSrc){img.setAttribute("src",targetSrc);}}}var activeSlide=slides[next];if(activeSlide){var num=activeSlide.getAttribute("data-num")||"01";var cat=activeSlide.getAttribute("data-category")||"";var title=activeSlide.getAttribute("data-title")||"";var desc=activeSlide.getAttribute("data-summary")||"";var href=activeSlide.getAttribute("data-href")||"#";var isLive=activeSlide.getAttribute("data-live")==="true";var numEl=sec.querySelector(".work-info__num");if(numEl)numEl.textContent=num;var catEl=sec.querySelector(".work-info__cat");if(catEl)catEl.textContent=cat;var liveEl=sec.querySelector(".work-info__live");if(liveEl)liveEl.style.display=isLive?"":"none";var titleTextEl=sec.querySelector(".work-info__title-text")||sec.querySelector(".work-info__title bdi");if(titleTextEl)titleTextEl.textContent=title;var titleLinkEl=sec.querySelector(".work-info__title-link")||sec.querySelector(".work-info__title a");if(titleLinkEl)titleLinkEl.setAttribute("href",href);var descEl=sec.querySelector(".work-info__desc");if(descEl)descEl.textContent=desc;var expEl=sec.querySelector(".work-explore-btn");if(expEl)expEl.setAttribute("href",href);var curEl=sec.querySelector(".work-progress__current");if(curEl)curEl.textContent=num;}var segs=sec.querySelectorAll(".work-progress__seg");for(var j=0;j<segs.length;j++){var sel=j===next;segs[j].classList.toggle("is-active",sel);segs[j].setAttribute("aria-selected",sel?"true":"false");}};function navWork(delta,explicitIdx){var now=Date.now();if(now-workLast<120)return;workLast=now;var sec=document.getElementById("work");if(!sec)return;var cur=Number(sec.getAttribute("data-active-index")||"0");var target=typeof explicitIdx==="number"?explicitIdx:cur+delta;if(window.__alphaSetWorkIndex)window.__alphaSetWorkIndex(target);}window.__alphaNavWork=navWork;function initAboutReveal(){var ab=document.getElementById("about");if(!ab||ab.classList.contains("is-inview"))return;if(!("IntersectionObserver"in window)||(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)){ab.classList.add("is-inview");return;}var io=new IntersectionObserver(function(entries){for(var i=0;i<entries.length;i++){if(entries[i].isIntersecting){ab.classList.add("is-inview");io.disconnect();break;}}},{threshold:0.12});io.observe(ab);}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initAboutReveal,{once:true});}else{initAboutReveal();}document.addEventListener("mouseover",function(e){var t=e.target;if(!t||!t.closest)return;var row=t.closest(".constellation__industry-row");if(row){var list=row.closest(".constellation__industries");if(list){var rows=list.querySelectorAll(".constellation__industry-row");for(var r=0;r<rows.length;r++){rows[r].classList.toggle("is-highlighted",rows[r]===row);}}}},true);document.addEventListener("click",function(e){var t=e.target;if(!t||!t.closest)return;if(t.closest(".theme-btn")&&window.__alphaToggleTheme){window.__alphaToggleTheme();return;}var prevBtn=t.closest(".work-nav--prev");if(prevBtn){e.preventDefault();navWork(-1);return;}var nextBtn=t.closest(".work-nav--next");if(nextBtn){e.preventDefault();navWork(1);return;}var segBtn=t.closest(".work-progress__seg");if(segBtn){var sIdx=Number(segBtn.getAttribute("data-seg-index"));if(!isNaN(sIdx)){e.preventDefault();navWork(0,sIdx);return;}}var slideEl=t.closest(".work-slide");if(slideEl){var off=Number(slideEl.getAttribute("data-offset"));if(off===-1){e.preventDefault();navWork(-1);return;}if(off===1){e.preventDefault();navWork(1);return;}}var indRow=t.closest(".constellation__industry-row");if(indRow){var indList=indRow.closest(".constellation__industries");if(indList){var allInd=indList.querySelectorAll(".constellation__industry-row");for(var m=0;m<allInd.length;m++){allInd[m].classList.toggle("is-highlighted",allInd[m]===indRow);}}}var kBtn=t.closest(".kstrip__btn");if(kBtn){var kItem=kBtn.closest(".kstrip");var kList=kBtn.closest(".kstrips");if(kItem&&kList){var allK=kList.querySelectorAll(".kstrip");for(var k=0;k<allK.length;k++){var act=allK[k]===kItem;allK[k].classList.toggle("is-active",act);allK[k].classList.toggle("is-compact",!act);allK[k].setAttribute("data-active",act?"true":"false");var b=allK[k].querySelector(".kstrip__btn");if(b)b.setAttribute("aria-expanded",act?"true":"false");var dw=allK[k].querySelector(".kstrip__desc-wrap");if(dw)dw.setAttribute("aria-hidden",act?"false":"true");}}}},true);document.addEventListener("keydown",function(e){var t=e.target;if(!t||!t.closest)return;var inWork=t.closest("#work");if(inWork&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){var rtl=document.documentElement.dir==="rtl";e.preventDefault();if(e.key==="ArrowLeft")navWork(rtl?1:-1);else navWork(rtl?-1:1);}},true);})();`,
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">
          {dict.nav.skip}
        </a>
        <div className="backdrop" aria-hidden="true" />
        <Stage />
        {children}
        <JsonLd data={organizationLd(locale)} />
      </body>
    </html>
  );
}
