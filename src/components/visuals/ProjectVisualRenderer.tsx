import { useState } from 'react'
import type { Project, VisualKey } from '../../data/projects'
import { sound } from '../../lib/audio'
import { AntifakeMock } from './AntifakeMock'
import { ShieldxMock } from './ShieldxMock'
import { YotoqhonamMock } from './YotoqhonamMock'

/* 1. SPUTNIK-AI: Orbital Constellation & Digital Twin Radar */
export function SputnikMock() {
  const [orbit, setOrbit] = useState<'LEO' | 'MEO' | 'GEO'>('LEO')

  const orbitData = {
    LEO: { alt: '540 KM', speed: '7.6 KM/S', period: '94.8 MIN', ry: 80, satY: 46 },
    MEO: { alt: '20,200 KM', speed: '3.9 KM/S', period: '11.9 HRS', ry: 60, satY: 34 },
    GEO: { alt: '35,786 KM', speed: '3.07 KM/S', period: '24.0 HRS', ry: 40, satY: 22 },
  }[orbit]

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">ORBITAL MISSION CONTROL // {orbit} REGIME</span>
        <span className="r">ALT: {orbitData.alt} • V: {orbitData.speed}</span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#090a10', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Earth horizon arc */}
          <circle cx="160" cy="240" r="160" fill="none" stroke="rgba(0,240,255,0.25)" strokeWidth="1.5" />
          <circle cx="160" cy="240" r="180" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 6" />
          
          {/* Orbital path */}
          <path d={`M 20 ${orbitData.ry} Q 160 10 300 ${orbitData.ry}`} fill="none" stroke="#00f0ff" strokeWidth="1.5" />
          
          {/* Satellites */}
          <circle cx="90" cy={orbitData.satY} r="4" fill="#00f0ff">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="76" y={orbitData.satY - 10} fill="#00f0ff" fontSize="8" fontFamily="ui-monospace, monospace">SAT-01 [{orbit}]</text>
          
          <circle cx="180" cy={orbitData.satY - 16} r="5" fill="#fde68a" />
          <line x1="180" y1={orbitData.satY - 16} x2="220" y2={orbitData.satY + 2} stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="220" cy={orbitData.satY + 2} r="3" fill="#f43f5e" />
          <text x="188" y={orbitData.satY - 22} fill="#fde68a" fontSize="8" fontFamily="ui-monospace, monospace">SAT-02 [CORE]</text>
          <text x="226" y={orbitData.satY + 6} fill="#f43f5e" fontSize="7" fontFamily="ui-monospace, monospace">DEBRIS #904 [EVADED]</text>
          
          {/* Telemetry Grid */}
          <line x1="30" y1="130" x2="290" y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
          <text x="30" y="142" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="ui-monospace, monospace">PROPAGATION: RK4</text>
          <text x="140" y="142" fill="#38bdf8" fontSize="7" fontFamily="ui-monospace, monospace">PERIOD: {orbitData.period}</text>
          <text x="255" y="142" fill="#4ade80" fontSize="7" fontFamily="ui-monospace, monospace">STATUS: NOMINAL</text>
        </svg>

        {/* Interactive Orbit Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            ORBIT REGIME:
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['LEO', 'MEO', 'GEO'] as const).map((regime) => (
              <button
                key={regime}
                type="button"
                onClick={() => {
                  sound.playSonar()
                  setOrbit(regime)
                }}
                className="mono"
                style={{
                  fontSize: 9,
                  padding: '2px 8px',
                  borderRadius: 3,
                  border: orbit === regime ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
                  background: orbit === regime ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.04)',
                  color: orbit === regime ? '#00f0ff' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {regime}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>10K+</b> Simulated Orbits</span>
          <span><b>&lt;16ms</b> Frame Budget</span>
          <span><b>99.4%</b> Collision Safety</span>
        </div>
      </div>
    </div>
  )
}

/* 2. PASSIVEAGENT: Telegram Threat Intelligence & Graph Radar */
export function PassiveAgentMock() {
  const [analyzing, setAnalyzing] = useState(false)
  const [similarity, setSimilarity] = useState('0.94')

  const triggerAnalysis = () => {
    sound.playAlert()
    setAnalyzing(true)
    setTimeout(() => {
      setSimilarity('0.994')
      sound.playSuccess()
      setAnalyzing(false)
    }, 900)
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">TELEGRAM OSINT & THREAT GRAPH</span>
        <span className="r">{analyzing ? 'ANALYZING LIVE STREAM...' : 'MTPROTO STREAM // ACTIVE'}</span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Threat Nodes */}
          <line x1="50" y1="70" x2="130" y2="40" stroke={analyzing ? '#f43f5e' : 'rgba(244,63,94,0.4)'} strokeWidth={analyzing ? 2 : 1.2} />
          <line x1="50" y1="70" x2="130" y2="105" stroke={analyzing ? '#f43f5e' : 'rgba(244,63,94,0.4)'} strokeWidth={analyzing ? 2 : 1.2} />
          <line x1="130" y1="40" x2="230" y2="60" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="130" y1="105" x2="230" y2="60" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="230" y1="60" x2="290" y2="75" stroke="#4ade80" strokeWidth="1.5" />
          
          <circle cx="50" cy="70" r="14" fill="#1e1320" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="50" y="73" fill="#f43f5e" fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">TG CHANNEL</text>
          
          <circle cx="130" cy="40" r="12" fill="#101826" stroke="#38bdf8" strokeWidth="1.2" />
          <text x="130" y="43" fill="#38bdf8" fontSize="6.5" textAnchor="middle" fontFamily="ui-monospace, monospace">PGVECTOR</text>
          
          <circle cx="130" cy="105" r="12" fill="#101826" stroke="#38bdf8" strokeWidth="1.2" />
          <text x="130" y="108" fill="#38bdf8" fontSize="6.5" textAnchor="middle" fontFamily="ui-monospace, monospace">NEO4J</text>
          
          <circle cx="230" cy="60" r="15" fill="#1c1917" stroke="#fde68a" strokeWidth="1.5" />
          <text x="230" y="63" fill="#fde68a" fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">LLaMA-3.3</text>
          
          <circle cx="290" cy="75" r="10" fill="#064e3b" stroke="#4ade80" strokeWidth="1.2" />
          <text x="290" y="78" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">MITIGATED</text>
          
          <text x="20" y="22" fill={analyzing ? '#f43f5e' : 'rgba(255,255,255,0.4)'} fontSize="7" fontFamily="ui-monospace, monospace">
            SIMILARITY CLUSTER: {similarity}
          </text>
          <text x="180" y="138" fill="#f43f5e" fontSize="7" fontFamily="ui-monospace, monospace">
            {analyzing ? 'SCANNING PHISHING REPO...' : 'BOTNET SIGNATURE MITIGATED'}
          </text>
        </svg>

        {/* Interactive Ingestion Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            SIMULATE OSINT INGESTION:
          </span>
          <button
            type="button"
            disabled={analyzing}
            onClick={triggerAnalysis}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: '1px solid #f43f5e',
              background: 'rgba(244,63,94,0.12)',
              color: '#f43f5e',
              cursor: analyzing ? 'wait' : 'pointer',
            }}
          >
            {analyzing ? 'INGESTING...' : 'TRIGGER THREAT SCAN'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>50K+</b> Ingested Chats</span>
          <span><b>98.7%</b> Threat Detection</span>
          <span><b>Realtime</b> Graph Ingestion</span>
        </div>
      </div>
    </div>
  )
}

/* 3. EXAMGUARD: Kiosk Fullscreen & Sandbox Watchdog */
export function ExamGuardMock() {
  const [threatBlocked, setThreatBlocked] = useState(false)

  const testThreat = () => {
    sound.playAlert()
    setThreatBlocked(true)
    setTimeout(() => {
      sound.playSuccess()
      setThreatBlocked(false)
    }, 1200)
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">DESKTOP KIOSK DEFENSE</span>
        <span className="r" style={{ color: threatBlocked ? '#f43f5e' : '#4ade80' }}>
          {threatBlocked ? 'EXPLOIT INTERCEPTED' : 'STATE: ENFORCED'}
        </span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#0b0c10', border: threatBlocked ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.08)' }}>
          {/* Frame window */}
          <rect x="15" y="15" width="290" height="120" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="15" y="15" width="290" height="22" fill={threatBlocked ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.04)'} />
          <circle cx="30" cy="26" r="3.5" fill="#f43f5e" />
          <circle cx="42" cy="26" r="3.5" fill="#fde68a" />
          <circle cx="54" cy="26" r="3.5" fill="#4ade80" />
          <text x="70" y="29" fill={threatBlocked ? '#f43f5e' : 'rgba(255,255,255,0.6)'} fontSize="8" fontFamily="ui-monospace, monospace">
            {threatBlocked ? 'KIOSK: DEVTOOLS / SHORTCUT INJECTION BLOCKED' : 'EXAMGUARD // KIOSK MODE ACTIVE'}
          </text>
          
          {/* Security status chips */}
          <rect x="30" y="50" width="125" height="24" rx="3" fill="#131c18" stroke={threatBlocked ? '#f43f5e' : '#4ade80'} strokeWidth="0.8" />
          <text x="38" y="65" fill={threatBlocked ? '#f43f5e' : '#4ade80'} fontSize="7.5" fontFamily="ui-monospace, monospace">
            {threatBlocked ? 'ALT+TAB: TRAPPED' : 'HOOK: WIN32 LOCKED'}
          </text>
          
          <rect x="165" y="50" width="125" height="24" rx="3" fill="#131c18" stroke="#4ade80" strokeWidth="0.8" />
          <text x="173" y="65" fill="#4ade80" fontSize="7.5" fontFamily="ui-monospace, monospace">CLIPBOARD: SHIELDED</text>
          
          <rect x="30" y="85" width="125" height="24" rx="3" fill="#131c18" stroke="#4ade80" strokeWidth="0.8" />
          <text x="38" y="100" fill="#4ade80" fontSize="7.5" fontFamily="ui-monospace, monospace">VM DETECTION: CLEAN</text>
          
          <rect x="165" y="85" width="125" height="24" rx="3" fill="#1c1917" stroke="#fde68a" strokeWidth="0.8" />
          <text x="173" y="100" fill="#fde68a" fontSize="7.5" fontFamily="ui-monospace, monospace">CRYPTO: PBKDF2-SHA256</text>
          
          <text x="30" y="126" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="ui-monospace, monospace">WATCHDOG LATENCY: 0.8MS // ZERO CLOUD LEAK</text>
        </svg>

        {/* Interactive Exploit Test */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            SIMULATE EXAM BYPASS:
          </span>
          <button
            type="button"
            onClick={testThreat}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: '1px solid #4ade80',
              background: 'rgba(74,222,128,0.12)',
              color: '#4ade80',
              cursor: 'pointer',
            }}
          >
            TEST HOOK LOCKDOWN
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>0</b> Bypass Tolerance</span>
          <span><b>100%</b> Offline Capable</span>
          <span><b>256-bit</b> Encryption</span>
        </div>
      </div>
    </div>
  )
}

/* 4. MEDVISION: Offline Edge Computer Vision & MMS-TTS Voice Assist */
export function MedVisionMock() {
  const [obstacle, setObstacle] = useState<'CURB' | 'CROSSWALK' | 'STAIRS'>('CURB')
  const [speechCue, setSpeechCue] = useState(false)

  const obstacleData = {
    CURB: { dist: '1.2M', cue: "DIQQAT: OLDINDA 1.2M PAST TO'SIQ (O'NGGA 15°)", color: '#38bdf8' },
    CROSSWALK: { dist: '4.5M', cue: "PIYODALAR O'TISH JOYI: YASHIL CHORRAHA OCHIQ", color: '#4ade80' },
    STAIRS: { dist: '2.0M', cue: "OGOHLANTIRISH: 5 ZINA PASTGA TUSHISH", color: '#fde68a' },
  }[obstacle]

  const triggerTTS = () => {
    sound.playSuccess()
    setSpeechCue(true)
    setTimeout(() => setSpeechCue(false), 2000)
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">EDGE ASSISTIVE VISION</span>
        <span className="r" style={{ color: speechCue ? '#fde68a' : '#4ade80' }}>
          {speechCue ? 'TTS CUE BROADCASTING...' : 'OFFLINE MMS-TTS VOICE'}
        </span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#0a0d12', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Depth / vision horizon */}
          <line x1="0" y1="100" x2="320" y2="100" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
          
          {/* Active Obstacle Box */}
          <rect x="40" y="60" width="100" height="42" rx="3" fill="none" stroke={obstacleData.color} strokeWidth="1.5" />
          <rect x="40" y="48" width="100" height="12" fill={obstacleData.color} />
          <text x="44" y="57" fill="#000" fontSize="7" fontFamily="ui-monospace, monospace" fontWeight="bold">
            {obstacle} • {obstacleData.dist}
          </text>
          
          {/* Secondary Target */}
          <rect x="200" y="25" width="85" height="55" rx="3" fill="none" stroke="#4ade80" strokeWidth="1.5" />
          <rect x="200" y="13" width="85" height="12" fill="#4ade80" />
          <text x="204" y="22" fill="#000" fontSize="7" fontFamily="ui-monospace, monospace" fontWeight="bold">GREEN LIGHT • 8M</text>
          
          {/* Audio voice wave */}
          <path
            d={speechCue
              ? "M 40 130 Q 60 110 80 130 T 120 130 T 160 130 T 200 130 T 240 130 T 280 130"
              : "M 40 130 Q 70 120 100 130 T 160 130 T 220 130 T 280 130"}
            fill="none"
            stroke="#fde68a"
            strokeWidth={speechCue ? 2.5 : 1.5}
          />
          <text x="35" y="143" fill="#fde68a" fontSize="6.8" fontFamily="ui-monospace, monospace">
            TTS CUE: "{obstacleData.cue}"
          </text>
        </svg>

        {/* Interactive Selector & Voice Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['CURB', 'CROSSWALK', 'STAIRS'] as const).map((obs) => (
              <button
                key={obs}
                type="button"
                onClick={() => {
                  sound.playClick()
                  setObstacle(obs)
                }}
                className="mono"
                style={{
                  fontSize: 9,
                  padding: '2px 8px',
                  borderRadius: 3,
                  border: obstacle === obs ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                  background: obstacle === obs ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
                  color: obstacle === obs ? '#38bdf8' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {obs}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={triggerTTS}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: '1px solid #fde68a',
              background: 'rgba(253,230,138,0.12)',
              color: '#fde68a',
              cursor: 'pointer',
            }}
          >
            PLAY OFFLINE TTS CUE
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>30 FPS</b> Edge Inference</span>
          <span><b>100%</b> Offline Privacy</span>
          <span><b>0.2s</b> Voice Trigger</span>
        </div>
      </div>
    </div>
  )
}

/* 5. FIREDETECT: Autonomous Drone Edge GPU & Fire Recon */
export function FireDetectMock() {
  const [thermalAlarm, setThermalAlarm] = useState(false)

  const toggleAlarm = () => {
    if (!thermalAlarm) {
      sound.playAlert()
      setThermalAlarm(true)
    } else {
      sound.playSuccess()
      setThermalAlarm(false)
    }
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">DRONE FIRE RECONNAISSANCE</span>
        <span className="r" style={{ color: thermalAlarm ? '#f43f5e' : '#4ade80' }}>
          {thermalAlarm ? 'CRITICAL THERMAL ANOMALY' : 'ALT: 42M • JETSON NANO'}
        </span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#0e0b0b', border: thermalAlarm ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.08)' }}>
          {/* Crosshair HUD */}
          <circle cx="160" cy="75" r={thermalAlarm ? 52 : 45} fill="none" stroke={thermalAlarm ? '#f43f5e' : 'rgba(244,63,94,0.3)'} strokeWidth="1.2" strokeDasharray="4 6" />
          <line x1="160" y1="15" x2="160" y2="40" stroke="#f43f5e" strokeWidth="1.5" />
          <line x1="160" y1="110" x2="160" y2="135" stroke="#f43f5e" strokeWidth="1.5" />
          <line x1="95" y1="75" x2="120" y2="75" stroke="#f43f5e" strokeWidth="1.5" />
          <line x1="200" y1="75" x2="225" y2="75" stroke="#f43f5e" strokeWidth="1.5" />
          
          {/* Target flame bounding box */}
          <rect x="130" y="50" width={thermalAlarm ? 60 : 50} height={thermalAlarm ? 50 : 40} rx="3" fill="none" stroke="#f43f5e" strokeWidth={thermalAlarm ? 2.5 : 1.8} />
          <text x="130" y="44" fill="#f43f5e" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="bold">
            FLAME: {thermalAlarm ? '99.9% [SURGE]' : '98.4%'}
          </text>
          
          {/* ESP32 payload status */}
          <rect x="20" y="115" width="135" height="22" rx="3" fill="#1f1113" stroke="#f43f5e" strokeWidth="0.8" />
          <text x="26" y="129" fill="#f43f5e" fontSize="7" fontFamily="ui-monospace, monospace">
            {thermalAlarm ? 'DISPATCH: EXTINGUISHER CMD' : 'ESP32 UART: PAYLOAD READY'}
          </text>
          
          <text x="180" y="129" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="ui-monospace, monospace">
            LATENCY: 45MS (EDGE GPU)
          </text>
        </svg>

        {/* Interactive Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            THERMAL SENSOR INJECTION:
          </span>
          <button
            type="button"
            onClick={toggleAlarm}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: thermalAlarm ? '1px solid #4ade80' : '1px solid #f43f5e',
              background: thermalAlarm ? 'rgba(74,222,128,0.12)' : 'rgba(244,63,94,0.12)',
              color: thermalAlarm ? '#4ade80' : '#f43f5e',
              cursor: 'pointer',
            }}
          >
            {thermalAlarm ? 'RESET PATROL SCAN' : 'SIMULATE WILDFIRE FLARE'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>45ms</b> Inference Latency</span>
          <span><b>98.2%</b> Fire Recall</span>
          <span><b>40m</b> Operational Altitude</span>
        </div>
      </div>
    </div>
  )
}

/* 6. SMARTWATER: Hydraulic Network ML Leak Anomaly Detection */
export function SmartWaterMock() {
  const [leakMode, setLeakMode] = useState(false)

  const toggleLeak = () => {
    if (!leakMode) {
      sound.playAlert()
      setLeakMode(true)
    } else {
      sound.playSuccess()
      setLeakMode(false)
    }
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">HYDRAULIC TELEMETRY RADAR</span>
        <span className="r" style={{ color: leakMode ? '#f43f5e' : '#00f0ff' }}>
          {leakMode ? 'ANOMALOUS DROP INTERCEPTED' : 'KUVASOY GRID // SECTOR-4'}
        </span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#080d14', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Pipe grid */}
          <line x1="30" y1="50" x2="140" y2="50" stroke="#00f0ff" strokeWidth="3" />
          <line x1="140" y1="50" x2="220" y2="90" stroke={leakMode ? '#f43f5e' : '#00f0ff'} strokeWidth="3" strokeDasharray={leakMode ? '3 2' : undefined} />
          <line x1="140" y1="50" x2="140" y2="120" stroke="#00f0ff" strokeWidth="3" />
          <line x1="220" y1="90" x2="290" y2="90" stroke={leakMode ? 'rgba(244,63,94,0.5)' : '#00f0ff'} strokeWidth="2" />
          
          {/* Sensor Nodes */}
          <circle cx="30" cy="50" r="6" fill="#00f0ff" />
          <circle cx="140" cy="50" r="6" fill="#00f0ff" />
          <circle cx="140" cy="120" r="6" fill="#00f0ff" />
          <circle cx="220" cy="90" r={leakMode ? 9 : 6} fill={leakMode ? '#f43f5e' : '#00f0ff'}>
            {leakMode && <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />}
          </circle>
          
          <text x="210" y="80" fill={leakMode ? '#f43f5e' : '#4ade80'} fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="bold">
            {leakMode ? 'FRACTURE DETECTED (97.8%)' : 'FLOW: 4.8 BAR [OPTIMAL]'}
          </text>
          <text x="210" y="93" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="ui-monospace, monospace">
            {leakMode ? 'PRESSURE DROP: -2.4 BAR' : 'HEAD LOSS: NOMINAL 0.1%'}
          </text>
          
          <text x="30" y="32" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="ui-monospace, monospace">
            MODEL: ISOLATION FOREST • 24/7 STREAM
          </text>
        </svg>

        {/* Interactive Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            SIMULATE WATER TELEMETRY:
          </span>
          <button
            type="button"
            onClick={toggleLeak}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: leakMode ? '1px solid #00f0ff' : '1px solid #f43f5e',
              background: leakMode ? 'rgba(0,240,255,0.12)' : 'rgba(244,63,94,0.12)',
              color: leakMode ? '#00f0ff' : '#f43f5e',
              cursor: 'pointer',
            }}
          >
            {leakMode ? 'RESTORE PIPELINE PRESSURE' : 'SIMULATE PIPE RUPTURE'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>93.5%</b> Anomaly Score</span>
          <span><b>2 min</b> Fracture Alert</span>
          <span><b>GIS</b> Hydro-Spatial Grid</span>
        </div>
      </div>
    </div>
  )
}

/* 7. ESHITAMAN: Audio Speech Spectrogram & LLM Summarizer */
export function EshitamanMock() {
  const [pulse, setPulse] = useState(0)

  const regenerate = () => {
    sound.playSuccess()
    setPulse((p) => p + 1)
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">NEURAL AUDIO PIPELINE</span>
        <span className="r">UZBEK ASR & CODE-SWITCH</span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#0c0d12', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Audio spectrogram bars */}
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 14 + Math.sin(i * 0.45 + pulse) * 12 + ((i * 17 + pulse * 23) % 26)
            return (
              <rect
                key={i}
                x={20 + i * 10}
                y={65 - h / 2}
                width="6"
                height={h}
                rx="2"
                fill={i % 3 === 0 ? '#38bdf8' : '#818cf8'}
              />
            )
          })}
          
          <text x="20" y="105" fill="#fde68a" fontSize="8" fontFamily="ui-monospace, monospace">
            TRANSCRIPT: "Hozirgi sun'iy intellekt modeli juda tez ishlamoqda..."
          </text>
          <text x="20" y="122" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="ui-monospace, monospace">
            CONFIDENCE: 95.1% • ZERO-LATENCY WEBSOCKET STREAM
          </text>
          <text x="20" y="136" fill="#4ade80" fontSize="7" fontFamily="ui-monospace, monospace">
            SUMMARY GENERATION: COMPLETE (LLaMA-3)
          </text>
        </svg>

        {/* Interactive Resample */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            AUDIO STREAM WEBSOCKET:
          </span>
          <button
            type="button"
            onClick={regenerate}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: '1px solid #38bdf8',
              background: 'rgba(56,189,248,0.12)',
              color: '#38bdf8',
              cursor: 'pointer',
            }}
          >
            PULSE AUDIO STREAM
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>95.1%</b> Word Accuracy</span>
          <span><b>2x</b> Pipeline Speedup</span>
          <span><b>Uz/Ru</b> Code-Switching</span>
        </div>
      </div>
    </div>
  )
}

/* 8. SMART TRAFFIC & WIUT CV TRACK: Trajectory & Crash Anticipation */
export function SmartTrafficMock() {
  const [brakingActive, setBrakingActive] = useState(false)

  const triggerBraking = () => {
    sound.playAlert()
    setBrakingActive(true)
    setTimeout(() => {
      sound.playSuccess()
    }, 600)
  }

  const resetBraking = () => {
    sound.playClick()
    setBrakingActive(false)
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">CV ACCIDENT ANTICIPATION</span>
        <span className="r" style={{ color: brakingActive ? '#4ade80' : '#f43f5e' }}>
          {brakingActive ? 'DECELERATION ENGAGED: SAFE' : 'YOLO11X + BYTETRACK'}
        </span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#0a0d10', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Road intersection */}
          <line x1="20" y1="75" x2="300" y2="75" stroke="rgba(255,255,255,0.15)" strokeDasharray="6 6" />
          <line x1="160" y1="15" x2="160" y2="135" stroke="rgba(255,255,255,0.15)" strokeDasharray="6 6" />
          
          {/* Vehicle 1 */}
          <rect x={brakingActive ? '50' : '70'} y="60" width="35" height="20" rx="3" fill="#13202e" stroke="#38bdf8" strokeWidth="1.5" />
          <text x={brakingActive ? '53' : '73'} y="55" fill="#38bdf8" fontSize="7" fontFamily="ui-monospace, monospace">
            {brakingActive ? 'CAR #12 [DECEL 12 KM/H]' : 'CAR #12 (42 KM/H)'}
          </text>
          
          {/* Vehicle 2 */}
          <rect x="145" y={brakingActive ? '15' : '25'} width="20" height="30" rx="3" fill="#2d1316" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="170" y="38" fill="#f43f5e" fontSize="7" fontFamily="ui-monospace, monospace">TRUCK #08</text>
          
          {/* Warning / Mitigated Indicator */}
          {brakingActive ? (
            <text x="110" y="115" fill="#4ade80" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="bold">
              STOPPED 2.8M BEFORE INTERSECTION // THREAT CLEARED
            </text>
          ) : (
            <>
              <circle cx="155" cy="70" r="14" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3">
                <animate attributeName="r" values="8;16;8" dur="1s" repeatCount="indefinite" />
              </circle>
              <text x="180" y="74" fill="#f43f5e" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="bold">
                TTC: 1.4s (PRE-WARNING)
              </text>
            </>
          )}
        </svg>

        {/* Interactive Braking Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            CRASH ANTICIPATION SIMULATOR:
          </span>
          <button
            type="button"
            onClick={brakingActive ? resetBraking : triggerBraking}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: brakingActive ? '1px solid #38bdf8' : '1px solid #f43f5e',
              background: brakingActive ? 'rgba(56,189,248,0.12)' : 'rgba(244,63,94,0.12)',
              color: brakingActive ? '#38bdf8' : '#f43f5e',
              cursor: 'pointer',
            }}
          >
            {brakingActive ? 'RESET INTERSECTION' : 'ENGAGE BRAKING INTERVENTION'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>YOLO11x</b> Architecture</span>
          <span><b>96.4%</b> Track Retention</span>
          <span><b>1.4s</b> Collision Pre-warn</span>
        </div>
      </div>
    </div>
  )
}

/* 9. UNIVERSAL CYBERNETIC MOCK (for any repository) */
export function CyberProjectMock({ project }: { project?: Project }) {
  const [pipelineStep, setPipelineStep] = useState<0 | 1 | 2 | 3>(0)
  const title = project?.title ?? 'ACTIVE REPOSITORY'
  const tags = project?.tags ?? ['SYSTEMS', 'ALGORITHMS', 'INNOVATION']

  const advancePipeline = () => {
    sound.playClick()
    const next = ((pipelineStep + 1) % 4) as 0 | 1 | 2 | 3
    setPipelineStep(next)
    if (next === 3) sound.playSuccess()
  }

  return (
    <div className="mock">
      <div className="mock-title">
        <span className="l">{title} // SYSTEM RUNTIME</span>
        <span className="r">STATUS: VERIFIED</span>
      </div>
      <div className="mock-body" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', borderRadius: 6, background: '#090a10', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Top telemetry grid */}
          <rect x="15" y="15" width="290" height="30" rx="3" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
          <text x="25" y="34" fill="#00f0ff" fontSize="8" fontFamily="ui-monospace, monospace">
            SRC: GITHUB.COM/CYBERBAZAUZ
          </text>
          <text x="210" y="34" fill="#4ade80" fontSize="8" fontFamily="ui-monospace, monospace">
            BUILD: PASSING
          </text>
          
          {/* Neural state pipeline */}
          <circle cx="50" cy="85" r="16" fill={pipelineStep >= 1 ? '#0369a1' : '#131c26'} stroke="#38bdf8" strokeWidth={pipelineStep >= 1 ? 2 : 1.2} />
          <text x="50" y="88" fill="#38bdf8" fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">INGEST</text>
          
          <line x1="66" y1="85" x2="135" y2="85" stroke={pipelineStep >= 1 ? '#38bdf8' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
          
          <circle cx="150" cy="85" r="16" fill={pipelineStep >= 2 ? '#9f1239' : '#1e1320'} stroke="#f43f5e" strokeWidth={pipelineStep >= 2 ? 2 : 1.2} />
          <text x="150" y="88" fill="#f43f5e" fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">COMPUTE</text>
          
          <line x1="166" y1="85" x2="235" y2="85" stroke={pipelineStep >= 2 ? '#f43f5e' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
          
          <circle cx="250" cy="85" r="16" fill={pipelineStep === 3 ? '#166534' : '#132418'} stroke="#4ade80" strokeWidth={pipelineStep === 3 ? 2 : 1.2} />
          <text x="250" y="88" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">EXECUTE</text>
          
          {/* Tags preview */}
          <text x="25" y="132" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="ui-monospace, monospace">
            STAGE: {pipelineStep === 0 ? 'IDLE' : pipelineStep === 1 ? 'INGESTING REPO' : pipelineStep === 2 ? 'COMPUTING GRAPH' : 'EXECUTED NOMINAL'} • {tags.slice(0, 2).join(' / ')}
          </text>
        </svg>

        {/* Interactive Pipeline Step */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            PIPELINE STEP:
          </span>
          <button
            type="button"
            onClick={advancePipeline}
            className="mono"
            style={{
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 3,
              border: '1px solid #00f0ff',
              background: 'rgba(0,240,255,0.12)',
              color: '#00f0ff',
              cursor: 'pointer',
            }}
          >
            {pipelineStep === 3 ? 'RESET RUNTIME' : 'EXECUTE NEXT STAGE'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.7)' }}>
          <span><b>Open Source</b> Public Repo</span>
          <span><b>Verified</b> Architecture</span>
          <span><b>Production</b> Grade</span>
        </div>
      </div>
    </div>
  )
}

/* Master Visual Resolver */
export function ProjectVisualRenderer({ visual, project }: { visual: VisualKey; project?: Project }) {
  switch (visual) {
    case 'yotoqhonam':
      return <YotoqhonamMock />
    case 'antifake':
      return <AntifakeMock />
    case 'shieldx':
      return <ShieldxMock />
    case 'sputnik':
      return <SputnikMock />
    case 'passiveagent':
      return <PassiveAgentMock />
    case 'examguard':
      return <ExamGuardMock />
    case 'medvision':
      return <MedVisionMock />
    case 'firedetect':
      return <FireDetectMock />
    case 'smartwater':
      return <SmartWaterMock />
    case 'eshitaman':
      return <EshitamanMock />
    case 'smarttraffic':
    case 'wiutcv':
      return <SmartTrafficMock />
    default:
      return <CyberProjectMock project={project} />
  }
}
