import type { Locale } from "./site";

type L<T> = Record<Locale, T>;

export interface Project {
  slug: string;
  title: string;
  category: L<string>;
  /** One sentence, used on cards and as the meta description. */
  summary: L<string>;
  overview: L<string>;
  sections: L<{ title: string; text: string }[]>;
  tags: string[];
  /** Base name in /media/work (‑1400.webp and ‑760.webp). */
  image: string;
  video?: boolean;
  url?: string;
  live?: boolean;
}

export const projects: Project[] = [
  {
    slug: "sanad-healthcare-platform",
    title: "Sanad A+",
    category: { en: "Healthcare and IoT", ar: "الرعاية الصحية وإنترنت الأشياء" },
    summary: {
      en: "A care platform for elderly people and Alzheimer's patients, with live location tracking, medication reminders and home-care booking.",
      ar: "منصة رعاية لكبار السن ومرضى الزهايمر، بتتبع موقع لحظي وتذكير بالأدوية وحجز الرعاية المنزلية.",
    },
    overview: {
      en: "Sanad A+ supports elderly people and Alzheimer's patients and the families who look after them. It tracks location in real time through a phone or a connected medical watch, sends automatic medication and appointment reminders, and includes live chat. Families book specialised home-care nurses and doctors through the platform, which runs on two web dashboards for admins and doctors and a mobile app for caregivers.",
      ar: "تدعم منصة Sanad A+ كبار السن ومرضى الزهايمر والأسر التي ترعاهم. تتتبع الموقع لحظياً عبر الهاتف أو ساعة طبية متصلة، وترسل تذكيرات تلقائية بالأدوية والمواعيد، وتتضمن محادثة مباشرة. تحجز الأسر الممرضين والأطباء المتخصصين في الرعاية المنزلية من داخل المنصة، التي تعمل عبر لوحتي تحكم للإدارة والأطباء وتطبيق جوال لمقدمي الرعاية.",
    },
    sections: {
      en: [
        { title: "Backend and real-time tracking", text: "A secure, event-driven backend on NestJS, TypeScript, MySQL and TypeORM. Leaflet and geolocation services provide live tracking from phones and wearable medical watches. Socket.io powers messaging, and Firebase Cloud Messaging delivers time-critical medication and schedule alerts." },
        { title: "Dashboards for admins and medical staff", text: "Responsive React interfaces with Leaflet maps. Staff manage patient records, follow live locations, and coordinate nursing and consultation schedules across specialties. A web portal lets family members manage profiles, review care logs and book services." },
        { title: "Caregiver mobile app", text: "A cross-platform app for real-time monitoring: live location on a map, scheduled dosage notifications, direct chat with the assigned nurse or doctor, and instant booking of certified home-care practitioners." },
      ],
      ar: [
        { title: "الخادم والتتبع اللحظي", text: "خادم آمن قائم على الأحداث مبني بـNestJS وTypeScript وMySQL وTypeORM. خدمات Leaflet وتحديد الموقع توفر تتبعاً مباشراً من الهواتف والساعات الطبية. Socket.io يشغّل المراسلة، وFirebase Cloud Messaging يوصل تنبيهات الأدوية والمواعيد في وقتها." },
        { title: "لوحات تحكم للإدارة والطاقم الطبي", text: "واجهات React متجاوبة مع خرائط Leaflet. يدير الطاقم سجلات المرضى ويتابع المواقع لحظياً وينسّق جداول التمريض والاستشارات عبر التخصصات. وبوابة ويب تتيح للأسرة إدارة الملفات ومراجعة سجلات الرعاية وحجز الخدمات." },
        { title: "تطبيق جوال لمقدمي الرعاية", text: "تطبيق متعدد المنصات للمتابعة اللحظية: الموقع المباشر على الخريطة، إشعارات مجدولة للجرعات، محادثة مباشرة مع الممرض أو الطبيب المسؤول، وحجز فوري لممارسي الرعاية المنزلية المعتمدين." },
      ],
    },
    tags: ["NestJS", "React Native", "React", "Leaflet", "Socket.io", "Firebase FCM", "TypeORM", "MySQL"],
    image: "sanad-healthcare-platform",
    video: true,
    url: "https://sanadaplus.com",
    live: true,
  },
  {
    slug: "solo-tutor-lms",
    title: "LMS Single",
    category: { en: "Learning management", ar: "إدارة التعلّم" },
    summary: {
      en: "A complete learning management system for the independent teacher: hosted courses, installment payments, an automated question bank and two mobile apps.",
      ar: "نظام إدارة تعلّم متكامل للمعلم المستقل: دورات مستضافة، مدفوعات بالأقساط، بنك أسئلة آلي، وتطبيقان للجوال.",
    },
    overview: {
      en: "LMS Single gives one educator everything needed to teach online. Courses are hosted on Bunny.net, with payment and installment integrations built in. An automated question bank produces tiered quizzes and assignments, and student tracking runs alongside. Real-time notifications, live streaming and two mobile apps keep students and parents in step with progress.",
      ar: "يمنح LMS Single المعلم المستقل كل ما يحتاجه للتدريس عبر الإنترنت. تُستضاف الدورات على Bunny.net مع تكامل للمدفوعات والأقساط. بنك أسئلة آلي يولّد اختبارات وواجبات متدرجة المستوى، مع متابعة مستمرة للطلاب. والإشعارات اللحظية والبث المباشر وتطبيقا الجوال تُبقي الطالب وولي الأمر على اطلاع بالتقدم.",
    },
    sections: {
      en: [
        { title: "Backend", text: "A scalable Node.js and TypeScript backend with MySQL and TypeORM. Bunny.net provides secure, fast video hosting, and payment processing covers Stripe and custom installment plans." },
        { title: "Web dashboards", text: "Responsive dashboards in React and Tailwind CSS, with React Hook Form and Zod validating every form on the client." },
        { title: "Student and parent apps", text: "Two React Native apps. Students stream courses, take quizzes, submit assignments and chat with the teacher. Parents follow performance, attendance, quiz scores and installment status in real time." },
      ],
      ar: [
        { title: "الخادم", text: "خادم قابل للتوسع مبني بـNode.js وTypeScript مع MySQL وTypeORM. يوفر Bunny.net استضافة فيديو آمنة وسريعة، وتغطي المدفوعات Stripe وخطط أقساط مخصصة." },
        { title: "لوحات الويب", text: "لوحات تحكم متجاوبة مبنية بـReact وTailwind CSS، مع React Hook Form وZod للتحقق من كل نموذج." },
        { title: "تطبيقا الطالب وولي الأمر", text: "تطبيقان مبنيان بـReact Native. الطالب يشاهد الدورات ويحل الاختبارات ويسلّم الواجبات ويحادث المعلم. وولي الأمر يتابع الأداء والحضور ونتائج الاختبارات وحالة الأقساط لحظياً." },
      ],
    },
    tags: ["React", "React Native", "Node.js", "TypeORM", "MySQL", "Socket.io", "Stripe", "Bunny.net"],
    image: "solo-tutor-lms",
    video: true,
    url: "https://lms-course.alphaa-tech.com/login",
  },
  {
    slug: "zoom-lms",
    title: "Zoom LMS",
    category: { en: "Live learning", ar: "التعلّم المباشر" },
    summary: {
      en: "A live-teaching platform integrated with Zoom that archives every session automatically for instant replay.",
      ar: "منصة تعليم مباشر متكاملة مع Zoom تؤرشف كل حصة تلقائياً لإعادة المشاهدة فوراً.",
    },
    overview: {
      en: "Zoom LMS is built for live education. Instructors host real-time sessions through Zoom, and recordings are archived automatically to the Bunny.net CDN for replay. Flexible installment payments, question banks and multi-tier assessments are included, and parents follow attendance, progress and installment schedules from their own mobile app.",
      ar: "صُمم Zoom LMS للتعليم المباشر. يقدّم المعلمون حصصهم عبر Zoom، وتُؤرشف التسجيلات تلقائياً على شبكة Bunny.net لإعادة المشاهدة. يتضمن النظام مدفوعات مرنة بالأقساط وبنوك أسئلة وتقييمات متعددة المستويات، ويتابع أولياء الأمور الحضور والتقدم ومواعيد الأقساط من تطبيق خاص بهم.",
    },
    sections: {
      en: [
        { title: "Backend and live engine", text: "Node.js and TypeScript with MySQL and TypeORM. The Zoom API schedules and runs live classrooms, in sync with the Bunny.net Stream API for post-live processing and DRM protection. Stripe handles payments and installments, Socket.io handles messaging, and Firebase Cloud Messaging sends push notifications." },
        { title: "Teacher and admin dashboard", text: "A fast React and Tailwind CSS web app where teachers and admins manage live streams, build categorised question banks, configure quizzes by difficulty, grade assignments and oversee installment plans." },
        { title: "Mobile apps", text: "Two React Native apps. Students join live Zoom lectures, watch recordings, take timed quizzes and submit assignments. Parents track attendance, review results and pay upcoming installments." },
      ],
      ar: [
        { title: "الخادم ومحرك البث المباشر", text: "Node.js وTypeScript مع MySQL وTypeORM. واجهة Zoom API تجدول الحصص المباشرة وتديرها، بالتزامن مع Bunny.net Stream API لمعالجة التسجيلات وحمايتها بتقنية DRM. يتولى Stripe المدفوعات والأقساط، وSocket.io المراسلة، وFirebase Cloud Messaging الإشعارات." },
        { title: "لوحة المعلم والإدارة", text: "تطبيق ويب سريع بـReact وTailwind CSS يدير منه المعلمون والإدارة البث المباشر، ويبنون بنوك أسئلة مصنفة، ويضبطون الاختبارات حسب الصعوبة، ويصححون الواجبات، ويشرفون على خطط الأقساط." },
        { title: "تطبيقات الجوال", text: "تطبيقان مبنيان بـReact Native. الطلاب يحضرون محاضرات Zoom المباشرة ويشاهدون التسجيلات ويحلون اختبارات موقوتة ويسلّمون الواجبات. وأولياء الأمور يتابعون الحضور ويراجعون النتائج ويدفعون الأقساط القادمة." },
      ],
    },
    tags: ["React", "React Native", "Zoom API", "Bunny.net", "TypeORM", "MySQL", "Socket.io", "Stripe"],
    image: "zoom-lms",
    url: "https://lms-zoom.alphaa-tech.com",
  },
  {
    slug: "general-ai-learning-platform",
    title: "General AI Learning Platform",
    category: { en: "EdTech and AI", ar: "تقنيات التعليم والذكاء الاصطناعي" },
    summary: {
      en: "An AI study companion: students upload their material and get explanations, answers and generated quizzes, with group study chat.",
      ar: "رفيق دراسة بالذكاء الاصطناعي: يرفع الطالب مواده فيحصل على شرح وإجابات واختبارات مولّدة، مع محادثات دراسة جماعية.",
    },
    overview: {
      en: "An educational ecosystem with AI at its centre: a mobile app for students and a central admin dashboard. Students upload study material and textbooks, then get AI explanations, instant answers and automatically generated quizzes. The platform includes one-to-one and group study chat, admin management of national-curriculum textbooks for every grade, and push notifications.",
      ar: "منظومة تعليمية محورها الذكاء الاصطناعي: تطبيق جوال للطلاب ولوحة إدارة مركزية. يرفع الطالب مواده وكتبه الدراسية، ثم يحصل على شرح بالذكاء الاصطناعي وإجابات فورية واختبارات مولّدة تلقائياً. تتضمن المنصة محادثات دراسة فردية وجماعية، وإدارة لكتب المناهج الوطنية لجميع الصفوف، وإشعارات فورية.",
    },
    sections: {
      en: [
        { title: "AI engine and backend", text: "An event-driven backend on Node.js, TypeScript, MySQL and TypeORM. Large language models parse documents, generate quizzes and explain content in real time. Socket.io runs the study chat groups, and Firebase Cloud Messaging sends notifications to mobile and web." },
        { title: "Admin dashboard", text: "A central panel in React and Tailwind CSS where administrators organise and upload grade-specific textbooks and curricula, and oversee user activity and content distribution." },
        { title: "Student mobile app", text: "A cross-platform app for uploading documents, getting AI explanations, taking self-assessment quizzes and studying together in real-time chat rooms." },
      ],
      ar: [
        { title: "محرك الذكاء الاصطناعي والخادم", text: "خادم قائم على الأحداث مبني بـNode.js وTypeScript وMySQL وTypeORM. النماذج اللغوية الكبيرة تحلل المستندات وتولّد الاختبارات وتشرح المحتوى لحظياً. Socket.io يشغّل مجموعات المحادثة الدراسية، وFirebase Cloud Messaging يرسل الإشعارات للجوال والويب." },
        { title: "لوحة الإدارة", text: "لوحة مركزية بـReact وTailwind CSS ينظّم منها المسؤولون الكتب والمناهج لكل صف ويرفعونها، ويشرفون على نشاط المستخدمين وتوزيع المحتوى." },
        { title: "تطبيق الطالب", text: "تطبيق متعدد المنصات لرفع المستندات والحصول على شرح بالذكاء الاصطناعي وحل اختبارات التقييم الذاتي والدراسة الجماعية في غرف محادثة لحظية." },
      ],
    },
    tags: ["React Native", "React", "AI integration", "TypeORM", "MySQL", "Socket.io", "Firebase FCM"],
    image: "general-ai-learning-platform",
    video: true,
    url: "https://ilearn.alphaa-tech.com/",
  },
  {
    slug: "bidz-auction-platform",
    title: "Bidz",
    category: { en: "Online auctions", ar: "المزادات الإلكترونية" },
    summary: {
      en: "A secure online auction platform covering the full cycle: listing, verification, live bidding, wallet payments and QR-confirmed delivery.",
      ar: "منصة مزادات إلكترونية آمنة تغطي الدورة كاملة: العرض، التوثيق، المزايدة المباشرة، المحفظة، وتأكيد التسليم برمز QR.",
    },
    overview: {
      en: "Bidz connects customers, sellers and administrators in a structured, transparent bidding environment. It manages the whole auction lifecycle, from product listing and verification to bidding, payments, wallet transactions and secure delivery confirmation using QR codes.",
      ar: "تربط Bidz العملاء والبائعين والمسؤولين في بيئة مزايدة منظمة وشفافة. تدير دورة المزاد كاملة، من عرض المنتج وتوثيقه إلى المزايدة والمدفوعات وعمليات المحفظة وتأكيد التسليم الآمن برموز QR.",
    },
    sections: {
      en: [
        { title: "Backend and auction engine", text: "A scalable backend on Node.js and Express.js with MongoDB and REST APIs: authentication and authorisation, auction management, product verification, wallet operations and the business logic of the bidding lifecycle." },
        { title: "Real-time bidding", text: "Socket.IO pushes live auction updates, so every participant sees new bids and state changes the moment they happen." },
        { title: "Payments and wallet", text: "Stripe processes payments securely, and a wallet system manages balances, payments and transactions across the platform." },
        { title: "Verified delivery", text: "Product verification workflows and QR-based delivery confirmation make the handover between buyer and seller secure." },
      ],
      ar: [
        { title: "الخادم ومحرك المزادات", text: "خادم قابل للتوسع مبني بـNode.js وExpress.js مع MongoDB وواجهات REST: المصادقة والصلاحيات، إدارة المزادات، توثيق المنتجات، عمليات المحفظة، ومنطق دورة المزايدة." },
        { title: "مزايدة لحظية", text: "يبث Socket.IO تحديثات المزاد مباشرة، فيرى كل مشارك العروض الجديدة وتغيّر الحالة لحظة حدوثها." },
        { title: "المدفوعات والمحفظة", text: "يعالج Stripe المدفوعات بأمان، ونظام محفظة يدير الأرصدة والمدفوعات والعمليات على المنصة." },
        { title: "تسليم موثّق", text: "مسارات توثيق المنتجات وتأكيد التسليم برمز QR تجعل التسليم بين المشتري والبائع آمناً." },
      ],
    },
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Socket.io", "REST API", "Stripe"],
    image: "bidz-auction-platform",
    video: true,
    url: "https://bidz.horasguard.com",
  },
  {
    slug: "business-crm",
    title: "Business CRM",
    category: { en: "CRM and business management", ar: "إدارة العملاء والأعمال" },
    summary: {
      en: "A central CRM that runs administration, sales, HR, projects and finance, with role-based access for each department.",
      ar: "نظام CRM مركزي يدير الإدارة والمبيعات والموارد البشرية والمشاريع والمالية، بصلاحيات لكل قسم.",
    },
    overview: {
      en: "Business CRM streamlines operations across administration, sales, HR, projects and finance. It provides role-based access, department-specific workflows, central data management and interactive dashboards that improve visibility and coordination.",
      ar: "ينظّم Business CRM العمليات عبر الإدارة والمبيعات والموارد البشرية والمشاريع والمالية. يوفر صلاحيات حسب الدور، ومسارات عمل لكل قسم، وإدارة مركزية للبيانات، ولوحات تفاعلية تحسّن الرؤية والتنسيق.",
    },
    sections: {
      en: [
        { title: "Backend and business logic", text: "A modular NestJS backend that supports several departments and their workflows, with RESTful APIs, authentication and central data management across every CRM module." },
        { title: "Role-based access", text: "A permission system for admin, sales, HR, project management and finance teams, so each department reaches only the features and data it is responsible for." },
        { title: "Sales and customer management", text: "Workflows for customers, leads, sales activity and follow-ups give sales teams organised tools to track their pipeline." },
      ],
      ar: [
        { title: "الخادم ومنطق الأعمال", text: "خادم NestJS بمعمارية وحدات يدعم عدة أقسام ومسارات عملها، مع واجهات RESTful ومصادقة وإدارة مركزية للبيانات عبر كل وحدات النظام." },
        { title: "صلاحيات حسب الدور", text: "نظام صلاحيات لفرق الإدارة والمبيعات والموارد البشرية وإدارة المشاريع والمالية، فيصل كل قسم إلى ما يخصه فقط من خصائص وبيانات." },
        { title: "المبيعات وإدارة العملاء", text: "مسارات للعملاء والعملاء المحتملين ونشاط المبيعات والمتابعات تمنح فرق المبيعات أدوات منظمة لتتبع صفقاتها." },
      ],
    },
    tags: ["React", "NestJS", "TypeScript", "REST API", "Role-based access"],
    image: "business-crm",
    video: true,
    url: "https://crm.horasguard.com",
  },
  {
    slug: "horus",
    title: "Horus",
    category: { en: "Security and construction", ar: "الأمن والمقاولات" },
    summary: {
      en: "A platform for professional security services and reliable construction supply.",
      ar: "منصة لخدمات الأمن الاحترافية وتوريد مستلزمات البناء.",
    },
    overview: {
      en: "Horus presents professional security services for commercial facilities, industrial sites and infrastructure projects, alongside construction supply solutions that support every stage of a project.",
      ar: "تعرض Horus خدمات الأمن الاحترافية للمنشآت التجارية والمواقع الصناعية ومشاريع البنية التحتية، إلى جانب حلول توريد مستلزمات البناء التي تدعم كل مرحلة من المشروع.",
    },
    sections: { en: [], ar: [] },
    tags: [],
    image: "horus",
    url: "https://horasguard.com",
    live: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
