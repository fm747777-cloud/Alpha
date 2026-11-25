# ALPHA — اتبع الألفا

الموقع التعريفي لـ ALPHA Software Solutions. لوجو الألفا المجسّم يقود الصفحة، والقطيع يتبعه.

## التشغيل

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # يكتب الموقع الجاهز في ./out
npm start        # يعرض ./out محلياً
```

`npm run build` ينتج HTML/CSS/JS ثابت في `out/`. ارفع محتوى المجلد على أي استضافة (Vercel، Netlify، cPanel، Nginx).

## قبل النشر

1. انسخ `.env.example` إلى `.env.local` واملأ:
   - `NEXT_PUBLIC_SITE_URL`: الدومين النهائي بدون `/` في الآخر. تُبنى عليه روابط canonical و hreflang و sitemap وصور المشاركة.
   - مفاتيح EmailJS الثلاثة. بدونها النموذج يعرض رسالة "غير مفعّل" ويوجّه لواتساب.
   - قالب EmailJS يستقبل الحقول: `fullName`, `email`, `phone`, `companyName`, `service`, `budget`, `timeline`, `details`.
2. راجع بيانات التواصل في `lib/site.ts` (الهاتف، واتساب، البريد).
3. بعد النشر أضف الموقع في Google Search Console وأرسل `/sitemap.xml`.

## أين أعدّل؟

| ما تريد تغييره | الملف |
| --- | --- |
| النصوص (عربي/إنجليزي) | `lib/content.ts` |
| المشاريع | `lib/projects.ts` + الصور في `public/media/work` والفيديو في `public/media/video` |
| بيانات الشركة والدومين | `lib/site.ts` |
| الألوان والخطوط | `app/globals.css` |
| المشهد الـ3D | `components/Stage.tsx` |
| حركة السكرول | `components/Scroll.tsx` |
| وسوم SEO والبيانات المنظمة | `lib/seo.ts` |

## البنية

- العربية على `/` والإنجليزية على `/en/`، وكل مشروع له صفحة: `/work/<slug>/` و `/en/work/<slug>/`.
- كل الصفحات تُبنى كـHTML كامل وقت الـbuild، فالمحتوى يصل لمحركات البحث بدون JavaScript.
- لكل صفحة: title و description و canonical و hreflang و Open Graph وبيانات منظمة (Organization, WebSite, Service, FAQPage, CreativeWork, BreadcrumbList).
- `sitemap.xml` و `robots.txt` و `manifest.webmanifest` تتولد تلقائياً.

## الحركة والـ3D

- **الفكرة:** الزائر يكتب اسم مشروعه في الهيرو، ثم يشاهده يمر بدورة حياة البرمجيات كاملة مع التمرير: الفكرة، التخطيط، التصميم، التطوير، الاختبار، الإطلاق، الدعم والتطوير. الاسم يظهر على شاشة المجسّم وفي العناوين ويُكتب مسبقاً في نموذج التواصل. يُحفظ في `sessionStorage` فقط ولا يُرسل لأي مكان (`lib/projectName.ts`).
- شاشة المشروع تُرسم على canvas ثنائي الأبعاد داخل `drawScreen` في `components/Stage.tsx` وتُستخدم كخامة للمجسّم. نصوص المراحل في `lib/content.ts` تحت `hunt.steps`.

- `components/Stage.tsx`: مشهد three.js واحد ثابت خلف الصفحة. لوجو ALPHA مجسّم من مسار اللوجو نفسه (`lib/logoPath.ts`) بتدرّج الأزرق الأصلي، يقف على أرضية من مثلثات، ووراءه قطيع من حروف A صغيرة يتبعه من مشهد لآخر.
- كل قسم عليه `data-stage="..."` هو مشهد. موضع اللوجو ودورانه وحجمه في كل مشهد معرّفة في الدالة `poseFor` أعلى الملف.
- `components/Scroll.tsx`: تمرير ناعم (Lenis) على الديسكتوب، وتثبيت الأقسام (`data-pin`) وتبديل الخطوات، وحركة الأعمال الأفقية.
- three.js يُحمَّل بعد ظهور الصفحة فقط. بدون كارت شاشة أو مع `prefers-reduced-motion` لا يُحمَّل شيء وتظهر صورة ثابتة للمشهد (`public/media/alpha-3d.webp`).
- بدون JavaScript تظهر كل الأقسام كصفحة عادية مقروءة.
- الوضع الفاتح: زر في الهيدر يضع `data-theme="light"` على `<html>` ويحفظ الاختيار في `localStorage`. الافتراضي داكن دائماً. ألوان الوضعين في أول `app/globals.css`.
- للتجربة على جهاز بدون GPU أضف `?gl=force` للرابط.
