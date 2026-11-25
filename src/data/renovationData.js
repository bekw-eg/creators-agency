// 1. Тарифы и коэффициенты для калькулятора стоимости ремонта в Астане
export const RENOVATION_TYPES = [
  {
    id: 'cosmetic',
    name: 'Косметический ремонт',
    ratePerSqm: 45000,
    daysPerSqm: 0.45,
    description: 'Чистовая отделка стен и потолков, укладка ламината/кварцвинила, установка розеток и базовой сантехники.',
    includes: ['Шпатлёвка и покраска / обои', 'Натяжные потолки со светильниками', 'Укладка напольных покрытий и плинтусов'],
  },
  {
    id: 'capital',
    name: 'Капитальный под ключ',
    ratePerSqm: 82000,
    daysPerSqm: 0.85,
    description: 'Полная разводка электрики и сантехники Rehau, штукатурка по маякам, стяжка пола, укладка керамогранита.',
    includes: ['Замена всей инженерии и щитка Schneider', 'Геометрия стен 90° под лазерный уровень', 'Санузел под ключ с широкоформатным керамогранитом'],
  },
  {
    id: 'designer',
    name: 'Дизайнерский Premium',
    ratePerSqm: 128000,
    daysPerSqm: 1.25,
    description: 'Сложные инженерные решения: теневые профили Eurokraab, скрытые двери, система умного дома и премиум-материалы.',
    includes: ['Теневые плинтусы и трековое освещение', 'Шумоизоляция потолка и стояков ТехноСонус', 'Авторский надзор и комплектация мебелью'],
  },
];

// 2. Дополнительные опции калькулятора
export const RENOVATION_ADDONS = [
  {
    id: 'design-project',
    label: 'Полный 3D дизайн-проект с рабочими чертежами',
    pricePerSqm: 9500,
    fixedPrice: 0,
    extraDays: 14,
  },
  {
    id: 'rough-materials',
    label: 'Закупка и доставка черновых материалов (Knauf, Ceresit, Rehau)',
    pricePerSqm: 38000,
    fixedPrice: 0,
    extraDays: 0,
  },
  {
    id: 'smart-climate',
    label: 'Монтаж приточной вентиляции и кондиционирования',
    pricePerSqm: 0,
    fixedPrice: 480000,
    extraDays: 5,
  },
  {
    id: 'post-cleaning',
    label: 'Клининг после ремонта и вывоз строительного мусора',
    pricePerSqm: 1800,
    fixedPrice: 45000,
    extraDays: 2,
  },
];

// 3. Сцены для интерактивного слайдера «До / После»
export const BEFORE_AFTER_SCENES = [
  {
    id: 'scene-1',
    title: 'ЖК «Sezim Qala» (BI Group) — Кухня-гостиная 42 м²',
    duration: 'Срок реализации: 68 дней',
    budget: 'Бюджет работ и материалов: 6 450 000 ₸',
    beforeLabel: 'ДО: Черновая отделка от застройщика',
    afterLabel: 'ПОСЛЕ: Дизайнерский ремонт в стиле Soft Minimal',
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    afterImage: '/renovation-interior.jpg',
  },
  {
    id: 'scene-2',
    title: 'ЖК «Grand Turan» — Мастер-спальня и гардеробная 34 м²',
    duration: 'Срок реализации: 54 дня',
    budget: 'Бюджет работ и материалов: 4 920 000 ₸',
    beforeLabel: 'ДО: Бетонная коробка без перегородок',
    afterLabel: 'ПОСЛЕ: Чистовая отделка со стеновыми панелями и скрытым светом',
    beforeImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
  },
];

// 4. Реализованные объекты в ЖК Астаны
export const RENOVATION_PORTFOLIO = [
  {
    id: 'obj-1',
    complex: 'ЖК «Highvill Ishim»',
    type: 'Дизайнерский ремонт 3-комнатной квартиры',
    area: '112 м²',
    days: '95 дней',
    cost: '14 300 000 ₸',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    highlights: ['Скрытые двери Sofia 2.4м', 'Керамогранит Italon 120×60', 'Тёплый пол Devi в 3 зонах'],
  },
  {
    id: 'obj-2',
    complex: 'ЖК «Nura Esil»',
    type: 'Капитальный ремонт 2-комнатной квартиры',
    area: '68 м²',
    days: '58 дней',
    cost: '5 580 000 ₸',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    highlights: ['Шумоизоляция спальни', 'Коллекторная разводка воды', 'Покраска стен Tikkurila'],
  },
  {
    id: 'obj-3',
    complex: 'ЖК «GreenLine.Flora»',
    type: 'Семейная квартира с 2 санузлами',
    area: '94 м²',
    days: '79 дней',
    cost: '8 900 000 ₸',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    highlights: ['Инженерная доска дуб', 'Теневой профиль Eurokraab', 'Система защиты от протечек Neptun'],
  },
];

// 5. Этапы работы компании
export const RENOVATION_STEPS = [
  {
    step: '01',
    title: 'Бесплатный лазерный замер и смета',
    desc: 'Инженер приезжает на объект в Астане с лазерным нивелиром, проверяет геометрию стен и составляет фиксированную смету за 24 часа.',
  },
  {
    step: '02',
    title: 'Договор с фиксированной ценой',
    desc: 'Прописываем итоговую сумму в тенге и график поэтапной сдачи. Цена не вырастет в процессе ремонта ни на один тенге.',
  },
  {
    step: '03',
    title: 'Закупка материалов и черновой этап',
    desc: 'Сами доставляем и поднимаем материалы со склада по оптовым ценам. Возводим перегородки, разводим электрику и сантехнику.',
  },
  {
    step: '04',
    title: 'Чистовая отделка и технадзор',
    desc: '3-ступенчатая проверка качества главным инженером. Еженедельный фото- и видеоотчёт в WhatsApp/Telegram.',
  },
  {
    step: '05',
    title: 'Клининг, приёмка по чек-листу и гарантия 3 года',
    desc: 'Вы въезжаете в идеально чистую квартиру. Оплата каждого этапа — только после подписания акта выполненных работ.',
  },
];
