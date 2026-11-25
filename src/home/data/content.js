import { DEVELOPER_INFO, SHOWCASE_PROJECTS } from '../../data/projectsData';

// Единый источник контента главной страницы Creators Digital.
// Цифры в STATS — плейсхолдеры: замените на реальные показатели агентства.

export const BRAND = {
  name: 'Creators Digital',
  short: 'Creators',
  domain: 'creators-digital.work',
  tagline: 'От идеи до цифрового результата',
  city: 'Астана, Казахстан',
  timeZone: 'Asia/Almaty',
};

export const CONTACTS = [
  { label: 'Telegram', value: DEVELOPER_INFO.telegramHandle, href: DEVELOPER_INFO.telegramUrl },
  { label: 'WhatsApp', value: DEVELOPER_INFO.phone, href: DEVELOPER_INFO.whatsappUrl },
  { label: 'Instagram', value: `@${DEVELOPER_INFO.instagramHandle}`, href: DEVELOPER_INFO.instagramUrl },
];

export const NAV = [
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакты', href: '#contact' },
];

export const MARQUEE = [
  'Веб-разработка',
  'UI/UX дизайн',
  'Брендинг',
  'E-commerce',
  'Motion & 3D',
  'Telegram-боты',
  'CRM-интеграции',
  'SEO & Performance',
];

export const SERVICES = [
  {
    id: 'web',
    index: '01',
    title: 'Веб-разработка',
    desc: 'Сайты и веб-сервисы на React: от промо-лендинга до личного кабинета. Быстрые, адаптивные и готовые к росту нагрузки.',
    tags: ['React', 'Node.js', 'Headless CMS'],
    preview: 'browser',
    className: 'md:col-span-2 lg:col-span-4 lg:row-span-2',
  },
  {
    id: 'design',
    index: '02',
    title: 'UI/UX дизайн',
    desc: 'Прототипы, дизайн-системы и интерфейсы, которые ведут пользователя к целевому действию.',
    tags: ['Figma', 'Design System'],
    preview: 'layers',
    className: 'lg:col-span-2',
  },
  {
    id: 'brand',
    index: '03',
    title: 'Брендинг',
    desc: 'Айдентика, логотип и визуальный язык, который выделяет вас среди конкурентов.',
    tags: ['Identity', 'Guidelines'],
    preview: 'type',
    className: 'lg:col-span-2',
  },
  {
    id: 'commerce',
    index: '04',
    title: 'E-commerce',
    desc: 'Каталоги, корзины, оплата и доставка — магазины, которые продают 24/7.',
    tags: ['Каталог', 'Оплата'],
    preview: 'cards',
    className: 'lg:col-span-2',
  },
  {
    id: 'bots',
    index: '05',
    title: 'Боты и CRM',
    desc: 'Заявки и заказы мгновенно летят в Telegram, WhatsApp или вашу CRM.',
    tags: ['Telegram API', 'amoCRM'],
    preview: 'chat',
    className: 'lg:col-span-2',
  },
  {
    id: 'motion',
    index: '06',
    title: 'Motion & 3D',
    desc: 'Анимации, WebGL и 3D-сцены, создающие вау-эффект без потери скорости.',
    tags: ['GSAP', 'Three.js'],
    preview: 'shape',
    className: 'lg:col-span-2',
  },
];

const CASE_TAGS = {
  barbershop: ['UX/UI', 'Онлайн-запись', 'React'],
  restaurant: ['HoReCa', 'Меню', 'Бронирование'],
  coffee: ['Конструктор', 'Предзаказ', 'Mobile-first'],
  renovation: ['Калькулятор', 'До / После', 'Лидогенерация'],
  lighting: ['E-commerce', 'Каталог', 'Корзина'],
};

export const CASES = SHOWCASE_PROJECTS.map((p) => ({
  id: p.id,
  code: p.code,
  title: p.brandName,
  niche: p.niche,
  category: p.badgeText,
  desc: p.shortDesc,
  image: p.image,
  path: p.path,
  accent: p.accentColor,
  tags: CASE_TAGS[p.id] ?? [],
}));

export const STEPS = [
  {
    index: '01',
    title: 'Погружение',
    duration: '2–4 дня',
    desc: 'Изучаем бизнес, аудиторию и конкурентов. Формулируем цели, KPI и техническое задание.',
    deliverables: ['Бриф', 'Аналитика', 'Roadmap'],
  },
  {
    index: '02',
    title: 'Прототип и дизайн',
    duration: '1–2 недели',
    desc: 'Проектируем структуру и пользовательские сценарии, затем создаём визуальную концепцию и дизайн-систему.',
    deliverables: ['Wireframes', 'UI-kit', 'Motion-концепт'],
  },
  {
    index: '03',
    title: 'Разработка',
    duration: '2–4 недели',
    desc: 'Собираем быстрый, адаптивный продукт, подключаем интеграции, CMS и аналитику. Показываем прогресс каждую неделю.',
    deliverables: ['Frontend', 'Backend', 'Интеграции'],
  },
  {
    index: '04',
    title: 'Запуск и рост',
    duration: 'Постоянно',
    desc: 'Тестируем, публикуем и сопровождаем. Анализируем метрики и улучшаем конверсию на основе данных.',
    deliverables: ['QA', 'Релиз', 'Поддержка'],
  },
];

export const FORM_SERVICES = [
  'Сайт / лендинг',
  'Интернет-магазин',
  'UI/UX дизайн',
  'Брендинг',
  'Бот / CRM',
  'Другое',
];

export const BUDGETS = ['до 500 тыс ₸', '500 тыс – 1,5 млн ₸', '1,5 – 3 млн ₸', 'от 3 млн ₸'];
