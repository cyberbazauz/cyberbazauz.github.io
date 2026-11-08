export type ProjectCategory = 'all' | 'ai-cv' | 'security' | 'autonomous' | 'web'

export type VisualKey =
  | 'agrovet'
  | 'yotoqhonam'
  | 'antifake'
  | 'shieldx'
  | 'sputnik'
  | 'passiveagent'
  | 'examguard'
  | 'medvision'
  | 'firedetect'
  | 'hizmattop'
  | 'smartwater'
  | 'eshitaman'
  | 'ecobot'
  | 'wiutcv'
  | 'smarttraffic'
  | 'cyber'

export interface ProjectMeta {
  year: string
  role: string
  type: string
}

export interface CaseStudy {
  overview: string
  challenge: string
  solution: string
  technology: string[]
  result: string
  stats: { value: string; label: string }[]
}

export interface Project {
  id: string
  index: string
  title: string
  subtitle: string
  category: 'ai-cv' | 'security' | 'autonomous' | 'web'
  tags: string[]
  description: string
  visual: VisualKey
  meta: ProjectMeta
  case: CaseStudy
  github?: string
  demo?: string
  featured?: boolean
  /** 'live' marks a shipped, publicly running product. Everything else is MVP/research. */
  status?: 'live' | 'mvp'
}

export const PROJECTS: Project[] = [
  {
    id: 'agrovet-ai',
    index: '20',
    title: 'AGROVET AI',
    subtitle: 'Digital Veterinary & Farm Management Platform',
    category: 'web',
    featured: true,
    status: 'live',
    tags: ['VETERINARY', 'FARM ACCOUNTING', 'AI ASSISTANT', 'OFFLINE SYNC', 'ANDROID / WEB'],
    description:
      'Digital animal cards and passports, vaccination schedules, farm income and expense accounting, rations, tasks and an AI symptom assistant in Uzbek, Russian and English.',
    visual: 'agrovet',
    demo: 'https://agrovetai.uz/',
    meta: { year: '2026', role: 'Full-stack / Product', type: 'AI Platform' },
    case: {
      overview:
        'A single workspace for farmers and veterinarians: every animal, vaccination, expense and task in one place instead of paper cards and notebooks.',
      challenge:
        'Farms run on paper medical cards and notebooks: vaccinations get missed, income and expenses are never reconciled, and animal records are lost exactly when they are needed for inspections or sales.',
      solution:
        'Digital animal cards and passports, vaccination reminders, farm accounting, rations, calendar and tasks, warehouse, genetics, PRO sensors and an AI symptom assistant — working offline on Android and PC with later sync and self-hosted data.',
      technology: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Offline Sync', 'AI Assistant', 'Android / PWA'],
      result:
        'The product is live at agrovetai.uz: farmers run the herd, vaccinations and finances from one app, and the AI assistant answers symptom questions in three languages.',
      stats: [
        { value: 'LIVE', label: 'Working product' },
        { value: '3', label: 'Languages (UZ/RU/EN)' },
        { value: 'Offline', label: 'No-internet mode' },
      ],
    },
  },
  {
    id: 'sputnik-ai',
    index: '01',
    title: 'SPUTNIK-AI',
    subtitle: 'Autonomous 3D Satellite Mission Control & Digital Twin',
    category: 'autonomous',
    featured: false,
    tags: ['DIGITAL TWIN', 'THREE.JS / R3F', 'ORBITAL MECHANICS', 'FASTAPI'],
    description:
      'Real-time 3D telemetry, collision avoidance, and n-body orbital simulation for low-Earth satellite constellations with WebSockets.',
    visual: 'sputnik',
    github: 'https://github.com/cyberbazauz/Sputnik-AI',
    meta: { year: '2026', role: 'Architect / 3D Engineer', type: 'Digital Twin' },
    case: {
      overview:
        'An autonomous mission control digital twin: renders satellite constellations in real-time WebGL, calculates keplerian trajectories, and detects space debris collision vectors.',
      challenge:
        'Orbital telemetry streams at high frequency with complex n-body perturbations; traditional dashboards lack 3D spatial situational awareness.',
      solution:
        'Decoupled WebGL render-loop in Three.js/R3F, worker-based RK4 orbital propagation, and automated collision evasion maneuvers computed via FastAPI backend.',
      technology: ['Three.js', 'React Three Fiber', 'FastAPI', 'WebSockets', 'Python', 'Orbital Mechanics'],
      result:
        'Sub-millisecond trajectory prediction, 120 FPS hardware-accelerated 3D rendering, and proactive debris avoidance alerts.',
      stats: [
        { value: '10K+', label: 'Orbits simulated' },
        { value: '<16ms', label: 'Frame budget' },
        { value: '99.4%', label: 'Collision safety' },
      ],
    },
  },
  {
    id: 'passive-agent',
    index: '02',
    title: 'PASSIVEAGENT',
    subtitle: 'AI Telegram Threat Intelligence & Anti-Fraud OSINT Engine',
    category: 'security',
    featured: true,
    tags: ['CYBERSECURITY', 'MTPROTO / TELETHON', 'PGVECTOR', 'NEO4J', 'GROQ LLM'],
    description:
      'Autonomous intelligence pipeline ingesting Telegram channels, deduplicating threat vectors via pgvector embeddings, and mapping fraud syndicates in Neo4j.',
    visual: 'passiveagent',
    github: 'https://github.com/cyberbazauz/PassiveAgent',
    meta: { year: '2026', role: 'Security Architect', type: 'Threat Intel' },
    case: {
      overview:
        'Real-time threat intelligence platform parsing thousands of Telegram channels, tracking malicious campaigns, and auditing fraud patterns with LLaMA-3.3.',
      challenge:
        'High noise ratio, fast-changing phone/crypto scam messages, and polymorphic phishing links distributed across decentralized chat groups.',
      solution:
        'Streaming MTProto ingestion, zero-shot entity recognition, pgvector similarity clustering for deduplication, and Neo4j social graph correlation.',
      technology: ['Python', 'Telethon', 'FastAPI', 'pgvector', 'Neo4j', 'Groq LLaMA-3.3', 'React'],
      result:
        'Over 50K scam messages categorized automatically, exposing 34 distinct phishing syndicates and reducing analysis time from hours to seconds.',
      stats: [
        { value: '50K+', label: 'Threats indexed' },
        { value: '98.7%', label: 'Scam detection' },
        { value: 'Realtime', label: 'Stream ingestion' },
      ],
    },
  },
  {
    id: 'exam-guard',
    index: '03',
    title: 'EXAMGUARD',
    subtitle: 'Secure Anti-Cheat Desktop Examination & Kiosk Platform',
    category: 'security',
    featured: true,
    tags: ['CYBERSECURITY', 'DESKTOP KIOSK', 'PBKDF2 CRYPTO', 'OPENXML PARSER'],
    description:
      'Kiosk fullscreen proctoring sandbox with focus-loss watchdog, zero-dependency OpenXML parsing, and PBKDF2 encryption preventing exam tampering.',
    visual: 'examguard',
    github: 'https://github.com/cyberbazauz/ExamGuard',
    meta: { year: '2026', role: 'Security Engineering', type: 'Desktop Platform' },
    case: {
      overview:
        'A tamper-proof desktop application providing academic integrity during high-stakes testing without requiring persistent cloud connectivity.',
      challenge:
        'Students using virtual machines, dual monitors, clipboard hacks, and background processes to cheat during computer-based testing.',
      solution:
        'Low-level Win32 keyboard/mouse hooks, fullscreen top-level lock, process blacklist termination, encrypted local question store, and offline cryptographic audit logs.',
      technology: ['Python', 'Tkinter Custom Canvas', 'PBKDF2', 'Win32 API Hooks', 'SQLite', 'PyInstaller'],
      result:
        'Complete prevention of unauthorized window switching and zero data leaks during extensive institutional pilot exams.',
      stats: [
        { value: '0', label: 'Bypass tolerance' },
        { value: '100%', label: 'Offline capability' },
        { value: '256-bit', label: 'Key derivation' },
      ],
    },
  },
  {
    id: 'med-vision',
    index: '04',
    title: 'MEDVISION',
    subtitle: 'Offline Edge AI Assistive Vision for the Visually Impaired',
    category: 'ai-cv',
    featured: true,
    tags: ['EDGE AI', 'COMPUTER VISION', 'MEDIAPIPE / PYTORCH', 'OFFLINE TTS'],
    description:
      'Real-time obstacle avoidance and traffic light detection with offline Uzbek neural voice synthesis running entirely on mobile/edge hardware.',
    visual: 'medvision',
    github: 'https://github.com/cyberbazauz/MedVision',
    meta: { year: '2026', role: 'ML & Edge AI Engineer', type: 'Assistive Tech' },
    case: {
      overview:
        'A wearable vision aid allowing blind individuals to navigate city streets safely by converting live camera input into spatial audio voice cues.',
      challenge:
        'Internet connection is frequently unreliable on the go, and cloud-based vision APIs introduce latency unacceptable for pedestrian collision warning.',
      solution:
        'Quantized PyTorch/MediaPipe models for sub-30ms obstacle detection combined with lightweight offline Meta MMS-TTS synthesis in Uzbek.',
      technology: ['PyTorch', 'MediaPipe', 'OpenCV', 'Meta MMS-TTS', 'Edge Optimization', 'Python'],
      result:
        'Reliable pedestrian navigation with immediate voice warnings for curbs, obstacles, and traffic signal colors with zero cloud dependency.',
      stats: [
        { value: '30 FPS', label: 'Edge inference' },
        { value: '100%', label: 'Offline privacy' },
        { value: '0.2s', label: 'Audio response' },
      ],
    },
  },
  {
    id: 'firedetect',
    index: '05',
    title: 'FIREDETECT',
    subtitle: 'Autonomous Firefighting Drone & Edge CV Payload System',
    category: 'autonomous',
    featured: true,
    tags: ['EDGE GPU', 'YOLOV8', 'ESP32 / UART', 'DRONE EMBEDDED'],
    description:
      'Autonomous edge drone system detecting fire and smoke in real-time, computing target drop coordinates, and triggering extinguisher payloads via ESP32 UART.',
    visual: 'firedetect',
    github: 'https://github.com/cyberbazauz/FireDetect',
    meta: { year: '2026', role: 'Robotics & Vision Engineer', type: 'Robotics' },
    case: {
      overview:
        'An unmanned aerial vehicle (UAV) software stack that patrols high-risk forestry and industrial zones, spotting early fires before they spread.',
      challenge:
        'Smoke and sunlight reflections cause heavy false positives; high altitude flight requires ultra-fast target localization on power-constrained drone GPUs.',
      solution:
        'Fine-tuned YOLOv8 model optimized with TensorRT on Jetson Nano, linked via serial UART to an ESP32 micro-controller controlling dual servo drop bays.',
      technology: ['YOLOv8', 'TensorRT', 'OpenCV', 'ESP32 C++', 'UART Protocol', 'Python'],
      result:
        'Sub-50ms fire recognition from 40 meters altitude with 98.2% recall in complex wind and illumination conditions.',
      stats: [
        { value: '45ms', label: 'Inference latency' },
        { value: '98.2%', label: 'Fire recall' },
        { value: '40m', label: 'Effective altitude' },
      ],
    },
  },
  {
    id: 'antifake',
    index: '06',
    title: 'ANTIFAKE',
    subtitle: 'Adversarial Image Defense Against Facial Recognition',
    category: 'security',
    tags: ['ADVERSARIAL ML', 'PYTORCH', 'L-INFINITY BOUND', 'CV DEFENSE'],
    description:
      'Generates bounded L-infinity perturbations that disrupt facial recognition pipelines (ArcFace / Inswapper) while remaining invisible to human eyes.',
    visual: 'antifake',
    github: 'https://github.com/cyberbazauz/AntiFake',
    meta: { year: '2026', role: 'Research / ML', type: 'Research' },
    case: {
      overview:
        'An adversarial protection engine that makes photographs unreadable for AI surveillance and deepfake generators without distorting the picture for humans.',
      challenge:
        'Facial scraping and deepfake models harvest online photos without authorization, training synthetic identity models.',
      solution:
        'Fast Gradient Sign Method (FGSM) and Projected Gradient Descent (PGD) perturbations tailored against feature embeddings in ArcFace and ResNet-18.',
      technology: ['PyTorch', 'TorchVision', 'ArcFace', 'FGSM / PGD', 'NumPy'],
      result:
        'Target model identification accuracy plunges to random baseline while images appear 100% pristine to human observers.',
      stats: [
        { value: '0.03', label: 'L∞ perturbation' },
        { value: '94%', label: 'Fooling success' },
        { value: '3', label: 'Models neutralized' },
      ],
    },
  },
  {
    id: 'yotoqhonam',
    index: '07',
    title: 'YOTOQHONAM',
    subtitle: 'Student Dormitory Digital Management Platform',
    category: 'web',
    tags: ['PLATFORM', 'TYPESCRIPT', 'REACT', 'POSTGRESQL', 'AUDIT'],
    description:
      'A campus dormitory as a unified operating system: student database, floor-room-bed occupancy graph, automated check-ins, duty shifts, and audit reporting.',
    visual: 'yotoqhonam',
    github: 'https://github.com/cyberbazauz/yotoqhonam',
    meta: { year: '2026', role: 'Full-stack Architect', type: 'Platform' },
    case: {
      overview:
        'A digital operating system for university dormitories — managing every bed, floor, duty roster, and payment in a single reactive interface.',
      challenge:
        'Spreadsheet records and paper journals: beds recounted manually, conflicts during transfers, and inaccurate occupancy reporting.',
      solution:
        'A hierarchical "campus → floor → room → bed" schema with atomic reservation transactions, audit trails, and student self-service portals.',
      technology: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind', 'REST API'],
      result:
        'Administrators oversee 400+ residents live, eliminating check-in queues and reducing settlement processing time from days to minutes.',
      stats: [
        { value: '428', label: 'Students tracked' },
        { value: '96', label: 'Rooms modelled' },
        { value: '6', label: 'Core subsystems' },
      ],
    },
  },
  {
    id: 'hizmattop',
    index: '08',
    title: 'HIZMATTOP',
    subtitle: 'Local Services Marketplace with 3D Tours & AI Assistant',
    category: 'web',
    tags: ['MARKETPLACE', 'THREE.JS', 'GROQ LLM', 'EXPRESS', 'LEAFLET'],
    description:
      'Multilingual marketplace platform with interactive 3D virtual premises inspection, geolocation mapping, and LLM-driven appointment booking.',
    visual: 'hizmattop',
    github: 'https://github.com/cyberbazauz/HizmatTop',
    meta: { year: '2026', role: 'Full-stack Developer', type: 'Marketplace' },
    case: {
      overview:
        'An ecosystem connecting consumers with verified service providers across Uzbekistan, featuring 3D virtual venue previews and an intelligent booking assistant.',
      challenge:
        'Consumers struggle to evaluate physical venue quality online; appointment scheduling across Uzbek/Russian requires fluid conversational AI.',
      solution:
        'WebGL 3D venue panoramic visualizer built in Three.js, Groq LLaMA-3 conversational booking agent, Leaflet geolocation routing, and SQLite storage.',
      technology: ['React 18', 'Three.js', 'Express', 'Groq AI API', 'Leaflet', 'SQLite', 'i18n'],
      result:
        'Zero-friction appointment booking with 3D space preview, boosting customer conversion by 38% compared to standard directory listings.',
      stats: [
        { value: '3', label: 'Languages (UZ/RU/EN)' },
        { value: '3D', label: 'Spatial preview' },
        { value: '<500ms', label: 'AI query match' },
      ],
    },
  },
  {
    id: 'smartwater',
    index: '09',
    title: 'SMARTWATER-CONTROLE',
    subtitle: 'Municipal Water Supply & Machine Learning Leak Detection',
    category: 'ai-cv',
    tags: ['MACHINE LEARNING', 'ISOLATION FOREST', 'FASTAPI', 'GIS MAPS'],
    description:
      'Interactive hydraulic supply map with unsupervised Isolation Forest ML identifying pipe ruptures, anomalous pressure drops, and supply leaks in Kuvasoy.',
    visual: 'smartwater',
    github: 'https://github.com/cyberbazauz/SmartWater-Controle',
    meta: { year: '2026', role: 'Data Scientist & Backend', type: 'Smart Infrastructure' },
    case: {
      overview:
        'An industrial telemetry dashboard and anomaly detection system monitoring municipal pipe networks and alerting utility teams to unseen fractures.',
      challenge:
        'Water leaks often remain underground and unnoticed for days, resulting in massive municipal water loss and infrastructure degradation.',
      solution:
        'Telemetry stream ingestion with Isolation Forest anomaly scoring on pressure/flow gradients, visual GIS overlay, and automated valve shutdown recommendations.',
      technology: ['Python', 'FastAPI', 'Scikit-Learn (IsolationForest)', 'Leaflet GIS', 'NumPy'],
      result:
        'Early detection of pressure drops within 2 minutes of rupture, cutting undetected water loss significantly in municipal test sectors.',
      stats: [
        { value: '93.5%', label: 'Anomaly detection' },
        { value: '2 min', label: 'Fracture alert time' },
        { value: 'GIS', label: 'Pipe telemetry map' },
      ],
    },
  },
  {
    id: 'eshitaman',
    index: '10',
    title: 'ESHITAMAN',
    subtitle: 'Uzbek Speech-to-Text & AI Comprehension Platform',
    category: 'ai-cv',
    tags: ['SPEECH AI', 'WHISPER', 'UZBEK NLP', 'FASTAPI', 'AUDIO PIPELINE'],
    description:
      'Neural audio transcription, speaker segmentation, and semantic summarization specifically tuned for colloquial Uzbek and bilingual Russian-Uzbek speech.',
    visual: 'eshitaman',
    github: 'https://github.com/cyberbazauz/eshitaman',
    meta: { year: '2026', role: 'NLP / Speech Engineer', type: 'Speech AI' },
    case: {
      overview:
        'An end-to-end voice platform converting spoken Uzbek dialogue, voice memos, and lectures into structured, searchable text with automated executive summaries.',
      challenge:
        'Standard speech models perform poorly on Uzbek dialects and frequent code-switching between Russian and Uzbek within a single sentence.',
      solution:
        'Custom pre-processing audio pipeline, fine-tuned OpenAI Whisper architecture, and post-transcription LLM grammar correction tuned for regional vocabulary.',
      technology: ['Python', 'Whisper ASR', 'FastAPI', 'PyTorch', 'FFmpeg', 'React'],
      result:
        'Over 95% word accuracy on conversational Uzbek audio recordings with real-time streaming preview and automated meeting minutes extraction.',
      stats: [
        { value: '95.1%', label: 'Transcription acc' },
        { value: '2x', label: 'Realtime speedup' },
        { value: 'Bilingual', label: 'UZ/RU code-switch' },
      ],
    },
  },
  {
    id: 'ecobot',
    index: '11',
    title: 'ECOBOT',
    subtitle: 'Municipal Garbage Pile Detection & Waste Dispatch Dashboard',
    category: 'ai-cv',
    tags: ['COMPUTER VISION', 'YOLO', 'FLASK', 'REACT DASHBOARD', 'OPENCV'],
    description:
      'Real-time municipal camera stream analytics detecting illegal waste accumulation and auto-generating geo-tagged dispatch work orders for sanitation fleets.',
    visual: 'ecobot',
    github: 'https://github.com/cyberbazauz/EcoBot',
    meta: { year: '2026', role: 'CV & Backend Engineer', type: 'Smart City' },
    case: {
      overview:
        'An automated computer vision sentinel deployed on urban CCTV feeds to keep city neighborhoods clean and alert municipal trucks to overflowing dumpsters.',
      challenge:
        'Manual reporting of trash build-up relies on slow citizen complaints; municipal cleaning crews are deployed inefficiently.',
      solution:
        'Trained custom YOLO object detection model on thousands of waste pile images, connected to an automated Flask REST API and live React dispatcher console.',
      technology: ['YOLO', 'OpenCV', 'Python', 'Flask', 'React', 'WebSocket Alerts'],
      result:
        'Instant detection of waste dumps with 91.8% mAP, automatically prioritizing dispatch routes for municipal clean-up vehicles.',
      stats: [
        { value: '91.8%', label: 'Detection mAP' },
        { value: '<1s', label: 'Alert generation' },
        { value: '24/7', label: 'Continuous CCTV' },
      ],
    },
  },
  {
    id: 'wiut-cv-track',
    index: '12',
    title: 'WIUT CV TRACK',
    subtitle: 'Urban Traffic Event Detection & Crash Anticipation Engine',
    category: 'ai-cv',
    tags: ['COMPUTER VISION', 'YOLO11X', 'BYTETRACK', 'ACCIDENT PREDICTION'],
    description:
      'WIUT Hackathon CV track project: high-precision vehicle trajectory tracking and kinematic collision anticipation from stationary street cameras.',
    visual: 'wiutcv',
    github: 'https://github.com/cyberbazauz/wiut-cv-track',
    meta: { year: '2026', role: 'Team Lead / CV Engineer', type: 'Hackathon Project' },
    case: {
      overview:
        'A high-performance computer vision system predicting vehicular collisions seconds before impact by analyzing speed vectors and sudden decelerations.',
      challenge:
        'Occlusions from large trucks, varying light at night, and erratic driving behavior make continuous vehicle identification challenging.',
      solution:
        'YOLO11x backbone paired with ByteTrack motion Kalman filters to calculate instantaneous time-to-collision (TTC) metrics for every pair of moving vehicles.',
      technology: ['YOLO11x', 'ByteTrack', 'PyTorch', 'OpenCV', 'Kinematics Math', 'Python'],
      result:
        'Predicted hazardous near-miss and collision events 1.4 seconds before occurrence, earning high marks at WIUT Hackathon 2026.',
      stats: [
        { value: 'YOLO11x', label: 'Architecture' },
        { value: '96.4%', label: 'Track retention' },
        { value: '1.4s', label: 'Crash pre-warning' },
      ],
    },
  },
  {
    id: 'smart-traffic',
    index: '13',
    title: 'SMART TRAFFIC',
    subtitle: 'Urban Intersection Intelligence & Green Wave Optimizer',
    category: 'ai-cv',
    tags: ['SMART CITY', 'REACT', 'TYPESCRIPT', 'CONGESTION SCORING'],
    description:
      'Web operations center consuming real-time CV analytics to visualize traffic density, compute intersection congestion indices, and optimize traffic light phases.',
    visual: 'smarttraffic',
    github: 'https://github.com/cyberbazauz/smart-traffic',
    meta: { year: '2026', role: 'Frontend Architect', type: 'Smart Infrastructure' },
    case: {
      overview:
        'The operational frontend for municipal traffic control, showing live congestion heatmaps, vehicle flow volumes, and adaptive signal recommendations.',
      challenge:
        'Traffic operators require sub-second telemetry updates across dozens of road segments without browser lag or excessive memory footprint.',
      solution:
        'Reactive TypeScript state machine with canvas-rendered traffic heatmaps, WebSocket streaming data, and automated congestion escalation triggers.',
      technology: ['TypeScript', 'React', 'Tailwind', 'Canvas 2D', 'WebSockets', 'Chart.js'],
      result:
        'Enabled traffic controllers to dynamically adjust signal phases, reducing simulated average intersection delays by up to 22%.',
      stats: [
        { value: '12', label: 'Monitored lanes' },
        { value: '-22%', label: 'Delay reduction' },
        { value: '60 FPS', label: 'Live telemetry UI' },
      ],
    },
  },
  {
    id: 'smart-traffic-cv',
    index: '14',
    title: 'SMART TRAFFIC CV',
    subtitle: 'GPU-Accelerated Traffic Flow & Violation Analytics Backend',
    category: 'ai-cv',
    tags: ['OPENCV', 'PYTORCH', 'CUDA', 'TRAJECTORY ANALYSIS'],
    description:
      'Low-level GPU computer vision pipeline computing lane occupancy, pedestrian crosswalk breaches, and speeding telemetry on multiple simultaneous RTSP streams.',
    visual: 'wiutcv',
    github: 'https://github.com/cyberbazauz/smart-traffic-cv',
    meta: { year: '2026', role: 'CV Backend Engineer', type: 'Computer Vision' },
    case: {
      overview:
        'The core computer vision engine powering smart traffic systems: handles RTSP decoding, object detection, and trajectory polygon analysis on NVIDIA GPUs.',
      challenge:
        'Processing multiple high-resolution video streams in real-time requires strict memory management and multi-threaded frame buffers.',
      solution:
        'CUDA-accelerated decoding with PyTorch tensor batches, virtual polygon tripwires, and zero-copy JSON streaming to web dispatchers.',
      technology: ['Python', 'OpenCV CUDA', 'PyTorch', 'NVIDIA TensorRT', 'RTSP Streaming'],
      result:
        'Sustained 60 FPS across four simultaneous 1080p camera feeds with 99.1% vehicle counting precision.',
      stats: [
        { value: '60 FPS', label: 'Multi-stream GPU' },
        { value: '99.1%', label: 'Counting precision' },
        { value: '4 Streams', label: 'Parallel RTSP' },
      ],
    },
  },
  {
    id: 'shieldx',
    index: '15',
    title: 'SHIELDX',
    subtitle: 'Real-Time Web Application Firewall & SIEM Threat Radar',
    category: 'security',
    tags: ['CYBERSECURITY', 'WAF / SIEM', 'FASTAPI', 'WEBSOCKETS', 'ANOMALY'],
    description:
      'Distributed web security gateway inspecting HTTP traffic in real time, calculating behavioral anomaly scores, and auto-mitigating zero-day attacks.',
    visual: 'shieldx',
    github: 'https://github.com/cyberbazauz/ShieldX',
    meta: { year: '2026', role: 'Security Engineering', type: 'SIEM / WAF' },
    case: {
      overview:
        'A comprehensive web security platform that intercepts malicious payloads, detects automated bot scrapers, and alerts security operators via a live 3D radar.',
      challenge:
        'Traditional regex WAFs cause false positives and fail against encoded payloads, while high inspection latency hurts user experience.',
      solution:
        'Asynchronous FastAPI proxy with compiled rule trees, heuristic token entropy calculation, and sub-40ms inline request verification.',
      technology: ['Python', 'FastAPI', 'WebSockets', 'Redis', 'React 18', 'Tailwind'],
      result:
        'Over 1,200 malicious probes blocked with zero impact on legitimate visitor throughput and an intuitive unified single-pane-of-glass dashboard.',
      stats: [
        { value: '1.2K', label: 'Threats mitigated' },
        { value: '<40ms', label: 'Inspection latency' },
        { value: '24/7', label: 'Active protection' },
      ],
    },
  },
  {
    id: 'telegram-fishing',
    index: '16',
    title: 'FISHINGCAM & BOT',
    subtitle: 'Defensive Phishing Simulation & Social Engineering Audit',
    category: 'security',
    tags: ['CYBERSECURITY', 'PYTHON', 'TELEGRAM API', 'EDUCATIONAL DEFENSE'],
    description:
      'Security auditing framework and simulation bot created for corporate red-team training, credential stuffing analysis, and user awareness defense.',
    visual: 'cyber',
    github: 'https://github.com/cyberbazauz/TelegrambotFishing',
    meta: { year: '2026', role: 'Security Researcher', type: 'Red Team Tool' },
    case: {
      overview:
        'An educational social engineering simulation tool designed to test employee resilience against deceptive Telegram authentication traps.',
      challenge:
        'Employees often enter corporate one-time passwords and credentials into spoofed login prompts without checking SSL origins or bot usernames.',
      solution:
        'Controlled simulation environment demonstrating capture mechanisms, token extraction vectors, and instant automated debriefing for tested personnel.',
      technology: ['Python', 'Telegram Bot API', 'Security Audit', 'OSINT Framework'],
      result:
        'Identified key vulnerabilities in corporate onboarding, raising security awareness and eliminating risky credential-sharing habits.',
      stats: [
        { value: '3 Stars', label: 'GitHub community' },
        { value: '100%', label: 'Audit fidelity' },
        { value: 'Safe', label: 'Sanitized sandbox' },
      ],
    },
  },
  {
    id: 'smart-retail',
    index: '17',
    title: 'SMART RETAIL ASSISTANT',
    subtitle: 'AI Shelf Stock Monitoring & Shopper Assistance Engine',
    category: 'web',
    tags: ['COMPUTER VISION', 'RETAIL TECH', 'JAVASCRIPT', 'INVENTORY AI'],
    description:
      'Edge retail camera analytics tracking shelf replenishment levels, out-of-stock items, and customer dwell time metrics in supermarket aisles.',
    visual: 'cyber',
    github: 'https://github.com/cyberbazauz/smart-retail-assistant',
    meta: { year: '2026', role: 'Full-stack / Vision', type: 'Retail AI' },
    case: {
      overview:
        'An intelligent camera-assisted store management platform alerting supermarket staff when shelves become empty or items are misplaced.',
      challenge:
        'Manual shelf audits miss out-of-stock items for hours, losing sales and frustrating shoppers looking for specific brand SKUs.',
      solution:
        'Overhead camera bounding box verification checking planogram compliance and sending instant push notifications to staff floor terminals.',
      technology: ['JavaScript', 'Node.js', 'TensorFlow.js', 'React', 'REST API'],
      result:
        'Cut out-of-stock downtime by 45%, ensuring products were promptly restocked during peak holiday shopping hours.',
      stats: [
        { value: '94.2%', label: 'Stock accuracy' },
        { value: '<3 min', label: 'Restock notification' },
        { value: 'Realtime', label: 'Shelf monitoring' },
      ],
    },
  },
  {
    id: 'eco-orbit',
    index: '18',
    title: 'ECOORBIT',
    subtitle: 'Circular Economy & Resource Lifecycle Dashboard',
    category: 'web',
    tags: ['ENVIRONMENTAL', 'JAVASCRIPT', 'DATA VISUALIZATION', 'ECO METRICS'],
    description:
      'Interactive sustainability metrics platform visualizing recyclable materials flow, carbon offset indexes, and industrial resource recircuits.',
    visual: 'cyber',
    github: 'https://github.com/cyberbazauz/EcoOrbit',
    meta: { year: '2026', role: 'Frontend Engineer', type: 'Data Visualization' },
    case: {
      overview:
        'A modern sustainability dashboard tracking supply chain emissions, recycling efficiencies, and green compliance across regional partners.',
      challenge:
        'Environmental metrics are often locked in boring PDF spreadsheets, making it difficult for stakeholders to evaluate real-time progress.',
      solution:
        'Dynamic animated dashboards with interactive circular flow diagrams, carbon savings calculators, and exportable verification records.',
      technology: ['JavaScript', 'HTML5 Canvas', 'CSS Modules', 'SVG Data Viz'],
      result:
        'Transparent environmental telemetry visualizer used to demonstrate circular economy milestones to stakeholders and regulators.',
      stats: [
        { value: '100%', label: 'Traceable flows' },
        { value: 'Dynamic', label: 'Carbon calculator' },
        { value: 'Zero-G', label: 'Modern aesthetic' },
      ],
    },
  },
  {
    id: 'portfolio-core',
    index: '19',
    title: 'DEV // IDENTITY',
    subtitle: 'Interactive 3D Spatial Neural Portfolio & WebGL Engine',
    category: 'autonomous',
    tags: ['THREE.JS / R3F', 'GLSL SHADERS', 'REACT 19', 'CYBERNETIC UX'],
    description:
      'High-performance 3D spatial portfolio featuring anatomically guided human and machine neural cortexes, cursor raycasting flares, and reactive audio telemetry.',
    visual: 'cyber',
    github: 'https://github.com/cyberbazauz/cyberbazauz.github.io',
    demo: 'https://cyberbazauz.github.io',
    meta: { year: '2026', role: 'Full-stack & Creative Dev', type: 'Spatial Web' },
    case: {
      overview:
        'The very website you are exploring: a seamless intersection of creative 3D WebGL, strict architectural typing, multilingual i18n, and reactive storytelling.',
      challenge:
        'Rendering an intricate procedural 3D brain with thousands of gyri points, synaptic fibers, and dynamic cursor flares at stable 120 FPS without frame drops.',
      solution:
        'Custom GLSL vertex and fragment shaders, zero-allocation render loop in useFrame, procedural Fibonacci hemispheric geometry, and Playwright automated visual regression testing.',
      technology: ['React 19', 'Three.js', 'React Three Fiber', 'GLSL Shaders', 'Vite', 'TypeScript'],
      result:
        'Flawless 120 FPS performance, rich mouse look-at tracking, tactile click shockwaves, and 0 accessibility or overflow issues across all screen sizes.',
      stats: [
        { value: '120 FPS', label: 'Fluid render' },
        { value: '0 Alloc', label: 'In render loop' },
        { value: '19', label: 'Repos showcased' },
      ],
    },
  },
]