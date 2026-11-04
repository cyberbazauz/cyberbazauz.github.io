import type { Messages } from './types'

const en: Messages = {
  meta: {
    title: 'Islombek Muqimov — Portfolio — AI Engineer & Software',
    description:
      'Islombek Muqimov — AI engineer. Building what once seemed impossible: AI makes it real. Neural architectures, intelligent systems and robust software.',
    ogTitle: 'Islombek Muqimov — Portfolio — AI Engineer',
    ogDescription:
      'Building what once seemed impossible. AI makes it real.',
  },
  app: {
    skip: 'Skip to projects',
    keysMenu: 'menu',
    keysGuide: 'guide',
    keysTop: 'top',
    headerCenter: 'Portfolio · A System for Building Ideas',
    close: 'Close',
    index: 'Index',
    menuAria: 'Site navigation',
    sectionsAria: 'Sections',
    backToTop: 'Back to top',
    location: 'Uzbekistan',
    statusOpen: 'Projects',
  },
  nav: {
    mind: 'HUMAN MIND',
    idea: 'THE IDEA',
    transfer: 'THE TRANSFER',
    ai: 'INTELLIGENCE',
    execution: 'EXECUTION',
    work: 'PROJECTS',
    experiments: 'EXPERIMENTS',
    about: 'ABOUT',
    contact: 'CONTACT',
  },
  mind: {
    aria: 'Human mind',
    label: '01 · HUMAN MIND — THE ORIGIN OF IDEAS',
    headline: ['HUMAN THINKS.', 'IDEAS ARE BORN HERE.'],
    dragHint: 'drag the network',
    explore: 'See the idea',
    statProjects: 'PROJECTS',
    statExperiments: 'EXPERIMENTS',
    statTechnologies: 'TECHNOLOGIES',
  },
  idea: {
    aria: 'The idea',
    label: '02 · THE IDEA — SIGNAL GATHERS',
    headline: ['THOUGHT GATHERS.', 'AN IDEA TAKES SHAPE.'],
    lead: 'A few neurons fire together, the same thought repeats across the net, and out of that rhythm one node becomes the idea.',
    steps: [
      { name: 'Signal', note: 'a cluster fires in unison' },
      { name: 'Pattern', note: 'the rhythm repeats across the network' },
      { name: 'Idea', note: 'one node becomes the idea' },
    ],
    footer: 'The human net does not stop — it keeps thinking. This is the origin.',
  },
  transfer: {
    aria: 'The transfer',
    label: '03 · THE TRANSFER — IDEA TO SYSTEM',
    headline: ['AN IDEA BECOMES', 'A SYSTEM.'],
    sub: 'ИДЕЯ СТАНОВИТСЯ СИСТЕМОЙ.',
    desc: 'An impulse detaches from the organic net and descends. Curved branches straighten into connections, luminous points become compute nodes, and directed flow replaces drift.',
  },
  ai: {
    aria: 'Artificial intelligence',
    label: '04 · ARTIFICIAL INTELLIGENCE — THE EXECUTION ENGINE',
    headline: ['MACHINES EXECUTE.', 'THE NET THAT ACTS.'],
    desc: 'The transferred idea is now a machine network: layered, connected, deterministic. Every edge is a channel, every node an operation, every impulse a decision.',
    flow: [
      { name: 'LAYERED', note: 'input on top, output below' },
      { name: 'WIRED', note: 'every edge routes to a real node' },
      { name: 'DIRECTED', note: 'data flows one way, layer by layer' },
    ],
    result: 'What the human could only imagine, the machine can run.',
  },
  execution: {
    aria: 'Execution',
    label: '05 · EXECUTION — INFORMATION BECOMES PRODUCT',
    headline: ['INFORMATION BECOMES', 'A WORKING PRODUCT.'],
    desc: 'The machine runs the idea. Input enters at the top, hidden layers transform it, and a result assembles on the other side — a schema, an interface, a product.',
    flow: [
      { name: 'INPUT', note: 'the idea enters the machine' },
      { name: 'PROCESSING', note: 'layers transform it into structure' },
      { name: 'OUTPUT', note: 'a product assembles, ready to ship' },
    ],
    result: 'From a thought to something the world can use — built below.',
  },
  hero: {
    aria: 'Introduction',
    kickerPrefix: 'Portfolio — ',
    headline: ['BUILDING WHAT SEEMED IMPOSSIBLE.', 'AI MAKES IT REAL.'],
    dragHint: 'drag the network',
    explore: 'Explore work',
    statProjects: 'PROJECTS',
    statExperiments: 'EXPERIMENTS',
    statTechnologies: 'TECHNOLOGIES',
  },
  ideas: {
    aria: 'Manifesto',
    statement: [
      'A portfolio is',
      'not a list of works —',
      'it is a system:',
      'ideas in, products out.',
    ],
    steps: [
      { name: 'Idea', note: 'a signal worth pursuing' },
      { name: 'System', note: 'turned into an architecture' },
      { name: 'Product', note: 'shipped, measured, kept alive' },
    ],
    footer: 'Everything on this page is a function of data, geometry and intent.',
  },
  about: {
    aria: 'About',
    factName: 'Name',
    factRole: 'Role',
    factFocus: 'Focus',
    factLocation: 'Location',
    factTimezone: 'Timezone',
    factStatus: 'Status',
    manifestoPre: 'I operate at the forefront of ',
    manifestoEm1: 'AI engineering, software and security',
    manifestoMid:
      ' — building what once seemed impossible by turning advanced models into ',
    manifestoEm2: 'working systems',
    manifestoPost: '. AI makes the impossible real, and I engineer it into reliable products.',
    disciplines: ['AI & Machine Learning', 'Software Engineering', 'Cybersecurity'],
    identityAria: 'Identity card',
    identitySystem: 'System',
    identitySystemValue: 'I/M — Idea, Architecture, Execution',
    identityState: 'State',
    identityStateValue: 'Available for projects',
  },
  projects: {
    aria: 'Projects',
    sectionTitle: 'Work — Systems',
    tagsAria: 'Tags',
    openCase: 'Open case study',
    openCaseAria: 'Open {title} case study',
    next: 'Next: Experiments',
    caseLabel: 'Case',
    sourceCode: 'Source code',
    liveDemo: 'Live demo',
    caseAria: 'case study',
    fieldOverview: 'Overview',
    fieldChallenge: 'Challenge',
    fieldSolution: 'Solution',
    fieldResult: 'Result',
    technologyAria: 'Technology',
    content: {
      yotoqhonam: {
        subtitle: 'Dormitory Management Platform',
        tags: ['ACCOUNTING', 'AUTOMATION', 'AI'],
        description:
          'A dormitory as a single operating system: students, rooms, beds, floors, check-ins, transfers, duties and reporting.',
        role: 'Full-stack / Product',
        type: 'Platform',
        case: {
          overview:
            'A single operating system for a student dormitory — every bed, floor, duty shift and payment in one place.',
          challenge:
            'Spreadsheet records and paper journals: beds recounted by hand, confusion during transfers, reporting done by eye.',
          solution:
            'A "floor → room → bed" model, automatic free-capacity calculation, check-in / transfer / check-out flows and end-to-end reporting.',
          result:
            'The administrator sees live occupation of the dormitory, and any operation takes minutes instead of hours.',
          technology: ['TypeScript', 'React', 'PostgreSQL', 'REST', 'Roles & Audit'],
          stats: [
            { value: '428', label: 'Students tracked' },
            { value: '96', label: 'Rooms modelled' },
            { value: '6', label: 'Core modules' },
          ],
        },
      },
      antifake: {
        subtitle: 'AI Image Protection',
        tags: ['ADVERSARIAL ML', 'COMPUTER VISION', 'ROBUSTNESS'],
        description:
          'A protection layer for images: an imperceptible perturbation that breaks classifiers while keeping the picture intact for humans.',
        role: 'Research / ML',
        type: 'Research',
        case: {
          overview:
            'An adversarial protection engine that makes photographs unreadable for AI models while staying invisible to people.',
          challenge:
            'Models recognise images a human has never seen — deepfakes and scraping operate without the consent of authors.',
          solution:
            'Batch generation of small perturbations in feature space: the image keeps its look, the model gradient does not.',
          result:
            'Classification of target models drops to random-choice level under a perturbation invisible to the eye.',
          technology: ['PyTorch', 'FGSM / PGD', 'TorchVision', 'NumPy'],
          stats: [
            { value: '0.03', label: 'L∞ perturbation' },
            { value: '94%', label: 'Fooling success' },
            { value: '3', label: 'Models tested' },
          ],
        },
      },
      shieldx: {
        subtitle: 'Smart Web Security & Threat Monitoring Platform',
        tags: ['WAF', 'SIEM', 'THREAT DETECTION'],
        description:
          'A web protection platform: traffic inspection, anomaly detection, attack blocking and real-time alerting.',
        role: 'Security Engineering',
        type: 'Platform',
        case: {
          overview:
            'A web security layer that watches traffic, learns what normal looks like and blocks what does not.',
          challenge:
            'Attacks do not arrive at convenient hours: manual log review is always late, and basic WAF rules miss bypasses.',
          solution:
            'Rules, behavioural metrics and anomaly scoring in a single pipeline: ingest → detect → block → alert.',
          result:
            'One screen instead of five log views: a live threat stream, automatic blocking and instant alerts.',
          technology: ['Python', 'FastAPI', 'Rules Engine', 'Anomaly Scoring', 'WebSockets'],
          stats: [
            { value: '1.2K', label: 'Threats blocked' },
            { value: '<40ms', label: 'Inspection latency' },
            { value: '24/7', label: 'Monitoring' },
          ],
        },
      },
    },
  },
  experiments: {
    aria: 'Experiments',
    sectionTitle: 'Experiments — Field',
    lede: 'Six directions I explore in the field — select one to inspect it.',
    fieldPreview: 'Field preview',
    content: {
      vision: {
        title: 'Computer Vision',
        description: 'Detection, tracking, and understanding pixels in real time.',
      },
      security: {
        title: 'Cybersecurity',
        description: 'Breaking and hardening systems to learn how they fail.',
      },
      agents: {
        title: 'AI Agents',
        description: 'Autonomous loops that plan, use tools and finish the job.',
      },
      interfaces: {
        title: '3D Interfaces',
        description: 'Spatial, interactive surfaces built with WebGL and shaders.',
      },
      reverse: {
        title: 'Reverse Engineering',
        description: 'Disassembly, protocols, and understanding black boxes.',
      },
      hardware: {
        title: 'Hardware',
        description: 'Sensors, microcontrollers and the physical layer.',
      },
    },
  },
  stack: {
    aria: 'Technology stack',
    sectionTitle: 'Stack — Technology orbit',
    lede: 'Everything orbits the core. Hover a node to bring it into focus.',
    coreLabel: 'Core',
    coreSub: 'ideas → systems',
    legendRing1: 'ring 1 — core engineering',
    legendRing2: 'ring 2 — systems & operations',
  },
  stackDesc: {
    Python: { description: 'ML research, tooling, backends' },
    TypeScript: { description: 'Typed product engineering' },
    React: { description: 'Interfaces with motion & state' },
    JavaScript: { description: 'The web, end to end' },
    PyTorch: { description: 'Models, training, experiments' },
    'Three.js': { description: 'Real-time 3D on the web' },
    Linux: { description: 'Daily environment & servers' },
    Docker: { description: 'Reproducible deployments' },
    Git: { description: 'History, review, delivery' },
    Cybersecurity: { description: 'Threats, defenses, analysis' },
    AI: { description: 'Agents, vision, robustness' },
  },
  journey: {
    aria: 'Journey',
    sectionTitle: 'Journey — build history',
    lede: 'The short version: each year added a layer — first pages, then systems.',
    entries: [
      {
        year: '2024',
        title: 'First Projects',
        description:
          'Web foundations, automation scripts, and the first things shipped to real users.',
      },
      {
        year: '2025',
        title: 'AI / Cybersecurity',
        description:
          'Moved from building pages to building systems — models, agents, threat analysis.',
      },
      {
        year: '2026',
        title: 'AntiFake · Yotoqhonam · SHIELDX',
        description:
          'Three serious builds: adversarial research, a dormitory platform, a security product.',
      },
      {
        year: 'NOW',
        title: 'Open for Collaboration',
        description:
          'Looking for hard problems, ambitious teams and research worth doing properly.',
      },
    ],
  },
  contact: {
    aria: 'Contact',
    sectionTitle: 'Contact — open channel',
    titleAria: 'Have an idea',
    lines: ['Have an idea?', "Let's build", 'something worth', 'remembering.'],
    lead: 'A system, a product, an experiment — if it should exist, I want to build it. Pick a channel, any channel.',
    channels: 'Channels',
  },
  finale: {
    aria: 'Final statement',
    title: ['Everything starts', 'with one idea.'],
    sub: 'System core reassembled — D/P · Portfolio',
  },
  footer: {
    note: 'a system for building ideas',
    top: '↑ Top',
  },
  command: {
    aria: 'Command menu',
    inputLabel: 'Type a command',
    placeholder: 'navigate, contact, or go somewhere…',
    commandsAria: 'Commands',
    groupNav: 'Navigation',
    groupSections: 'Sections',
    groupContact: 'Contact',
    backToTop: 'Back to top',
    empty: 'Nothing found for “{query}”',
  },
  guide: {
    aria: 'Keyboard shortcuts',
    titlePre: 'Shortcuts — ',
    titleEm: 'how to drive this engine',
    rows: [
      { keys: ['/'], value: 'Open command palette' },
      { keys: ['?'], value: 'Show this guide' },
      { keys: ['ESC'], value: 'Close overlays' },
      { keys: ['D'], value: 'Back to top' },
      { keys: ['NET drag'], value: 'Rotate the network' },
      { keys: ['Scroll'], value: 'Morph the network by chapter' },
    ],
  },
  status: {
    coreOnline: 'NETWORK STATUS ONLINE',
    nodes: 'NETWORK NODES',
    signalActive: 'SIGNAL ACTIVE',
    systemReady: 'SYSTEM READY',
  },
  cursor: {
    view: 'VIEW',
    open: 'OPEN',
    go: 'GO',
    drag: 'DRAG',
    rotate: 'ROTATE',
    node: 'NODE ACTIVE',
    language: 'LANGUAGE',
  },
  language: {
    aria: 'Language',
    uz: 'UZ',
    ru: 'RU',
    en: 'EN',
    uzFull: 'O‘zbekcha',
    ruFull: 'Русский',
    enFull: 'English',
  },
  socials: {
    email: 'Email',
  },
}

export default en