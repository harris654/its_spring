// ══ Variable unique ══════════════════════
const GROW_DURATION = 20; // secondes
// ════════════════════════════════════════

// ── Injection du template SVG ────────────
document.body.insertAdjacentHTML('afterbegin', `
<template id="vine-tpl">
  <div class="vine">
    <svg viewBox="0 0 52 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <path class="vine-stem" d="M26 390 Q22 340 27 300 Q32 255 24 210 Q17 165 27 120 Q35 75 26 30" stroke="#8B7355" stroke-width="1.3" fill="none"/>
      <path class="vine-leaf l1" d="M26 330 Q7 318 5 300 Q17 310 26 330Z" fill="#7a9e7e" opacity="0.72"/>
      <path class="vine-leaf l2" d="M26 290 Q45 278 47 260 Q35 270 26 290Z" fill="#7a9e7e" opacity="0.65"/>
      <path class="vine-leaf l3" d="M26 235 Q8 222 6 205 Q18 215 26 235Z" fill="#7a9e7e" opacity="0.70"/>
      <path class="vine-leaf l4" d="M26 195 Q44 182 46 165 Q34 175 26 195Z" fill="#7a9e7e" opacity="0.62"/>
      <path class="vine-leaf l5" d="M26 145 Q8 132 6 115 Q18 125 26 145Z" fill="#7a9e7e" opacity="0.68"/>
      <path class="vine-leaf l6" d="M26 105 Q44 92 46 75 Q34 85 26 105Z"  fill="#7a9e7e" opacity="0.60"/>
      <g class="vine-flower f1">
        <circle cx="26" cy="360" r="5.5" fill="#e8a0a0" opacity="0.55"/>
        <circle cx="26" cy="360" r="3.3" fill="#d47a7a" opacity="0.80"/>
        <ellipse cx="19" cy="356" rx="5" ry="3" transform="rotate(-30 19 356)" fill="#e8a0a0" opacity="0.52"/>
        <ellipse cx="33" cy="356" rx="5" ry="3" transform="rotate(30 33 356)" fill="#e8a0a0" opacity="0.52"/>
        <ellipse cx="26" cy="350" rx="4.5" ry="3" fill="#e8a0a0" opacity="0.48"/>
        <ellipse cx="14" cy="364" rx="4" ry="2.5" transform="rotate(-50 14 364)" fill="#f0b8b8" opacity="0.42"/>
        <ellipse cx="38" cy="364" rx="4" ry="2.5" transform="rotate(50 38 364)" fill="#f0b8b8" opacity="0.42"/>
      </g>
      <g class="vine-flower f2">
        <path d="M20 168 Q26 156 32 168 Q30 178 26 180 Q22 178 20 168Z" fill="#e8c06a" opacity="0.78"/>
        <path d="M22 168 Q26 162 30 168" stroke="#c8a040" stroke-width="0.8" fill="none" opacity="0.6"/>
      </g>
      <g class="vine-flower f3">
        <circle cx="26" cy="55" r="8"   fill="#d4a0c8" opacity="0.62"/>
        <circle cx="26" cy="55" r="5"   fill="#b87aaa" opacity="0.80"/>
        <ellipse cx="16" cy="49" rx="7" ry="4" transform="rotate(-30 16 49)" fill="#d4a0c8" opacity="0.52"/>
        <ellipse cx="36" cy="49" rx="7" ry="4" transform="rotate(30 36 49)" fill="#d4a0c8" opacity="0.52"/>
        <ellipse cx="26" cy="43" rx="6" ry="4" fill="#d4a0c8" opacity="0.48"/>
        <ellipse cx="14" cy="58" rx="6" ry="3.5" transform="rotate(-50 14 58)" fill="#d4a0c8" opacity="0.42"/>
        <ellipse cx="38" cy="58" rx="6" ry="3.5" transform="rotate(50 38 58)" fill="#d4a0c8" opacity="0.42"/>
      </g>
    </svg>
  </div>
</template>`);

// ── Injection dans tous les .flowers ─────
document.querySelectorAll('.flowers').forEach(el => {
  el.appendChild(document.getElementById('vine-tpl').content.cloneNode(true));
});

// ── Animations ───────────────────────────
function applyVineAnimations() {
  const d = GROW_DURATION;
  const leafDelays   = [d*0.35, d*0.45, d*0.54, d*0.63, d*0.72, d*0.81];
  const flowerDelays = [d*0.85, d*0.92, d*1.00];
  const swayStart    = d + 2;

  document.querySelectorAll('.vine').forEach(vine => {
    vine.querySelectorAll('.vine-stem').forEach(el => {
      el.style.animation = `grow-stem ${d}s ease-in-out forwards`;
    });
    vine.querySelectorAll('.vine-leaf').forEach((el, i) => {
      const ld = leafDelays[i] ?? leafDelays[leafDelays.length - 1];
      el.style.animation =
        `bloom-leaf 0.6s ease-out ${ld}s forwards,` +
        `sway 3.5s ease-in-out ${swayStart + i * 0.2}s infinite`;
    });
    vine.querySelectorAll('.vine-flower').forEach((el, i) => {
      const fd = flowerDelays[i] ?? flowerDelays[flowerDelays.length - 1];
      el.style.animation =
        `bloom-flower 0.8s cubic-bezier(0.34,1.56,0.64,1) ${fd}s forwards,` +
        `float 4s ease-in-out ${swayStart + 1 + i * 0.5}s infinite`;
    });
  });
}

applyVineAnimations();

// ── Feuilles qui tombent ─────────────────
const canvas = document.getElementById('falling-leaves');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    '#7a9e7e','#a8c5a0','#8fb88f',
    '#e8a0a0','#d47a7a','#f0b8b8',
    '#d4a0c8','#b87aaa',
    '#e8c06a','#c8a040',
  ];

  class Leaf {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x        = Math.random() * canvas.width;
      this.y        = init ? Math.random() * -canvas.height : -20;
      this.size     = 6 + Math.random() * 10;
      this.speedY   = 0.4 + Math.random() * 0.8;
      this.speedX   = (Math.random() - 0.5) * 0.6;
      this.angle    = Math.random() * Math.PI * 2;
      this.spin     = (Math.random() - 0.5) * 0.03;
      this.sway     = Math.random() * Math.PI * 2;
      this.swaySpeed= 0.01 + Math.random() * 0.015;
      this.swayAmp  = 0.5 + Math.random() * 1.2;
      this.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity  = 0.25 + Math.random() * 0.35;
    }
    update() {
      this.sway  += this.swaySpeed;
      this.x     += this.speedX + Math.sin(this.sway) * this.swayAmp;
      this.y     += this.speedY;
      this.angle += this.spin;
      if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.38, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(0,  this.size);
      ctx.stroke();
      ctx.restore();
    }
  }

  const COUNT = Math.min(Math.floor(window.innerWidth / 18), 55);
  const leaves = Array.from({ length: COUNT }, () => new Leaf());

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leaves.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(animate);
  })();
}
