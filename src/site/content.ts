import type { Language } from '../i18n'
import { useI18n } from '../i18n/provider'

export interface HeroSlide {
  title: string
  body: string
}

export interface SiteCopy {
  brand: {
    name: string
    mark: string
    role: string
  }
  nav: {
    about: string
    projects: string
    impact: string
    stack: string
    journey: string
    faq: string
    contact: string
  }
  ui: {
    skip: string
    menu: string
    close: string
    language: string
    talk: string
    viewWork: string
    scroll: string
    drag: string
    previous: string
    next: string
    backToTop: string
    pause: string
    play: string
    available: string
    emailCopied: string
  }
  hero: {
    eyebrow: string
    slides: readonly HeroSlide[]
    marquee: string
    primary: string
    secondary: string
  }
  updates: {
    label: string
    heading: string
    em: string
    sub: string
    kicker: string
    items: readonly { projectId: string; tag: string; date: string }[]
  }
  about: {
    label: string
    heading: string
    em: string
    sub: string
    values: readonly { title: string; body: string }[]
  }
  projects: {
    label: string
    heading: string
    em: string
    sub: string
    cards: string
    table: string
    all: string
    readCase: string
    status: { live: string; mvp: string }
    columns: {
      project: string
      year: string
      field: string
      stack: string
      status: string
      open: string
    }
  }
  categories: Record<'ai-cv' | 'security' | 'autonomous' | 'web', string>
  impact: {
    label: string
    heading: string
    em: string
    sub: string
    stats: readonly { prefix: string; value: number; suffix: string; decimals: number; label: string }[]
  }
  stack: {
    label: string
    heading: string
    em: string
    sub: string
    note: string
  }
  journey: {
    label: string
    heading: string
    em: string
    sub: string
  }
  faq: {
    label: string
    heading: string
    em: string
    sub: string
    cta: string
    items: readonly { q: string; a: string }[]
  }
  contact: {
    label: string
    heading: string
    em: string
    sub: string
    infoTitle: string
    emailLabel: string
    telegramLabel: string
    locationLabel: string
    availabilityLabel: string
    availabilityValue: string
    form: {
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      message: string
      messagePlaceholder: string
      note: string
      noteFallback: string
      submit: string
      sending: string
      sent: string
      sentMailto: string
      error: string
      failed: string
      required: string
    }
  }
  footer: {
    blurb: string
    cta: string
    sections: string
    more: string
    contacts: string
    rights: string
    note: string
  }
  modal: {
    label: string
    overview: string
    challenge: string
    solution: string
    result: string
    stack: string
    links: string
    close: string
    github: string
    demo: string
  }
}

const ru: SiteCopy = {
  brand: {
    name: 'ISLOMBEK',
    mark: 'I/M',
    role: 'AI ENGINEER · SOFTWARE · SECURITY',
  },
  nav: {
    about: 'Обо мне',
    projects: 'Проекты',
    impact: 'Результат',
    stack: 'Стек',
    journey: 'Путь',
    faq: 'Вопросы',
    contact: 'Контакты',
  },
  ui: {
    skip: 'Перейти к содержимому',
    menu: 'Меню',
    close: 'Закрыть',
    language: 'Язык',
    talk: 'Связаться',
    viewWork: 'Смотреть проекты',
    scroll: 'Листайте вниз',
    drag: 'Тяните в сторону',
    previous: 'Назад',
    next: 'Вперёд',
    backToTop: 'Наверх',
    pause: 'Пауза',
    play: 'Продолжить',
    available: 'Открыт к проектам',
    emailCopied: 'Email скопирован',
  },
  hero: {
    eyebrow: 'AI-инженер · Узбекистан',
    slides: [
      {
        title: 'Искусственный интеллект, приносящий результат',
        body:
          'Проектирую и создаю AI-системы — от компьютерного зрения и антифрода до автономных агентов и интерфейсов. Измеряю результат работающим прототипом, а не обещаниями.',
      },
      {
        title: 'От исследования до MVP без компромиссов',
        body:
          'Полный цикл: исследование, архитектура, обучение моделей, интерфейс и запуск. Каждый проект — это система, которую можно проверить, измерить и сопровождать.',
      },
      {
        title: 'Компьютерное зрение в реальном мире',
        body:
          'Детекция огня с дрона, навигация для незрячих, мониторинг трафика и городской инфраструктуры — модели, которые работают на edge-устройствах.',
      },
      {
        title: 'Безопасность, которую можно доказать',
        body:
          'Антифрод-пайплайны, threat intelligence, защищённые экзаменационные платформы и reverse engineering — от гипотезы до устойчивого контура.',
      },
      {
        title: 'Открыт к сложным задачам',
        body:
          'Ищу команды и исследования, где AI меняет реальные процессы. Если задача кажется невыполнимой — это хороший повод начать.',
      },
    ],
    marquee: 'ISLOMBEK',
    primary: 'Смотреть проекты',
    secondary: 'Обсудить задачу',
  },
  updates: {
    label: 'Избранное',
    heading: 'Кейсы и',
    em: 'исследования',
    sub: 'Несколько систем из портфеля — от автономных дронов до threat intelligence. Каждый кейс можно открыть и изучить целиком.',
    kicker: 'Кейс',
    items: [
      { projectId: 'agrovet-ai', tag: 'Veterinary AI', date: '2026' },
      { projectId: 'sputnik-ai', tag: 'Digital Twin', date: '2026' },
      { projectId: 'passive-agent', tag: 'Threat Intel', date: '2026' },
      { projectId: 'med-vision', tag: 'Edge AI', date: '2026' },
      { projectId: 'exam-guard', tag: 'Security', date: '2026' },
    ],
  },
  about: {
    label: 'Обо мне',
    heading: 'AI, который работает в',
    em: 'реальных процессах',
    sub:
      'Я Исломбек Мукимов — AI-инженер и разработчик. Соединяю исследования, инженерию и безопасность, чтобы превращать сложные идеи в продукты, которые выдерживают нагрузку и проверку.',
    values: [
      {
        title: 'Продукт, а не демо',
        body: 'Довожу систему до состояния, в котором её можно запускать, измерять и поддерживать.',
      },
      {
        title: 'Полный цикл',
        body: 'Исследование, данные, модель, бэкенд, интерфейс и деплой — в одной ответственности.',
      },
      {
        title: 'Измеримый результат',
        body: 'Каждое решение оцениваю по метрикам: скорость, точность, стоимость и влияние на процесс.',
      },
      {
        title: 'Безопасность по умолчанию',
        body: 'Проектирую с учётом угроз, приватности и устойчивости к реальным сценариям отказа.',
      },
    ],
  },
  projects: {
    label: 'Проекты',
    heading: 'Проекты: от MVP',
    em: 'до живого продукта',
    sub:
      'Кейсы из портфеля: компьютерное зрение, автономные системы, кибербезопасность и веб-платформы. AgroVet AI уже работает в продакшене, остальные проекты исследованы и доведены до MVP — переключайтесь между карточками и таблицей.',
    cards: 'Карточки',
    table: 'Таблица',
    all: 'Все проекты',
    readCase: 'Читать кейс',
    status: { live: 'LIVE · в продакшене', mvp: 'MVP · исследование' },
    columns: {
      project: 'Проект',
      year: 'Год',
      field: 'Направление',
      stack: 'Стек',
      status: 'Статус',
      open: 'Открыть',
    },
  },
  categories: {
    'ai-cv': 'Компьютерное зрение',
    security: 'Кибербезопасность',
    autonomous: 'Автономные системы',
    web: 'Веб-платформа',
  },
  impact: {
    label: 'Результат',
    heading: 'Цифры, которые',
    em: 'говорят сами за себя',
    sub:
      'Метрики из исследований и MVP — не расчётные обещания. Детекция, скорость, точность и масштаб проверенных прототипов.',
    stats: [
      { prefix: '', value: 20, suffix: '+', decimals: 0, label: 'проектов в портфеле' },
      { prefix: '', value: 50, suffix: 'K+', decimals: 0, label: 'угроз проанализировано' },
      { prefix: '', value: 98.7, suffix: '%', decimals: 1, label: 'точность детекции скама' },
      { prefix: '<', value: 16, suffix: 'ms', decimals: 0, label: 'бюджет кадра в 3D-системах' },
    ],
  },
  stack: {
    label: 'Стек',
    heading: 'Инструменты, на которых',
    em: 'строятся системы',
    sub: 'Не список ради списка — технологии, которые я использую каждый день и выбираю под задачу, а не под моду.',
    note: 'Тяните карточки или используйте стрелки',
  },
  journey: {
    label: 'Путь',
    heading: 'От первых строк',
    em: 'к системам',
    sub: 'Короткая хронология: как веб-основа превратилась в AI-инженерию, безопасность и автономные продукты.',
  },
  faq: {
    label: 'Вопросы',
    heading: 'Ответы на',
    em: 'частые вопросы',
    sub: 'Коротко о формате работы, сроках и том, как устроены кейсы в портфеле.',
    cta: 'Остались вопросы? Напишите',
    items: [
      {
        q: 'С какими задачами ко мне можно прийти?',
        a: 'AI/ML и компьютерное зрение, антифрод, автономные и edge-системы, веб-платформы с AI внутри — если задача на стыке дисциплин, это мой профиль.',
      },
      {
        q: 'Как строится работа над проектом?',
        a: 'Сначала разбираем задачу и метрику успеха, затем проектируем архитектуру и собираем прототип. После проверки на реальных данных доводим до MVP и сопровождаем.',
      },
      {
        q: 'Сколько стоит проект?',
        a: 'Стоимость зависит от объёма, данных и требований к безопасности. После короткого брифа даю оценку по этапам и фиксирую результат, который должен быть достигнут.',
      },
      {
        q: 'Работаете ли вы с существующим кодом?',
        a: 'Да. Провожу аудит, выделяю узкие места, обновляю архитектуру и постепенно перевожу систему на устойчивый контур без остановки продукта.',
      },
    ],
  },
  contact: {
    label: 'Сотрудничество',
    heading: 'Давайте создадим',
    em: 'измеримый результат.',
    sub:
      'Расскажите о задаче: данные, ограничения, желаемая метрика. Отвечу в течение одного-двух рабочих дней и предложу следующий шаг.',
    infoTitle: 'Контакты',
    emailLabel: 'Email',
    telegramLabel: 'Telegram',
    locationLabel: 'Локация',
    availabilityLabel: 'Статус',
    availabilityValue: 'Открыт к проектам и исследованиям',
    form: {
      name: 'Имя',
      namePlaceholder: 'Ваше имя',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      message: 'Задача',
      messagePlaceholder: 'Кратко опишите задачу, данные и желаемый результат',
      note: 'Отправляется напрямую на мою почту. Личные данные не передаются третьим лицам.',
      noteFallback: 'Откроется ваш почтовый клиент — сообщение нужно будет отправить вручную.',
      submit: 'Отправить',
      sending: 'Отправляю…',
      sent: 'Сообщение отправлено',
      sentMailto: 'Письмо готово — отправьте его из почтового клиента',
      error: 'Заполните имя, email и описание задачи',
      failed: 'Не удалось отправить. Попробуйте ещё раз или напишите на почту.',
      required: 'обязательно',
    },
  },
  footer: {
    blurb: 'Проектирую AI-системы для реальных задач: компьютерное зрение, безопасность, автономные устройства и интерфейсы — от исследования до MVP.',
    cta: 'Связаться',
    sections: 'Разделы',
    more: 'Ещё',
    contacts: 'Контакты',
    rights: 'Все права защищены.',
    note: 'Только публичная информация. Персональные и чувствительные данные не отображаются.',
  },
  modal: {
    label: 'Кейс',
    overview: 'Обзор',
    challenge: 'Задача',
    solution: 'Решение',
    result: 'Результат',
    stack: 'Технологии',
    links: 'Ссылки',
    close: 'Закрыть кейс',
    github: 'GitHub',
    demo: 'Демо',
  },
}

const en: SiteCopy = {
  brand: {
    name: 'ISLOMBEK',
    mark: 'I/M',
    role: 'AI ENGINEER · SOFTWARE · SECURITY',
  },
  nav: {
    about: 'About',
    projects: 'Projects',
    impact: 'Impact',
    stack: 'Stack',
    journey: 'Journey',
    faq: 'FAQ',
    contact: 'Contact',
  },
  ui: {
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    talk: 'Get in touch',
    viewWork: 'View projects',
    scroll: 'Scroll to explore',
    drag: 'Drag sideways',
    previous: 'Previous',
    next: 'Next',
    backToTop: 'Back to top',
    pause: 'Pause',
    play: 'Play',
    available: 'Open for projects',
    emailCopied: 'Email copied',
  },
  hero: {
    eyebrow: 'AI engineer · Uzbekistan',
    slides: [
      {
        title: 'Artificial intelligence that delivers results',
        body:
          'I design and build AI systems — from computer vision and anti-fraud to autonomous agents and interfaces. I measure success by working prototypes, not promises.',
      },
      {
        title: 'From research to MVP, without compromise',
        body:
          'End to end: research, architecture, model training, interface and launch. Every project is a system you can inspect, measure and maintain.',
      },
      {
        title: 'Computer vision in the real world',
        body:
          'Drone fire detection, navigation for the blind, traffic and urban infrastructure monitoring — models that run on edge devices.',
      },
      {
        title: 'Security you can prove',
        body:
          'Anti-fraud pipelines, threat intelligence, hardened examination platforms and reverse engineering — from hypothesis to a resilient perimeter.',
      },
      {
        title: 'Open to hard problems',
        body:
          'Looking for teams and research where AI changes real processes. If a problem feels impossible, that is a good reason to start.',
      },
    ],
    marquee: 'ISLOMBEK',
    primary: 'View projects',
    secondary: 'Discuss a problem',
  },
  updates: {
    label: 'Selected work',
    heading: 'Cases and',
    em: 'research',
    sub: 'A few systems from the portfolio — from autonomous drones to threat intelligence. Open any case and explore it end to end.',
    kicker: 'Case',
    items: [
      { projectId: 'agrovet-ai', tag: 'Veterinary AI', date: '2026' },
      { projectId: 'sputnik-ai', tag: 'Digital Twin', date: '2026' },
      { projectId: 'passive-agent', tag: 'Threat Intel', date: '2026' },
      { projectId: 'med-vision', tag: 'Edge AI', date: '2026' },
      { projectId: 'exam-guard', tag: 'Security', date: '2026' },
    ],
  },
  about: {
    label: 'About',
    heading: 'AI that works in',
    em: 'real processes',
    sub:
      'I am Islombek Muqimov, an AI engineer and developer. I connect research, engineering and security to turn complex ideas into products that hold up under load and scrutiny.',
    values: [
      {
        title: 'A product, not a demo',
        body: 'I take a system to the point where it can be launched, measured and maintained.',
      },
      {
        title: 'End to end',
        body: 'Research, data, model, backend, interface and deployment — one owner, one line of responsibility.',
      },
      {
        title: 'Measurable results',
        body: 'Every decision is judged by metrics: speed, accuracy, cost and impact on the actual process.',
      },
      {
        title: 'Secure by default',
        body: 'Designed around threats, privacy and resilience to realistic failure scenarios.',
      },
    ],
  },
  projects: {
    label: 'Projects',
    heading: 'Projects from MVP',
    em: 'to a live product',
    sub:
      'Cases from the portfolio: computer vision, autonomous systems, cybersecurity and web platforms. AgroVet AI is live in production; the rest are researched and taken to a working MVP — switch between cards and the full table.',
    cards: 'Cards',
    table: 'Table',
    all: 'All projects',
    readCase: 'Read case',
    status: { live: 'LIVE · in production', mvp: 'MVP · research' },
    columns: {
      project: 'Project',
      year: 'Year',
      field: 'Field',
      stack: 'Stack',
      status: 'Status',
      open: 'Open',
    },
  },
  categories: {
    'ai-cv': 'Computer vision',
    security: 'Cybersecurity',
    autonomous: 'Autonomous systems',
    web: 'Web platform',
  },
  impact: {
    label: 'Impact',
    heading: 'Numbers that',
    em: 'speak for themselves',
    sub:
      'Metrics from research and MVPs, not theoretical promises. Detection, speed, accuracy and the scale of validated prototypes.',
    stats: [
      { prefix: '', value: 20, suffix: '+', decimals: 0, label: 'projects in the portfolio' },
      { prefix: '', value: 50, suffix: 'K+', decimals: 0, label: 'threats analysed' },
      { prefix: '', value: 98.7, suffix: '%', decimals: 1, label: 'scam detection accuracy' },
      { prefix: '<', value: 16, suffix: 'ms', decimals: 0, label: 'frame budget in 3D systems' },
    ],
  },
  stack: {
    label: 'Stack',
    heading: 'Tools that',
    em: 'build systems',
    sub: 'Not a list for the sake of a list — the technologies I use daily and choose for the problem, not for fashion.',
    note: 'Drag the cards or use the arrows',
  },
  journey: {
    label: 'Journey',
    heading: 'From first lines',
    em: 'to systems',
    sub: 'A short timeline: how a web foundation grew into AI engineering, security and autonomous products.',
  },
  faq: {
    label: 'FAQ',
    heading: 'Answers to',
    em: 'common questions',
    sub: 'A quick overview of how I work, timelines and what you will find inside the case studies.',
    cta: 'Still have questions? Write to me',
    items: [
      {
        q: 'What kind of work can I bring you?',
        a: 'AI/ML and computer vision, anti-fraud, autonomous and edge systems, web platforms with AI inside — if a problem spans several disciplines, that is my profile.',
      },
      {
        q: 'How does a project unfold?',
        a: 'We start with the problem and the success metric, then design the architecture and build a prototype. After validation on real data we take it to MVP and ongoing support.',
      },
      {
        q: 'How much does a project cost?',
        a: 'Cost depends on scope, data and security requirements. After a short brief I provide a staged estimate and define the result that must be achieved.',
      },
      {
        q: 'Do you work with existing codebases?',
        a: 'Yes. I audit the system, find bottlenecks, update the architecture and move it to a resilient setup without stopping the product.',
      },
    ],
  },
  contact: {
    label: 'Collaboration',
    heading: 'Let us build',
    em: 'measurable results.',
    sub:
      'Tell me about the task: data, constraints, the metric you care about. I will reply within one or two business days with the next step.',
    infoTitle: 'Contacts',
    emailLabel: 'Email',
    telegramLabel: 'Telegram',
    locationLabel: 'Location',
    availabilityLabel: 'Status',
    availabilityValue: 'Open to projects and research',
    form: {
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      message: 'The task',
      messagePlaceholder: 'Briefly describe the problem, data and desired outcome',
      note: 'Sent straight to my inbox. No personal data is shared with third parties.',
      noteFallback: 'Your email client will open — send the message from there.',
      submit: 'Send',
      sending: 'Sending…',
      sent: 'Message sent',
      sentMailto: 'Your email is ready — send it from your email client',
      error: 'Please fill in your name, email and the task',
      failed: 'Could not send the message. Try again or email me directly.',
      required: 'required',
    },
  },
  footer: {
    blurb: 'I design and support AI systems that improve real processes: computer vision, security, autonomous devices and interfaces — from research to MVP.',
    cta: 'Get in touch',
    sections: 'Sections',
    more: 'More',
    contacts: 'Contacts',
    rights: 'All rights reserved.',
    note: 'Public information only. Personal and sensitive data is never displayed.',
  },
  modal: {
    label: 'Case study',
    overview: 'Overview',
    challenge: 'Challenge',
    solution: 'Solution',
    result: 'Result',
    stack: 'Technology',
    links: 'Links',
    close: 'Close case',
    github: 'GitHub',
    demo: 'Demo',
  },
}

const uz: SiteCopy = {
  brand: {
    name: 'ISLOMBEK',
    mark: 'I/M',
    role: 'AI ENGINEER · SOFTWARE · SECURITY',
  },
  nav: {
    about: 'Men haqimda',
    projects: 'Loyihalar',
    impact: 'Natija',
    stack: 'Stek',
    journey: "Yo'l",
    faq: 'Savollar',
    contact: 'Aloqa',
  },
  ui: {
    skip: 'Asosiy mazmunga o‘tish',
    menu: 'Menyu',
    close: 'Yopish',
    language: 'Til',
    talk: "Bog'lanish",
    viewWork: 'Loyihalarni ko‘rish',
    scroll: 'Pastga suring',
    drag: 'Yon tomonga torting',
    previous: 'Orqaga',
    next: 'Oldinga',
    backToTop: 'Yuqoriga',
    pause: 'To‘xtatish',
    play: 'Davom etish',
    available: 'Loyihalarga ochiq',
    emailCopied: 'Email nusxalandi',
  },
  hero: {
    eyebrow: 'AI muhandis · O‘zbekiston',
    slides: [
      {
        title: 'Natija beradigan sun’iy intellekt',
        body:
          'Kompyuter ko‘rishidan antifrod va avtonom agentlargacha — AI tizimlarini loyihalayman va ishga tushiraman. Natijani va’da bilan emas, ishlayotgan prototip bilan o‘lchayman.',
      },
      {
        title: 'G‘oyadan MVPgacha, murosasiz',
        body:
          'To‘liq sikl: tadqiqot, arxitektura, model o‘qitish, interfeys va ishga tushirish. Har bir loyiha tekshirish, o‘lchash va qo‘llab-quvvatlash mumkin bo‘lgan tizim.',
      },
      {
        title: 'Kompyuter ko‘rish — real dunyoda',
        body:
          'Dron bilan yong‘in aniqlash, ko‘zi ojizlar uchun navigatsiya, transport va shahar infratuzilmasini kuzatish — edge qurilmalarda ishlaydigan modellar.',
      },
      {
        title: 'Isbotlash mumkin bo‘lgan xavfsizlik',
        body:
          'Antifrod quvurlari, threat intelligence, himoyalangan imtihon platformalari va reverse engineering — gipotezadan barqaror konturgacha.',
      },
      {
        title: 'Murakkab vazifalarga ochiqman',
        body:
          'AI real jarayonlarni o‘zgartiradigan jamoalar va tadqiqotlarni qidiryapman. Agar vazifa imkonsiz tuyulsa — bu boshlash uchun yaxshi sabab.',
      },
    ],
    marquee: 'ISLOMBEK',
    primary: 'Loyihalarni ko‘rish',
    secondary: 'Vazifani muhokama qilish',
  },
  updates: {
    label: 'Tanlangan ishlar',
    heading: 'Keyslar va',
    em: 'tadqiqotlar',
    sub: 'Portfeldan bir nechta tizim — avtonom dronlardan threat intelligencegacha. Har bir keysni ochib, to‘liq o‘rganish mumkin.',
    kicker: 'Keys',
    items: [
      { projectId: 'agrovet-ai', tag: 'Veterinariya AI', date: '2026' },
      { projectId: 'sputnik-ai', tag: 'Digital Twin', date: '2026' },
      { projectId: 'passive-agent', tag: 'Threat Intel', date: '2026' },
      { projectId: 'med-vision', tag: 'Edge AI', date: '2026' },
      { projectId: 'exam-guard', tag: 'Security', date: '2026' },
    ],
  },
  about: {
    label: 'Men haqimda',
    heading: 'Haqiqiy jarayonlarda ishlaydigan',
    em: 'AI',
    sub:
      'Men Islombek Muqimov — AI muhandisi va dasturchiman. Murakkab g‘oyalarni yuklamaga va tekshiruvga chidaydigan mahsulotga aylantirish uchun tadqiqot, injiniring va xavfsizlikni birlashtiraman.',
    values: [
      {
        title: 'Demo emas, mahsulot',
        body: 'Tizimni ishga tushirish, o‘lchash va qo‘llab-quvvatlash mumkin bo‘lgan holatga yetkazaman.',
      },
      {
        title: 'To‘liq sikl',
        body: 'Tadqiqot, ma’lumot, model, backend, interfeys va deploy — bitta mas’uliyatda.',
      },
      {
        title: 'O‘lchanadigan natija',
        body: 'Har bir yechimni tezlik, aniqlik, xarajat va jarayonga ta’sir bo‘yicha baholayman.',
      },
      {
        title: 'Standart bo‘yicha xavfsizlik',
        body: 'Tahdidlar, maxfiylik va real nosozlik stsenariylariga chidamlilikni hisobga olib loyihalayman.',
      },
    ],
  },
  projects: {
    label: 'Loyihalar',
    heading: 'MVPdan',
    em: 'jonli mahsulotgacha',
    sub:
      'Portfeldagi keyslar: kompyuter ko‘rishi, avtonom tizimlar, kiberxavfsizlik va veb-platformalar. AgroVet AI allaqachon ishlab chiqarishda, qolgan loyihalar tadqiq qilingan va MVP darajasiga yetkazilgan — kartalar va jadval o‘rtasida almashib ko‘ring.',
    cards: 'Kartalar',
    table: 'Jadval',
    all: 'Barcha loyihalar',
    readCase: 'Keysni o‘qish',
    status: { live: 'LIVE · ishlab chiqarishda', mvp: 'MVP · tadqiqot' },
    columns: {
      project: 'Loyiha',
      year: 'Yil',
      field: "Yo'nalish",
      stack: 'Stek',
      status: 'Holat',
      open: 'Ochish',
    },
  },
  categories: {
    'ai-cv': 'Kompyuter ko‘rishi',
    security: 'Kiberxavfsizlik',
    autonomous: 'Avtonom tizimlar',
    web: 'Veb-platforma',
  },
  impact: {
    label: 'Natija',
    heading: 'O‘zi uchun',
    em: 'gapiradigan raqamlar',
    sub:
      'Tadqiqot va MVPlardan olingan ko‘rsatkichlar — nazariy va’dalar emas. Tekshirilgan prototiplarning aniqlik, tezlik va ko‘lami.',
    stats: [
      { prefix: '', value: 20, suffix: '+', decimals: 0, label: 'portfeldagi loyihalar' },
      { prefix: '', value: 50, suffix: 'K+', decimals: 0, label: 'tahlil qilingan tahdidlar' },
      { prefix: '', value: 98.7, suffix: '%', decimals: 1, label: 'skam aniqlash aniqligi' },
      { prefix: '<', value: 16, suffix: 'ms', decimals: 0, label: '3D tizimlarda kadr byudjeti' },
    ],
  },
  stack: {
    label: 'Stek',
    heading: 'Tizimlar',
    em: 'quriladigan vositalar',
    sub: 'Ro‘yxat uchun ro‘yxat emas — har kuni ishlatadigan va moda uchun emas, vazifa uchun tanlaydigan texnologiyalar.',
    note: 'Kartalarni torting yoki o‘qlardan foydalaning',
  },
  journey: {
    label: "Yo'l",
    heading: 'Birinchi satrlardan',
    em: 'tizimlargacha',
    sub: 'Qisqa xronologiya: veb-asos qanday qilib AI injiniringi, xavfsizlik va avtonom mahsulotlarga aylandi.',
  },
  faq: {
    label: 'Savollar',
    heading: 'Ko‘p beriladigan',
    em: 'savollarga javoblar',
    sub: 'Ish formati, muddatlar va portfeldagi keyslar qanday tuzilgani haqida qisqacha.',
    cta: 'Savollar qoldimi? Yozing',
    items: [
      {
        q: 'Qanday vazifalar bilan murojaat qilish mumkin?',
        a: 'AI/ML va kompyuter ko‘rishi, antifrod, avtonom va edge tizimlar, AI ichidagi veb-platformalar — vazifa bir nechta sohani birlashtirsa, bu aynan mening profilim.',
      },
      {
        q: 'Loyiha ustida ish qanday quriladi?',
        a: 'Avval vazifa va muvaffaqiyat ko‘rsatkichini aniqlaymiz, keyin arxitektura loyihalanadi va prototip yig‘iladi. Real ma’lumotlarda tekshirgandan so‘ng MVP darajasiga yetkazamiz va qo‘llab-quvvatlaymiz.',
      },
      {
        q: 'Loyiha qancha turadi?',
        a: 'Narx ko‘lam, ma’lumot va xavfsizlik talablariga bog‘liq. Qisqa brifdan so‘ng bosqichlar bo‘yicha baho beraman va erishilishi kerak bo‘lgan natijani belgilayman.',
      },
      {
        q: 'Mavjud kod bilan ishlaysizmi?',
        a: 'Ha. Audit o‘tkazaman, tor joylarni aniqlayman, arxitekturani yangilayman va mahsulotni to‘xtatmasdan barqaror konturga o‘tkazaman.',
      },
    ],
  },
  contact: {
    label: 'Hamkorlik',
    heading: 'Keling, birgalikda',
    em: 'o‘lchanadigan natija yaratamiz.',
    sub:
      'Vazifa haqida gapirib bering: ma’lumot, cheklovlar va muhim ko‘rsatkich. Bir-ikki ish kuni ichida javob beraman va keyingi qadamni taklif qilaman.',
    infoTitle: 'Aloqa',
    emailLabel: 'Email',
    telegramLabel: 'Telegram',
    locationLabel: 'Joylashuv',
    availabilityLabel: 'Holat',
    availabilityValue: 'Loyihalar va tadqiqotlarga ochiq',
    form: {
      name: 'Ism',
      namePlaceholder: 'Ismingiz',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      message: 'Vazifa',
      messagePlaceholder: 'Vazifa, ma’lumot va kerakli natijani qisqacha yozing',
      note: 'To‘g‘ridan-to‘g‘ri pochtamga yuboriladi. Shaxsiy ma’lumotlar uchinchi shaxslarga berilmaydi.',
      noteFallback: 'Pochta ilovangiz ochiladi — xabarni o‘shandan yuboring.',
      submit: 'Yuborish',
      sending: 'Yuborilmoqda…',
      sent: 'Xabar yuborildi',
      sentMailto: 'Xat tayyor — uni pochta ilovangizdan yuboring',
      error: 'Ism, email va vazifani to‘ldiring',
      failed: 'Yuborib bo‘lmadi. Qayta urinib ko‘ring yoki pochtaga yozing.',
      required: 'majburiy',
    },
  },
  footer: {
    blurb: 'Real vazifalar uchun AI tizimlarini loyihalayman: kompyuter ko‘rishi, xavfsizlik, avtonom qurilmalar va interfeyslar — tadqiqotdan MVPgacha.',
    cta: "Bog'lanish",
    sections: 'Bo‘limlar',
    more: 'Yana',
    contacts: 'Aloqa',
    rights: 'Barcha huquqlar himoyalangan.',
    note: 'Faqat ochiq ma’lumot. Shaxsiy va maxfiy ma’lumotlar ko‘rsatilmaydi.',
  },
  modal: {
    label: 'Keys',
    overview: 'Umumiy',
    challenge: 'Vazifa',
    solution: 'Yechim',
    result: 'Natija',
    stack: 'Texnologiyalar',
    links: 'Havolalar',
    close: 'Keysni yopish',
    github: 'GitHub',
    demo: 'Demo',
  },
}

export const SITE_COPY: Record<Language, SiteCopy> = { ru, en, uz }

export function useSiteCopy(): SiteCopy {
  const { lang } = useI18n()
  return SITE_COPY[lang]
}
