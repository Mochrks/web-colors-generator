import { useEffect, useRef } from "react";
import "../../styles/ColorWheelCanvas.css";

// ─── Simplex-like smooth noise (no deps) ────────────────────
function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}
const P: number[] = [];
for (let i = 0; i < 512; i++) P[i] = Math.floor(Math.random() * 256);
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}
function noise2(x: number, y: number): number {
  const X = Math.floor(x) & 255,
    Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x),
    yf = y - Math.floor(y);
  const u = fade(xf),
    v = fade(yf);
  const a = P[X] + Y,
    b = P[X + 1] + Y;
  return lerp(
    lerp(grad(P[a], xf, yf), grad(P[b], xf - 1, yf), u),
    lerp(grad(P[a + 1], xf, yf - 1), grad(P[b + 1], xf - 1, yf - 1), u),
    v
  );
}

// ─── Blob vertex ────────────────────────────────────────────
interface Blob {
  baseR: number;
  noiseOffset: number;
  noiseSpeed: number;
  hueBase: number;
  hueShift: number;
  alpha: number;
  x: number;
  y: number;
  driftAngle: number;
  driftSpeed: number;
  driftR: number;
}

function makeBlobPath(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  baseR: number,
  tick: number,
  noiseOff: number,
  noiseAmp: number,
  VERTS = 48
) {
  ctx.beginPath();
  for (let i = 0; i <= VERTS; i++) {
    const angle = (i / VERTS) * Math.PI * 2;
    const nx = Math.cos(angle) * 1.3 + noiseOff;
    const ny = Math.sin(angle) * 1.3 + tick * 0.00045;
    const n = noise2(nx, ny);
    const r = baseR + n * noiseAmp;
    const px = bx + Math.cos(angle) * r;
    const py = by + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export default function ColorWheelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Build blobs ───────────────────────────────────────────
    const BLOB_COUNT = 6;
    const blobs: Blob[] = Array.from({ length: BLOB_COUNT }, (_, i) => ({
      baseR: 0.18 + (i % 3) * 0.06, // fraction of min(W,H)
      noiseOffset: i * 7.31,
      noiseSpeed: 0.00008 + i * 0.000025,
      hueBase: (i / BLOB_COUNT) * 360,
      hueShift: 30 + i * 15,
      alpha: 0.22 + (i % 2) * 0.06,
      x: 0.3 + (i % 3) * 0.2, // normalized 0-1
      y: 0.25 + Math.floor(i / 3) * 0.45,
      driftAngle: (i / BLOB_COUNT) * Math.PI * 2,
      driftSpeed: 0.0004 + i * 0.00015,
      driftR: 0.08 + (i % 2) * 0.05,
    }));

    // ── Mouse ────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    // ── Floating specks ──────────────────────────────────────
    const SPECK_COUNT = 38;
    const specks = Array.from({ length: SPECK_COUNT }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.2 + Math.random() * 2.8,
      hue: (i / SPECK_COUNT) * 360,
      speed: 0.00012 + Math.random() * 0.0002,
      angle: Math.random() * Math.PI * 2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // ── Render loop ──────────────────────────────────────────
    const render = () => {
      const t = tickRef.current++;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const S = Math.min(W, H);

      // Clear with very slight trail
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(2,2,2,0.22)";
      ctx.fillRect(0, 0, W, H);

      // ── Draw blobs ─────────────────────────────────────────
      blobs.forEach((b, i) => {
        b.driftAngle += b.driftSpeed;
        const cx = (b.x + Math.cos(b.driftAngle) * b.driftR) * W;
        const cy = (b.y + Math.sin(b.driftAngle * 1.3) * b.driftR) * H;

        // Mouse attraction — subtle
        const mdx = mx - cx,
          mdy = my - cy;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        const pull = md < S * 0.4 ? ((S * 0.4 - md) / (S * 0.4)) * 0.012 : 0;
        const finalCx = cx + mdx * pull;
        const finalCy = cy + mdy * pull;

        const R = b.baseR * S;
        const noiseAmp = R * 0.38;
        const hue = (b.hueBase + t * 0.18 + i * 22) % 360;
        const hue2 = (hue + b.hueShift) % 360;

        // outer glow pass
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = b.alpha * 0.5;
        const gGrad = ctx.createRadialGradient(finalCx, finalCy, 0, finalCx, finalCy, R * 1.9);
        gGrad.addColorStop(0, `hsla(${hue}, 95%, 65%, 0.7)`);
        gGrad.addColorStop(0.5, `hsla(${hue2}, 90%, 55%, 0.25)`);
        gGrad.addColorStop(1, "transparent");
        ctx.fillStyle = gGrad;
        makeBlobPath(ctx, finalCx, finalCy, R * 1.6, t, b.noiseOffset + 10, noiseAmp * 0.6);
        ctx.fill();

        // core fill
        ctx.globalAlpha = b.alpha * 0.9;
        const cGrad = ctx.createRadialGradient(
          finalCx - R * 0.15,
          finalCy - R * 0.1,
          0,
          finalCx,
          finalCy,
          R * 1.05
        );
        cGrad.addColorStop(0, `hsla(${hue}, 100%, 80%, 1)`);
        cGrad.addColorStop(0.45, `hsla(${hue}, 95%, 60%, 0.85)`);
        cGrad.addColorStop(0.8, `hsla(${hue2}, 90%, 45%, 0.55)`);
        cGrad.addColorStop(1, "transparent");
        ctx.fillStyle = cGrad;
        makeBlobPath(ctx, finalCx, finalCy, R, t, b.noiseOffset, noiseAmp);
        ctx.fill();
      });

      // ── Floating specks ────────────────────────────────────
      ctx.globalCompositeOperation = "screen";
      specks.forEach((s) => {
        s.angle += s.speed;
        s.twinkle += 0.04;
        const sx = ((s.x + Math.cos(s.angle) * 0.12) % 1) * W;
        const sy = ((s.y + Math.sin(s.angle * 0.7) * 0.09) % 1) * H;
        const brightness = 0.45 + Math.sin(s.twinkle) * 0.35;
        const hue = (s.hue + t * 0.25) % 360;

        ctx.save();
        ctx.globalAlpha = brightness * 0.8;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = s.r * 5;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 2.5);
        sg.addColorStop(0, `hsl(${hue}, 90%, 92%)`);
        sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── Chromatic lens flare streaks ───────────────────────
      if (t % 3 === 0) {
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.025;
        const fHue = (t * 0.4) % 360;
        const fX = W * (0.3 + 0.4 * Math.sin(t * 0.0007));
        const fY = H * (0.35 + 0.3 * Math.cos(t * 0.0009));
        for (let k = 0; k < 5; k++) {
          const ang = (k / 5) * Math.PI + t * 0.001;
          const len = S * (0.35 + k * 0.05);
          ctx.beginPath();
          ctx.moveTo(fX, fY);
          ctx.lineTo(fX + Math.cos(ang) * len, fY + Math.sin(ang) * len);
          const lg = ctx.createLinearGradient(
            fX,
            fY,
            fX + Math.cos(ang) * len,
            fY + Math.sin(ang) * len
          );
          lg.addColorStop(0, `hsla(${(fHue + k * 30) % 360}, 100%, 80%, 0.9)`);
          lg.addColorStop(1, "transparent");
          ctx.strokeStyle = lg;
          ctx.lineWidth = 1 + k * 0.4;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="color-wheel-wrapper">
      <canvas ref={canvasRef} className="color-wheel-canvas" />
      <div className="color-wheel-badge">
        <span>toneshift</span>
        <span className="dot" />
        <span>chromatic</span>
        <span className="dot" />
        <span>aurora</span>
      </div>
    </div>
  );
}
