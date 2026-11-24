/* Juara Silat follow CTA. Transparent foreground; draw the new match behind it. */
(function (root) {
  const W = 1080, H = 1920, DURATION = 5.941, RED = '#FF1F1F';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = k => 1 - (1 - clamp(k)) ** 3;
  const hash = n => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
  const easeInOut = k => { k = clamp(k); return k < .5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2; };
  const back = (k, s = 1.7) => { k = clamp(k) - 1; return k * k * ((s + 1) * k + s) + 1; };
  function rounded(X, x, y, w, h, r) {
    X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r);
    X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r);
    X.arcTo(x, y, x + w, y, r); X.closePath();
  }
  function icon(X, kind, x, y) {
    X.save(); X.translate(x, y); X.strokeStyle = '#fff'; X.fillStyle = '#fff';
    X.lineWidth = 4; X.lineCap = 'round'; X.lineJoin = 'round';
    if (kind === 'ig') {
      rounded(X, -19, -19, 38, 38, 11); X.stroke();
      X.beginPath(); X.arc(0, 0, 9, 0, 7); X.stroke();
      X.beginPath(); X.arc(11, -11, 2.6, 0, 7); X.fill();
    } else if (kind === 'tt') {
      X.beginPath(); X.moveTo(4, -20); X.lineTo(4, 9); X.stroke();
      X.beginPath(); X.arc(-5, 10, 9, 0, 7); X.stroke();
      X.beginPath(); X.moveTo(4, -20); X.quadraticCurveTo(8, -8, 19, -7); X.stroke();
    } else {
      X.beginPath(); X.arc(0, 0, 20, 0, 7); X.stroke();
      X.beginPath(); X.ellipse(0, 0, 9, 20, 0, 0, 7); X.stroke();
      X.beginPath(); X.moveTo(-20, 0); X.lineTo(20, 0); X.stroke();
    }
    X.restore();
  }
  function chip(X, x, y, w, h, r) {
    X.save(); rounded(X, x, y, w, h, r); X.fillStyle = 'rgba(10,12,18,.36)'; X.fill();
    rounded(X, x + .75, y + .75, w - 1.5, h - 1.5, r);
    X.lineWidth = 1.5; X.strokeStyle = 'rgba(255,255,255,.2)'; X.stroke(); X.restore();
  }
  function caption(X, t) {
    const cues = [
      { start: .610, end: 1.690, text: 'Kalau kamu suka bedah teknik' },
      { start: 1.690, end: 3.610, text: 'seperti ini, follow Juara Silat.', highlight: 'follow' },
    ];
    const q = cues.find(c => t >= c.start && t < c.end); if (!q) return;
    X.save(); X.globalAlpha = seg(t, q.start, q.start + .08) * (1 - seg(t, q.end - .1, q.end));
    X.textAlign = 'center'; X.textBaseline = 'middle'; let font = 46;
    X.font = `800 ${font}px Jak`; while (X.measureText(q.text).width > 960 && font > 35) { font--; X.font = `800 ${font}px Jak`; }
    if (q.highlight) {
      const p = q.text.indexOf(q.highlight), width = X.measureText(q.text).width;
      const before = X.measureText(q.text.slice(0, p)).width, hw = X.measureText(q.highlight).width;
      const x = W / 2 - width / 2 + before - 6, y = 1518, h = 57;
      const ww = (hw + 12) * ease(seg(t, q.start + .05, q.start + .30)), seed = q.start * 10;
      X.fillStyle = RED; X.beginPath(); X.moveTo(x - 7, y + 8);
      for (let j = 1; j <= 7; j++) X.lineTo(x + ww * j / 7, y + 4 + (hash(seed + j * 2) - .5) * 7);
      X.lineTo(x + ww + 10, y + h * .60);
      for (let j = 7; j >= 0; j--) X.lineTo(x + ww * j / 7 - 9, y + h - 3 + (hash(seed + j * 3) - .5) * 7);
      X.closePath(); X.fill();
    }
    X.fillStyle = '#fff'; X.shadowColor = 'rgba(0,0,0,.78)'; X.shadowBlur = 7; X.shadowOffsetY = 2;
    X.lineWidth = 3; X.strokeStyle = 'rgba(0,0,0,.25)'; X.strokeText(q.text, W / 2, 1548); X.fillText(q.text, W / 2, 1548);
    X.restore();
  }
  function drawBackground(X, image, t) {
    if (!image) return;
    X.save(); X.filter = 'blur(26px) saturate(1.1)';
    X.drawImage(image, -80, -60, W + 160, H + 120); X.restore();
  }
  function drawForeground(X, t, logo, options = {}) {
    const handle = options.handle || '@juarasilat', site = options.site || 'juarasilat.com';
    const out = seg(t, DURATION - .35, DURATION);
    X.save(); X.fillStyle = `rgba(8,8,12,${lerp(.25, .58, ease(seg(t, 0, .5)))})`; X.fillRect(0, 0, W, H);
    let g = X.createRadialGradient(W / 2, 700, 40, W / 2, 700, 620);
    g.addColorStop(0, 'rgba(255,31,31,.22)'); g.addColorStop(1, 'rgba(255,31,31,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
    const tap = options.tap ?? 2.511, after = seg(t, tap + .12, tap + .4);
    const ka = back(seg(t, .15, .6), 1.6), R = 172;
    if (ka > 0) {
      X.save(); X.translate(W / 2, 690); X.scale(ka, ka);
      X.beginPath(); X.arc(0, 0, R, 0, 7); X.fillStyle = '#fff';
      X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 40; X.fill(); X.shadowBlur = 0;
      if (logo) { const h = 262, w = h * logo.width / logo.height; X.drawImage(logo, -w / 2 + 6, -h / 2 + 2, w, h); }
      X.lineWidth = 8; X.strokeStyle = RED; X.beginPath();
      X.arc(0, 0, R + 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ease(seg(t, .35, 1.1))); X.stroke();
      const bk = back(seg(t, .7, 1), 2);
      if (bk > 0) {
        X.save(); X.translate(0, R + 4); X.scale(bk, bk);
        X.beginPath(); X.arc(0, 0, 36, 0, 7); X.fillStyle = after > .5 ? '#fff' : RED; X.fill();
        X.lineWidth = 6; X.strokeStyle = 'rgba(14,14,18,.9)'; X.stroke();
        X.lineWidth = 7; X.lineCap = 'round'; X.strokeStyle = after > .5 ? RED : '#fff'; X.beginPath();
        if (after > .5) { X.moveTo(-13, 1); X.lineTo(-3, 11); X.lineTo(15, -10); }
        else { X.moveTo(-14, 0); X.lineTo(14, 0); X.moveTo(0, -14); X.lineTo(0, 14); }
        X.stroke(); X.restore();
      }
      X.restore();
    }
    const kb = ease(seg(t, .55, .95));
    if (kb > 0) {
      const press = 1 - .06 * Math.sin(Math.PI * seg(t, tap - .02, tap + .2));
      const bw = lerp(400, 470, after), bh = 108, bx = W / 2 - bw / 2, by = 960;
      X.save(); X.globalAlpha = kb; X.translate(W / 2, by + bh / 2); X.scale(press, press); X.translate(-W / 2, -(by + bh / 2));
      rounded(X, bx, by, bw, bh, bh / 2);
      if (after < 1) { X.fillStyle = RED; X.globalAlpha = kb * (1 - after); X.shadowColor = 'rgba(255,31,31,.55)'; X.shadowBlur = 30; X.fill(); X.shadowBlur = 0; }
      X.globalAlpha = kb * after; X.fillStyle = 'rgba(255,255,255,.14)'; X.fill();
      X.lineWidth = 2.5; X.strokeStyle = 'rgba(255,255,255,.55)'; X.stroke();
      X.globalAlpha = kb; X.fillStyle = '#fff'; X.font = '800 48px Jak'; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.fillText(after > .5 ? '✓  Following' : '+  Follow', W / 2, by + bh / 2 + 2); X.restore();
      const rk = seg(t, tap, tap + .55);
      if (rk > 0 && rk < 1) { X.save(); X.beginPath(); X.arc(W / 2 + 60, by + bh / 2, 30 + 200 * ease(rk), 0, 7); X.fillStyle = `rgba(255,255,255,${.35 * (1 - rk)})`; X.fill(); X.restore(); }
    }
    [['ig', handle], ['tt', handle]].forEach(([ic, h], i) => {
      const kc = ease(seg(t, 1 + i * .15, 1.4 + i * .15)); if (kc <= 0) return;
      const w = 400, hh = 92, x = W / 2 - w - 12 + i * (w + 24), y = 1150 + (1 - kc) * 20;
      X.save(); X.globalAlpha = kc; chip(X, x, y, w, hh, 46); icon(X, ic, x + 52, y + hh / 2);
      X.fillStyle = '#fff'; X.font = '800 38px Jak'; X.textBaseline = 'middle'; X.fillText(h, x + 96, y + hh / 2 + 2); X.restore();
    });
    const kw = ease(seg(t, 1.4, 1.8));
    if (kw > 0) { X.save(); X.globalAlpha = kw; icon(X, 'web', W / 2 - 170, 1328); X.fillStyle = 'rgba(255,255,255,.92)'; X.font = '700 44px Cond'; X.letterSpacing = '2px'; X.textBaseline = 'middle'; X.fillText(site, W / 2 - 128, 1330); X.restore(); }
    if (options.captions !== false) caption(X, t);
    if (out > 0) { X.fillStyle = `rgba(0,0,0,${easeInOut(out)})`; X.fillRect(0, 0, W, H); }
    X.restore();
  }
  root.JuaraSilatFollowCTA = { width: W, height: H, duration: DURATION, drawBackground, drawForeground };
})(typeof window !== 'undefined' ? window : globalThis);
