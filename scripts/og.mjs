import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(here, '..', 'public', 'og-image.png')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #080808; color: #f5f5f5;
    font-family: 'Segoe UI', Arial, sans-serif;
    position: relative;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(245,245,245,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,245,245,0.05) 1px, transparent 1px);
    background-size: 96px 96px;
    mask-image: radial-gradient(100% 90% at 65% 40%, black, transparent 85%);
    -webkit-mask-image: radial-gradient(100% 90% at 65% 40%, black, transparent 85%);
  }
  .glow {
    position: absolute; right: 60px; top: 80px;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(77,124,255,0.22), transparent 62%);
  }
  .core { position: absolute; right: 130px; top: 140px; width: 360px; height: 360px; }
  .num { position: absolute; left: 64px; top: 60px; font-size: 18px; letter-spacing: 6px; color: #7d7d7d; }
  .num b { color: #4d7cff; font-weight: 600; }
  .name { position: absolute; left: 56px; bottom: 200px; font-size: 128px; font-weight: 800; letter-spacing: -4px; line-height: 1; }
  .roles { position: absolute; left: 60px; bottom: 150px; font-size: 20px; letter-spacing: 5px; color: #7d7d7d; }
  .strip { position: absolute; left: 60px; bottom: 78px; width: 620px; height: 1px; background: rgba(245,245,245,0.2); }
  .tag { position: absolute; left: 60px; bottom: 46px; font-size: 15px; letter-spacing: 4px; text-transform: uppercase; color: #7d7d7d; }
  .tag b { color: #f5f5f5; font-weight: 500; }
  .lv { position: absolute; right: 60px; bottom: 46px; font-size: 13px; letter-spacing: 3px; color: #4d7cff; }
  .dash { color: #4d7cff; }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="glow"></div>
  <svg class="core" viewBox="-110 -110 220 220" fill="none">
    <g opacity="0.5">
      <polygon points="0,-92 76,-46 76,46 0,92 -76,46 -76,-46" stroke="#f5f5f5" stroke-width="1.4"/>
      <polygon points="0,-64 56,-32 56,32 0,64 -56,32 -56,-32" stroke="#f5f5f5" stroke-width="1"/>
    </g>
    <g>
      <polygon points="0,-78 66,-39 58,32 -42,66 -64,-20" stroke="#4d7cff" stroke-width="1.6"/>
      <polygon points="0,-44 32,-22 26,22 -26,22 -32,-22" fill="rgba(77,124,255,0.22)" stroke="#4d7cff" stroke-width="1.4"/>
      <circle cx="0" cy="-8" r="6" fill="#4d7cff"/>
    </g>
    <g stroke="#f5f5f5" stroke-width="1">
      <ellipse cx="0" cy="0" rx="98" ry="30" opacity="0.28"/>
      <ellipse cx="0" cy="0" rx="98" ry="20" opacity="0.18" transform="rotate(60)"/>
      <ellipse cx="0" cy="0" rx="98" ry="20" opacity="0.18" transform="rotate(-60)"/>
    </g>
  </svg>
  <div class="num"><b>I/M</b>&nbsp;&nbsp;PORTFOLIO / {YEAR}</div>
  <div class="name">ISLOMBEK</div>
  <div class="roles">AI ENGINEER · SOFTWARE · CYBERSECURITY</div>
  <div class="strip"></div>
  <div class="tag">BUILDING WHAT SEEMED <b>IMPOSSIBLE</b> — AI MAKES IT REAL</div>
  <div class="lv">cyberbazauz.github.io</div>
</body>
</html>`

const year = new Date().getFullYear()
const card = html.replace('{YEAR}', String(year))

const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({
  viewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
})
await page.setContent(card, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: out, type: 'png' })

await browser.close()
console.log('wrote', out)