/* Juara Silat shared style: telestrator marks and the type system.
 * These are the owner's house look and must be reused, never redrawn per film:
 * circles are perfect circles, highlighter blocks fade with their word, cards are dark glass.
 * Bind it to a canvas once, then call the returned helpers exactly as before:
 *   const { ring, loop, zone, dot, spot, marker, wob, bez, shadowText, stabilo, rrect, glass } =
 *     JuaraSilatStyle.bind({ X, C, W, H, RED, COL, eo, hash, clamp, lerp });
 */
(function (root) {
  function bind(env) {
    const { X, C, W, H, RED, COL, eo, hash, clamp, lerp } = env;
    // —— telestrator marks (kept from v1: the owner liked them) ——
    function wob(pts, amp, seed) { return pts.map((p, i) => { if (i === 0 || i === pts.length - 1) return p; const n = (hash(seed + i * 3.1) - .5) * 2 * amp; return [p[0] + n, p[1] + n * .6]; }); }
    function bez(a, c, b, n = 28) { const o = []; for (let i = 0; i <= n; i++) { const u = i / n; o.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]]); } return o; }
    function plen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
    function partial(pts, k) {
      const L = plen(pts) * clamp(k); const o = [pts[0]]; let acc = 0;
      for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (acc + d >= L) { const u = (L - acc) / (d || 1); o.push([lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]); return o; } acc += d; o.push(pts[i]); }
      return o;
    }
    function path(pts) { X.beginPath(); X.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) X.lineTo(pts[i][0], pts[i][1]); }
    function marker(pts, k, col, w = 9, o = {}) {
      if (k <= 0) return; const p = partial(pts, k); if (p.length < 2) return;
      X.save(); X.lineCap = 'round'; X.lineJoin = 'round'; if (o.dash) X.setLineDash(o.dash);
      X.globalAlpha = o.alpha ?? 1;
      path(p); X.strokeStyle = 'rgba(0,0,0,0.5)'; X.lineWidth = w + 6; X.stroke();
      X.shadowColor = col; X.shadowBlur = 16; path(p); X.strokeStyle = col; X.lineWidth = w; X.stroke();
      X.shadowBlur = 0; path(p); X.strokeStyle = 'rgba(255,255,255,0.5)'; X.lineWidth = Math.max(2, w * .26); X.stroke(); X.setLineDash([]);
      if (o.arrow && k > .9) {
        const a = p[p.length - 1], b = p[Math.max(0, p.length - 4)], ang = Math.atan2(a[1] - b[1], a[0] - b[0]), s = w * 3.1 * eo(seg(k, .9, 1));
        X.translate(a[0], a[1]); X.rotate(ang);
        X.beginPath(); X.moveTo(s * .4, 0); X.lineTo(-s, -s * .62); X.lineTo(-s * .62, 0); X.lineTo(-s, s * .62); X.closePath();
        X.lineWidth = 6; X.strokeStyle = 'rgba(0,0,0,0.5)'; X.stroke(); X.shadowColor = col; X.shadowBlur = 14; X.fillStyle = col; X.fill();
      }
      X.restore();
    }
    function ring(x, y, r, col, k = 1, t = 0, o = {}) {
      if (k <= 0) return; const ry = r;   // perfect circle: the owner wants rings round, not squashed
      X.save(); X.globalAlpha = o.alpha ?? 1;
      if (o.beam) {
        const g = X.createLinearGradient(x, y - r * 3.4, x, y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, col + '50');
        X.globalAlpha *= k * .85; X.fillStyle = g; X.beginPath(); X.moveTo(x - r * .55, y - r * 3.4); X.lineTo(x + r * .55, y - r * 3.4); X.lineTo(x + r, y); X.lineTo(x - r, y); X.closePath(); X.fill(); X.globalAlpha = o.alpha ?? 1;
      }
      X.beginPath(); X.ellipse(x, y, r * eo(k), ry * eo(k), 0, 0, Math.PI * 2); X.fillStyle = col + '2e'; X.fill();
      X.lineWidth = 10; X.strokeStyle = 'rgba(0,0,0,0.45)'; X.beginPath(); X.ellipse(x, y, r, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * eo(k)); X.stroke();
      X.shadowColor = col; X.shadowBlur = 14; X.lineWidth = 5.5; X.strokeStyle = col; X.stroke(); X.shadowBlur = 0;
      X.setLineDash([14, 12]); X.lineDashOffset = -t * 50; X.lineWidth = 2.5; X.globalAlpha *= .8 * k; X.beginPath(); X.ellipse(x, y, r * 1.3, ry * 1.3, 0, 0, Math.PI * 2); X.stroke();
      X.restore();
    }
    function loop(cx, cy, rx, ry, k, col, w = 8, seed = 1) {
      const c = []; for (let i = 0; i <= 44; i++) { const u = i / 44 * Math.PI * 2.12 - 2.3; c.push([cx + Math.cos(u) * rx, cy + Math.sin(u) * ry]); }
      marker(wob(c, 3, seed), k, col, w);
    }
    function zone(cx, cy, rx, ry, k, t, col = COL.zone, fill = .3) {
      if (k <= 0) return; X.save();
      X.globalAlpha = fill * k; X.fillStyle = col; X.beginPath(); X.ellipse(cx, cy, rx * eo(k), ry * eo(k), 0, 0, Math.PI * 2); X.fill();
      X.globalAlpha = k; X.setLineDash([16, 11]); X.lineDashOffset = -t * 40; X.lineWidth = 4; X.strokeStyle = col; X.shadowColor = col; X.shadowBlur = 10;
      X.beginPath(); X.ellipse(cx, cy, rx * eo(k), ry * eo(k), 0, 0, Math.PI * 2); X.stroke(); X.restore();
    }
    function dot(x, y, col, k) { if (k <= 0) return; X.save(); X.globalAlpha = k; X.beginPath(); X.arc(x, y, 9 * eo(k), 0, 7); X.fillStyle = col; X.shadowColor = col; X.shadowBlur = 12; X.fill(); X.lineWidth = 3; X.strokeStyle = '#fff'; X.stroke(); X.restore(); }
    function spot(cx, cy, rx, ry, k) {
      if (k <= 0) return; X.save();
      const g = X.createRadialGradient(cx, cy, Math.min(rx, ry) * .7, cx, cy, Math.max(rx, ry) * 1.45);
      // the vignette is constant: easing it in makes a one-frame brightness pop at every cut
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.42)');
      X.fillStyle = g; X.fillRect(0, 0, W, H); X.restore();
    }

    // —— type system: no black boxes. Text with shadow, glass cards, red highlighter ——
    function shadowText(str, x, y, o = {}) {
      X.save(); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = o.blur ?? 14; X.shadowOffsetY = o.oy ?? 3;
      if (o.stroke) { X.lineWidth = o.stroke; X.strokeStyle = 'rgba(0,0,0,0.28)'; X.strokeText(str, x, y); }
      X.fillText(str, x, y); X.restore();
    }
    function stabilo(x, y, w, h, k, col = RED, seed = 1, alpha = .95) {     // hand-swiped highlighter behind text (x, y = top-left)
      if (k <= 0) return; const ww = w * eo(k), sk = h * .18;
      // globalAlpha is multiplied, not overwritten: the block must fade with its word, never outlive it
      X.save(); X.globalAlpha *= alpha; X.fillStyle = col;
      X.beginPath();
      X.moveTo(x - 6 + (hash(seed) - .5) * 6, y + 4 + (hash(seed + 1) - .5) * 5);
      for (let i = 1; i <= 6; i++) X.lineTo(x - 6 + ww * i / 6 + sk * .2, y + 2 + (hash(seed + i * 2.3) - .5) * 7);
      X.lineTo(x + ww + sk * .4, y + h * .55 + (hash(seed + 9) - .5) * 6);
      for (let i = 6; i >= 0; i--) X.lineTo(x - 10 + ww * i / 6 - sk * .3, y + h - 2 + (hash(seed + i * 3.7) - .5) * 7);
      X.closePath(); X.fill(); X.restore();
    }
    function rrect(x, y, w, h, r) { X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r); X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); }
    function glass(x, y, w, h, r = 18, a = 1) {
      X.save(); X.globalAlpha = a;
      // dark card, not a milky one: less blur, a deep fill, and no white sheen on top
      rrect(x, y, w, h, r); X.save(); X.clip(); X.filter = 'blur(9px)'; X.drawImage(C, x, y, w, h, x, y, w, h); X.filter = 'none';
      X.fillStyle = 'rgba(7,10,15,0.68)'; X.fillRect(x, y, w, h);
      const g = X.createLinearGradient(x, y, x, y + h); g.addColorStop(0, 'rgba(255,255,255,0.045)'); g.addColorStop(1, 'rgba(0,0,0,0.12)'); X.fillStyle = g; X.fillRect(x, y, w, h);
      X.restore(); rrect(x + .75, y + .75, w - 1.5, h - 1.5, r); X.lineWidth = 1.5; X.strokeStyle = 'rgba(255,255,255,0.16)'; X.stroke(); X.restore();
    }

    return { wob, bez, plen, partial, marker, ring, loop, zone, dot, spot, shadowText, stabilo, rrect, glass };
  }
  root.JuaraSilatStyle = { bind, TOKENS: {
    chapterMarkBottomY: 321,      // a label card must start below this
    cardTier1Y: 372, cardTier2Y: 500, cardMinY: 356,
    subtitleY: 1548, subtitleSize: 46,
    ringPerfectCircle: true,
    grade: { brightness: 1, contrast: 1, saturate: 1, freezeBrightness: 0, freezeContrast: 0, freezeSaturate: 0 },
    transitionFlashes: false,
  } };
})(typeof window !== 'undefined' ? window : globalThis);
