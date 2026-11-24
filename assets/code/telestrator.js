/* Canvas drawing primitives for Juara Silat 1080 × 1920 Sports Telestrator. */
export const COLORS = { brand: '#FF1F1F', athlete: '#FFC21A', opponent: '#3FA9FF', target: '#FF3B30' };
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => 1 - (1 - clamp(k)) ** 3;

export function highlighter(ctx, x, y, width, height, progress = 1, color = COLORS.brand) {
  if (progress <= 0) return;
  const w = width * ease(progress);
  ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = .95;
  ctx.beginPath(); ctx.moveTo(x - 7, y + 8);
  for (let i = 1; i <= 7; i++) ctx.lineTo(x + w * i / 7, y + 4 + 2 * Math.sin(i * 2.1));
  ctx.lineTo(x + w + 10, y + height * .60);
  for (let i = 7; i >= 0; i--) ctx.lineTo(x + w * i / 7 - 9, y + height - 3 + 2 * Math.sin(i * 2.8));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

export function ring(ctx, x, y, radius, progress = 1, color = COLORS.athlete, flatten = .32) {
  if (progress <= 0) return;
  ctx.save(); ctx.globalAlpha = ease(progress);
  ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.ellipse(x, y, radius, radius * flatten, 0, 0, 7); ctx.stroke();
  ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.strokeStyle = color; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(x, y, radius, radius * flatten, 0, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * ease(progress)); ctx.stroke();
  ctx.restore();
}

export function arrow(ctx, x1, y1, x2, y2, progress = 1, color = COLORS.athlete) {
  if (progress <= 0) return;
  const x = x1 + (x2 - x1) * ease(progress), y = y1 + (y2 - y1) * ease(progress);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x, y);
  ctx.strokeStyle = 'rgba(0,0,0,.58)'; ctx.lineWidth = 15; ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.shadowColor = color; ctx.shadowBlur = 13; ctx.stroke();
  if (progress > .9) {
    const angle = Math.atan2(y - y1, x - x1);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x - 31 * Math.cos(angle - .53), y - 31 * Math.sin(angle - .53));
    ctx.lineTo(x - 31 * Math.cos(angle + .53), y - 31 * Math.sin(angle + .53)); ctx.fill();
  }
  ctx.restore();
}

export function glassCard(ctx, x, y, width, height, radius = 18) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = 'rgba(10,12,18,.38)'; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
