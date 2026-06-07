import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GiftReveal — full-screen canvas overlay with animated gift scenes.
 * Each gift has a living illustration. Tap anywhere to dismiss.
 */
export default function GiftReveal({ giftType, inkAccent = '#7c4a1e', onDismiss }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss && onDismiss(), 500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(DPR, DPR);
    };
    resize();

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const sparkles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.4,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.003,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    // ── CANDLE ───────────────────────────────────────────────────────────
    const drawCandle = (t) => {
      const cx = W() / 2, cy = H() / 2;
      ctx.clearRect(0, 0, W(), H());

      const roomBg = ctx.createRadialGradient(cx, cy + 80, 20, cx, cy + 80, Math.max(W(), H()) * 0.85);
      roomBg.addColorStop(0, 'rgba(60,28,8,1)');
      roomBg.addColorStop(0.3, 'rgba(30,12,4,1)');
      roomBg.addColorStop(1, 'rgba(6,3,2,1)');
      ctx.fillStyle = roomBg; ctx.fillRect(0, 0, W(), H());

      const candleX = cx, candleY = cy + 80;
      const cW = 44, cH = 130;
      const candleGrad = ctx.createLinearGradient(candleX - cW/2, 0, candleX + cW/2, 0);
      candleGrad.addColorStop(0, '#e8d4a0'); candleGrad.addColorStop(0.3, '#fff8e8');
      candleGrad.addColorStop(0.7, '#f0e0a8'); candleGrad.addColorStop(1, '#c8b870');
      ctx.fillStyle = candleGrad;
      ctx.beginPath(); ctx.roundRect(candleX - cW/2, candleY - cH, cW, cH, 4); ctx.fill();

      [[-10, 0.4], [8, 0.7], [15, 0.2]].forEach(([ox, phase]) => {
        const dripH = 18 + Math.sin(t * 0.02 + phase * 10) * 3;
        ctx.fillStyle = '#fff0cc';
        ctx.beginPath(); ctx.ellipse(candleX + ox, candleY - cH + 8, 5, dripH, 0, 0, Math.PI * 2); ctx.fill();
      });

      ctx.strokeStyle = '#2a1a08'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(candleX, candleY - cH);
      ctx.quadraticCurveTo(candleX + 3, candleY - cH - 14, candleX + 1, candleY - cH - 22);
      ctx.stroke();

      ctx.fillStyle = '#c8b870';
      ctx.beginPath(); ctx.ellipse(candleX, candleY + 2, cW * 0.7, 10, 0, 0, Math.PI * 2); ctx.fill();

      const flameX = candleX + Math.sin(t * 0.04) * 3;
      const flameY = candleY - cH - 22;
      const flicker = Math.sin(t * 0.13) * 0.18 + Math.sin(t * 0.07) * 0.09;
      const flameH = 70 + flicker * 22;
      const flameW = 22 + Math.sin(t * 0.09) * 4;

      const flamePath = (scaleX, scaleY, color, alpha) => {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(flameX, flameY + 8);
        ctx.bezierCurveTo(flameX - flameW * scaleX, flameY - flameH * 0.3 * scaleY, flameX - flameW * 0.5 * scaleX, flameY - flameH * 0.85 * scaleY, flameX, flameY - flameH * scaleY);
        ctx.bezierCurveTo(flameX + flameW * 0.5 * scaleX, flameY - flameH * 0.85 * scaleY, flameX + flameW * scaleX, flameY - flameH * 0.3 * scaleY, flameX, flameY + 8);
        ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      };
      flamePath(1.0, 1.0, '#ff4400', 0.9); flamePath(0.75, 0.88, '#ff8c00', 0.95);
      flamePath(0.5, 0.72, '#ffcc00', 1.0); flamePath(0.28, 0.5, '#fff5a0', 1.0);
      flamePath(0.15, 0.3, '#ffffff', 0.9);

      const flameGlow = ctx.createRadialGradient(flameX, flameY - flameH * 0.4, 0, flameX, flameY - flameH * 0.3, 120);
      flameGlow.addColorStop(0, `rgba(255,180,20,${0.35 + flicker * 0.15})`);
      flameGlow.addColorStop(0.4, `rgba(255,100,0,${0.15 + flicker * 0.08})`);
      flameGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flameGlow; ctx.beginPath(); ctx.arc(flameX, flameY - flameH * 0.3, 120, 0, Math.PI * 2); ctx.fill();

      const floorGlow = ctx.createRadialGradient(cx, H() * 0.85, 0, cx, H() * 0.85, 180);
      floorGlow.addColorStop(0, `rgba(255,140,10,${0.18 + flicker * 0.08})`);
      floorGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = floorGlow; ctx.fillRect(0, 0, W(), H());

      sparkles.forEach((s, i) => {
        s.a += s.speed;
        const px = flameX + Math.sin(s.a * 3 + i) * (30 + i % 20);
        const py = flameY - flameH - (((t * 0.8 + i * 40) % (H() * 0.6)));
        const fade = 1 - (((t * 0.8 + i * 40) % (H() * 0.6)) / (H() * 0.6));
        if (fade < 0.02) return;
        ctx.globalAlpha = fade * 0.8;
        ctx.fillStyle = i % 3 === 0 ? '#ffcc44' : i % 3 === 1 ? '#ff8800' : '#ff4400';
        ctx.beginPath(); ctx.arc(px, py, s.r * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      });

      ctx.font = 'italic 28px "EB Garamond", Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,220,140,0.75)'; ctx.fillText('Candlelight', cx, cy + 170);
      ctx.font = '11px "Courier Prime", monospace'; ctx.fillStyle = 'rgba(255,200,100,0.4)';
      ctx.fillText('A FLICKERING FLAME FOR YOUR NIGHT', cx, cy + 196); ctx.textAlign = 'left';
    };

    // ── MOON JAR ─────────────────────────────────────────────────────────
    const drawMoonjar = (t) => {
      const cx = W() / 2, cy = H() / 2;
      ctx.clearRect(0, 0, W(), H());

      const nightBg = ctx.createRadialGradient(cx, cy - 60, 0, cx, cy, Math.max(W(), H()) * 0.9);
      nightBg.addColorStop(0, 'rgba(14,18,50,1)'); nightBg.addColorStop(0.5, 'rgba(6,8,28,1)'); nightBg.addColorStop(1, 'rgba(2,2,10,1)');
      ctx.fillStyle = nightBg; ctx.fillRect(0, 0, W(), H());

      const moonX = cx + 40, moonY = cy - 100, moonR = 55;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 3);
      moonGlow.addColorStop(0, 'rgba(200,220,255,0.4)'); moonGlow.addColorStop(0.5, 'rgba(150,170,230,0.12)'); moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = moonGlow; ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8f0ff'; ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(180,200,240,0.3)';
      ctx.beginPath(); ctx.arc(moonX + 12, moonY - 8, 16, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(moonX - 15, moonY + 18, 10, 0, Math.PI * 2); ctx.fill();

      const jarY = cy + 30, jarW = 80, jarH = 110;
      ctx.save();
      const jarGrad = ctx.createLinearGradient(cx - jarW/2, 0, cx + jarW/2, 0);
      jarGrad.addColorStop(0, 'rgba(180,210,255,0.12)'); jarGrad.addColorStop(0.3, 'rgba(220,240,255,0.25)');
      jarGrad.addColorStop(0.7, 'rgba(200,230,255,0.18)'); jarGrad.addColorStop(1, 'rgba(150,190,240,0.10)');
      ctx.fillStyle = jarGrad; ctx.strokeStyle = 'rgba(180,220,255,0.55)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - jarW/2 + 10, jarY - jarH);
      ctx.quadraticCurveTo(cx - jarW/2 - 5, jarY - jarH/2, cx - jarW/2 + 5, jarY);
      ctx.quadraticCurveTo(cx, jarY + 12, cx + jarW/2 - 5, jarY);
      ctx.quadraticCurveTo(cx + jarW/2 + 5, jarY - jarH/2, cx + jarW/2 - 10, jarY - jarH);
      ctx.fill(); ctx.stroke(); ctx.restore();

      ctx.fillStyle = 'rgba(200,230,255,0.2)'; ctx.strokeStyle = 'rgba(180,220,255,0.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(cx - 22, jarY - jarH - 22, 44, 24, 4); ctx.fill(); ctx.stroke();

      const pulse = Math.sin(t * 0.03) * 0.5 + 0.5;
      const swirl = ctx.createRadialGradient(cx, jarY - jarH/2, 0, cx, jarY - jarH/2, jarW * 0.6);
      swirl.addColorStop(0, `rgba(200,230,255,${0.35 + pulse * 0.25})`);
      swirl.addColorStop(0.5, `rgba(150,190,240,${0.12 + pulse * 0.1})`); swirl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = swirl; ctx.beginPath(); ctx.ellipse(cx, jarY - jarH/2, jarW * 0.45, jarH * 0.45, 0, 0, Math.PI * 2); ctx.fill();

      sparkles.slice(0, 28).forEach((s, i) => {
        s.a += s.speed * 0.5;
        const angle = s.a + i * 0.8;
        const radius = (10 + i * 2.5) % (jarW * 0.38);
        const sx = cx + Math.cos(angle) * radius;
        const sy = (jarY - jarH/2) + Math.sin(angle) * radius * 0.55;
        const fa = Math.sin(t * 0.05 + i) * 0.5 + 0.5;
        ctx.globalAlpha = fa * 0.85; ctx.fillStyle = '#d0e8ff';
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      });

      sparkles.slice(28).forEach((s, i) => {
        s.a += s.speed * 0.4;
        const fa = Math.sin(s.a) * 0.4 + 0.6;
        ctx.globalAlpha = fa * 0.6; ctx.fillStyle = '#c8e0ff';
        ctx.beginPath(); ctx.arc(s.x * W() / 1000, s.y * H() / 1000, s.r * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      });

      ctx.font = 'italic 28px "EB Garamond", Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(180,220,255,0.8)'; ctx.fillText('Moon Jar', cx, jarY + 60);
      ctx.font = '11px "Courier Prime", monospace'; ctx.fillStyle = 'rgba(150,190,240,0.45)';
      ctx.fillText('MOONLIGHT CAUGHT IN GLASS', cx, jarY + 84); ctx.textAlign = 'left';
    };

    // ── PRESSED ROSE ─────────────────────────────────────────────────────
    const drawRose = (t) => {
      const cx = W() / 2, cy = H() / 2 - 20;
      ctx.clearRect(0, 0, W(), H());

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W(), H()) * 0.8);
      bg.addColorStop(0, 'rgba(45,10,20,1)'); bg.addColorStop(0.4, 'rgba(25,6,12,1)'); bg.addColorStop(1, 'rgba(8,2,6,1)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W(), H());

      const petalColors = ['#c01848', '#e02060', '#ff4488', '#ff7aaa', '#ffaac8', '#ffd0e0'];
      const layers = [
        { count: 8, r: 95, size: 55, angleOff: 0 }, { count: 7, r: 65, size: 46, angleOff: 0.4 },
        { count: 6, r: 40, size: 36, angleOff: 0.2 }, { count: 5, r: 22, size: 26, angleOff: 0.6 },
        { count: 4, r: 10, size: 18, angleOff: 0.1 },
      ];

      layers.forEach((layer, li) => {
        for (let i = 0; i < layer.count; i++) {
          const angle = (i / layer.count) * Math.PI * 2 + layer.angleOff + t * 0.004 * (li % 2 === 0 ? 1 : -1);
          const px = cx + Math.cos(angle) * layer.r;
          const py = cy + Math.sin(angle) * layer.r * 0.75;
          const breathe = 1 + Math.sin(t * 0.04 + li + i) * 0.04;
          ctx.save(); ctx.translate(px, py); ctx.rotate(angle + Math.PI / 2); ctx.scale(breathe, breathe);
          const petalGrad = ctx.createRadialGradient(0, -layer.size * 0.3, 0, 0, 0, layer.size);
          petalGrad.addColorStop(0, petalColors[Math.min(li + 1, 5)] + 'ff');
          petalGrad.addColorStop(0.6, petalColors[li] + 'ee'); petalGrad.addColorStop(1, petalColors[li] + '88');
          ctx.fillStyle = petalGrad;
          ctx.beginPath(); ctx.ellipse(0, -layer.size * 0.4, layer.size * 0.38, layer.size * 0.72, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = petalColors[Math.min(li + 1, 5)] + '60'; ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -layer.size * 0.85); ctx.stroke();
          ctx.restore();
        }
      });

      const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      cGrad.addColorStop(0, '#ffe0ec'); cGrad.addColorStop(0.5, '#ff4488'); cGrad.addColorStop(1, '#c01848');
      ctx.fillStyle = cGrad; ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.fill();

      sparkles.slice(0, 20).forEach((s, i) => {
        s.a += s.speed * 0.4;
        const px = ((cx - 200 + i * 50 + Math.sin(s.a + i) * 30) + W()) % W();
        const py = ((cy - 100 + i * 35 + t * 0.4 + i * 12) % (H() + 60)) - 40;
        ctx.save(); ctx.translate(px, py); ctx.rotate(s.a * 2); ctx.globalAlpha = 0.55;
        ctx.fillStyle = petalColors[i % petalColors.length];
        ctx.beginPath(); ctx.ellipse(0, 0, 5, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
      });

      ctx.strokeStyle = '#2a5a20'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx + 2, cy + 100); ctx.quadraticCurveTo(cx + 30, cy + 160, cx + 15, cy + 220); ctx.stroke();
      ctx.fillStyle = '#3a7a28'; ctx.beginPath(); ctx.ellipse(cx + 22, cy + 155, 18, 9, 0.7, 0, Math.PI * 2); ctx.fill();

      ctx.font = 'italic 28px "EB Garamond", Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,160,190,0.85)'; ctx.fillText('Pressed Rose', cx, cy + 260);
      ctx.font = '11px "Courier Prime", monospace'; ctx.fillStyle = 'rgba(255,100,150,0.4)';
      ctx.fillText('A ROSE SEALED BETWEEN PAGES', cx, cy + 284); ctx.textAlign = 'left';
    };

    // ── CONSTELLATION ─────────────────────────────────────────────────────
    const starMap = Array.from({ length: 22 }, () => ({
      x: 0.1 + Math.random() * 0.8, y: 0.1 + Math.random() * 0.65,
      r: 2 + Math.random() * 3.5, phase: Math.random() * Math.PI * 2,
    }));
    const starLinks = [[0,1],[1,2],[2,3],[3,4],[4,0],[2,5],[5,6],[1,7],[7,8]];

    const drawConstellations = (t) => {
      const cxC = W() / 2, cyC = H() / 2;
      ctx.clearRect(0, 0, W(), H());

      const spBg = ctx.createRadialGradient(cxC, cyC, 0, cxC, cyC, Math.max(W(), H()) * 0.9);
      spBg.addColorStop(0, 'rgba(8,6,28,1)'); spBg.addColorStop(0.5, 'rgba(4,3,16,1)'); spBg.addColorStop(1, 'rgba(1,1,6,1)');
      ctx.fillStyle = spBg; ctx.fillRect(0, 0, W(), H());

      for (let i = 0; i < 300; i++) {
        const bx = (i * 7919) % W(), by = (i * 1337) % H();
        const ba = Math.sin(t * 0.02 + i) * 0.4 + 0.6;
        ctx.globalAlpha = ba * 0.5; ctx.fillStyle = '#c8d8ff';
        ctx.beginPath(); ctx.arc(bx, by, 0.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      const sxp = (p) => W() * 0.12 + p.x * W() * 0.76;
      const syp = (p) => H() * 0.12 + p.y * H() * 0.58;

      starLinks.forEach(([a, b]) => {
        const la = Math.sin(t * 0.025) * 0.3 + 0.5;
        ctx.globalAlpha = la * 0.55; ctx.strokeStyle = '#aac8ff'; ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath(); ctx.moveTo(sxp(starMap[a]), syp(starMap[a])); ctx.lineTo(sxp(starMap[b]), syp(starMap[b]));
        ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      });

      starMap.forEach((s, i) => {
        s.phase += 0.018 + i * 0.002;
        const pulse = Math.sin(s.phase) * 0.35 + 0.65;
        const X = sxp(s), Y = syp(s), dr = s.r * (1 + pulse * 0.4);
        const sg = ctx.createRadialGradient(X, Y, 0, X, Y, dr * 8);
        const col = i % 4 === 0 ? 'rgba(255,220,120,' : i % 4 === 1 ? 'rgba(150,200,255,' : i % 4 === 2 ? 'rgba(200,170,255,' : 'rgba(255,255,255,';
        sg.addColorStop(0, col + (pulse * 0.7) + ')'); sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(X, Y, dr * 8, 0, Math.PI * 2); ctx.fill();
        const starColor = i % 4 === 0 ? '#ffe080' : i % 4 === 1 ? '#90c8ff' : i % 4 === 2 ? '#cc99ff' : '#ffffff';
        ctx.fillStyle = starColor; ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const a1 = j / 4 * Math.PI * 2, a2 = a1 + Math.PI / 4;
          ctx.lineTo(X + Math.cos(a1) * dr * 2.2, Y + Math.sin(a1) * dr * 2.2);
          ctx.lineTo(X + Math.cos(a2) * dr * 0.7, Y + Math.sin(a2) * dr * 0.7);
        }
        ctx.closePath(); ctx.fill();
      });

      const period = 240, phase2 = t % period;
      if (phase2 < 90) {
        const prog = phase2 / 90, sx2 = W() * 0.9 - prog * W() * 0.8, sy2 = H() * 0.1 + prog * H() * 0.3;
        const grad = ctx.createLinearGradient(sx2 + 80, sy2 - 80, sx2, sy2);
        grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(1, 'rgba(255,255,255,0.85)');
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(sx2 + 80, sy2 - 80); ctx.lineTo(sx2, sy2); ctx.stroke();
      }

      ctx.font = 'italic 28px "EB Garamond", Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(180,210,255,0.85)'; ctx.fillText('Constellation', W()/2, H() * 0.85);
      ctx.font = '11px "Courier Prime", monospace'; ctx.fillStyle = 'rgba(140,180,255,0.4)';
      ctx.fillText('STARS NAMED JUST FOR YOU', W()/2, H() * 0.85 + 24); ctx.textAlign = 'left';
    };

    // ── INK & QUILL ───────────────────────────────────────────────────────
    const inkDrops = Array.from({ length: 24 }, (_, i) => ({
      x: 0.15 + Math.random() * 0.7, y: Math.random(), speed: 0.003 + Math.random() * 0.005,
      size: 3 + Math.random() * 5, col: ['#2255ee','#3399ff','#0044cc','#66aaff','#0077dd'][i % 5],
      phase: Math.random() * Math.PI * 2,
    }));

    const drawInkwell = (t) => {
      const cx = W() / 2, cy = H() / 2;
      ctx.clearRect(0, 0, W(), H());

      const bg = ctx.createLinearGradient(0, 0, 0, H());
      bg.addColorStop(0, 'rgba(10,8,20,1)'); bg.addColorStop(0.5, 'rgba(6,5,15,1)'); bg.addColorStop(1, 'rgba(14,10,24,1)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W(), H());

      inkDrops.forEach((d) => {
        const dx = d.x * W(), dy = ((d.y + t * d.speed) % 1) * H();
        const alpha = Math.sin(t * 0.03 + d.phase) * 0.3 + 0.4;
        ctx.globalAlpha = alpha * 0.5; ctx.fillStyle = d.col;
        ctx.beginPath(); ctx.arc(dx, dy, d.size, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(dx + 12, dy + 4, d.size * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      });

      const bX = cx - 30, bY = cy + 10;
      const bottleGrad = ctx.createLinearGradient(bX - 30, 0, bX + 30, 0);
      bottleGrad.addColorStop(0, 'rgba(40,60,120,0.9)'); bottleGrad.addColorStop(0.4, 'rgba(80,120,200,0.85)'); bottleGrad.addColorStop(1, 'rgba(30,50,100,0.9)');
      ctx.fillStyle = bottleGrad; ctx.strokeStyle = 'rgba(100,160,255,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bX - 28, bY - 80); ctx.quadraticCurveTo(bX - 38, bY - 30, bX - 32, bY + 5);
      ctx.quadraticCurveTo(bX, bY + 18, bX + 32, bY + 5); ctx.quadraticCurveTo(bX + 38, bY - 30, bX + 28, bY - 80);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = 'rgba(60,90,160,0.9)';
      ctx.beginPath(); ctx.roundRect(bX - 12, bY - 105, 24, 28, 3); ctx.fill(); ctx.stroke();

      const inkFill = ctx.createLinearGradient(0, bY - 35, 0, bY + 5);
      inkFill.addColorStop(0, '#2255ee'); inkFill.addColorStop(0.5, '#0033aa'); inkFill.addColorStop(1, '#001166');
      ctx.fillStyle = inkFill;
      ctx.beginPath();
      ctx.moveTo(bX - 28, bY - 35); ctx.quadraticCurveTo(bX - 38, bY - 30, bX - 32, bY + 5);
      ctx.quadraticCurveTo(bX, bY + 18, bX + 32, bY + 5); ctx.quadraticCurveTo(bX + 38, bY - 30, bX + 28, bY - 35);
      ctx.fill();

      ctx.fillStyle = 'rgba(100,160,255,0.25)';
      ctx.beginPath(); ctx.ellipse(bX, bY - 35 + Math.sin(t * 0.05) * 3, 24, 5, 0, 0, Math.PI * 2); ctx.fill();

      const qX = cx + 60, qY = cy - 60;
      ctx.save(); ctx.translate(qX, qY); ctx.rotate(-0.6);
      const featherColors = ['#f5e8c0','#ede0a8','#e5d090','#f8f0d0'];
      for (let i = 0; i < 8; i++) {
        const fy = -i * 14, fw = 18 - i * 1.5, fa = Math.sin(t * 0.06 + i * 0.5) * 0.04;
        ctx.save(); ctx.rotate(fa);
        ctx.fillStyle = featherColors[i % 4]; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.ellipse(-fw * 0.3, fy, fw, 7, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = featherColors[(i+1) % 4];
        ctx.beginPath(); ctx.ellipse(fw * 0.3, fy, fw, 7, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#8a6a30'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -110); ctx.stroke();
      ctx.fillStyle = '#c8a020';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-5, 10); ctx.lineTo(5, 10); ctx.closePath(); ctx.fill();

      const dripLen = (Math.sin(t * 0.04) * 0.5 + 0.5) * 20;
      const dripGrad = ctx.createLinearGradient(0, 10, 0, 10 + dripLen);
      dripGrad.addColorStop(0, '#2255ee'); dripGrad.addColorStop(1, '#2255ee00');
      ctx.strokeStyle = dripGrad; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, 10 + dripLen); ctx.stroke();
      ctx.restore();

      const lineProgress = (t % 200) / 200;
      ctx.strokeStyle = 'rgba(80,140,255,0.6)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx - 140, cy + 130); ctx.lineTo(cx - 140 + lineProgress * 280, cy + 130); ctx.stroke();

      ctx.font = 'italic 28px "EB Garamond", Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(120,180,255,0.85)'; ctx.fillText('Ink & Quill', cx, cy + 180);
      ctx.font = '11px "Courier Prime", monospace'; ctx.fillStyle = 'rgba(80,140,220,0.45)';
      ctx.fillText('TOOLS FOR TIMELESS WORDS', cx, cy + 204); ctx.textAlign = 'left';
    };

    // ── HOURGLASS ─────────────────────────────────────────────────────────
    const sandParticles = Array.from({ length: 80 }, (_, i) => ({
      x: (Math.random() - 0.5) * 60, y: -50 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.5, vy: 0.5 + Math.random() * 1.2,
      r: 1.5 + Math.random() * 2.5, col: ['#ffcc44','#ffaa22','#dd8800','#ffee88','#cc7700'][i % 5],
    }));

    const drawHourglass = (t) => {
      const cx = W() / 2, cy = H() / 2;
      ctx.clearRect(0, 0, W(), H());

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W(),H()) * 0.9);
      bg.addColorStop(0, 'rgba(28,18,6,1)'); bg.addColorStop(0.5, 'rgba(16,10,3,1)'); bg.addColorStop(1, 'rgba(4,3,1,1)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W(), H());

      const hgH = 170, hgW = 80;
      ctx.strokeStyle = 'rgba(232,190,100,0.7)'; ctx.lineWidth = 2.5; ctx.fillStyle = 'rgba(255,200,80,0.06)';
      ctx.beginPath();
      ctx.moveTo(cx - hgW, cy - hgH/2 - 10); ctx.lineTo(cx + hgW, cy - hgH/2 - 10);
      ctx.lineTo(cx + 6, cy); ctx.lineTo(cx + hgW, cy + hgH/2 + 10);
      ctx.lineTo(cx - hgW, cy + hgH/2 + 10); ctx.lineTo(cx - 6, cy); ctx.closePath();
      ctx.fill(); ctx.stroke();

      [[cy - hgH/2 - 14], [cy + hgH/2 + 14]].forEach(([y]) => {
        ctx.fillStyle = 'rgba(232,190,100,0.8)';
        ctx.beginPath(); ctx.roundRect(cx - hgW - 8, y - 5, (hgW + 8) * 2, 10, 5); ctx.fill();
      });

      const topSandProg = 1 - (t % 400) / 400;
      if (topSandProg > 0.02) {
        const tSandY = cy - hgH/2 - 8 + (1 - topSandProg) * (hgH/2 - 10);
        const halfW = (1 - (tSandY - (cy - hgH/2 - 8)) / (hgH/2)) * hgW;
        const sandGrad = ctx.createLinearGradient(0, tSandY, 0, cy - 12);
        sandGrad.addColorStop(0, '#ffdd88'); sandGrad.addColorStop(0.5, '#ffaa22'); sandGrad.addColorStop(1, '#cc7700');
        ctx.fillStyle = sandGrad;
        ctx.beginPath(); ctx.moveTo(cx - halfW, tSandY); ctx.lineTo(cx + halfW, tSandY); ctx.lineTo(cx + 6, cy - 12); ctx.lineTo(cx - 6, cy - 12); ctx.closePath(); ctx.fill();
      }

      const streamAlpha = 0.6 + Math.sin(t * 0.06) * 0.2;
      const streamGrad = ctx.createLinearGradient(0, cy - 14, 0, cy + 14);
      streamGrad.addColorStop(0, `rgba(255,200,60,${streamAlpha})`); streamGrad.addColorStop(1, `rgba(255,150,20,${streamAlpha})`);
      ctx.fillStyle = streamGrad;
      ctx.beginPath(); ctx.ellipse(cx, cy, 3 + Math.sin(t * 0.08) * 1, 14, 0, 0, Math.PI * 2); ctx.fill();

      const botSandProg = (t % 400) / 400;
      if (botSandProg > 0.02) {
        const bSandH = botSandProg * (hgH/2 - 12);
        const bTopY = cy + hgH/2 + 8 - bSandH;
        const bHalfW = (bSandH / (hgH/2)) * hgW;
        const bGrad = ctx.createLinearGradient(0, bTopY, 0, cy + hgH/2 + 8);
        bGrad.addColorStop(0, '#ffdd88cc'); bGrad.addColorStop(0.4, '#ffaa22'); bGrad.addColorStop(1, '#cc7700');
        ctx.fillStyle = bGrad;
        ctx.beginPath(); ctx.moveTo(cx - 6, cy + 12); ctx.lineTo(cx + 6, cy + 12);
        ctx.lineTo(cx + bHalfW, bTopY + bSandH); ctx.lineTo(cx + bHalfW, cy + hgH/2 + 8);
        ctx.lineTo(cx - bHalfW, cy + hgH/2 + 8); ctx.lineTo(cx - bHalfW, bTopY + bSandH); ctx.closePath(); ctx.fill();
      }

      sandParticles.forEach((p) => {
        p.y += p.vy; p.x += p.vx;
        if (p.y > hgH/2 * botSandProg + 10) { p.y = -5 + Math.random() * 8; p.x = (Math.random() - 0.5) * 8; p.vx = (Math.random() - 0.5) * 0.5; }
        const px = cx + p.x, py = cy + p.y;
        const fa = Math.max(0, 1 - Math.abs(p.x) / 8);
        ctx.globalAlpha = fa * 0.85; ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      });

      ctx.font = 'italic 28px "EB Garamond", Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,200,80,0.85)'; ctx.fillText('Hourglass', cx, cy + hgH/2 + 60);
      ctx.font = '11px "Courier Prime", monospace'; ctx.fillStyle = 'rgba(220,160,40,0.45)';
      ctx.fillText('TIME, BOTTLED AND GIVEN', cx, cy + hgH/2 + 84); ctx.textAlign = 'left';
    };

    const drawFn = {
      candle: drawCandle, moonjar: drawMoonjar, pressedrose: drawRose,
      constellation: drawConstellations, inkwell: drawInkwell, hourglass: drawHourglass,
    }[giftType] || drawConstellations;

    const animate = () => {
      tRef.current++;
      drawFn(tRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [giftType, inkAccent, visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={dismiss}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
        style={{ position: 'absolute', bottom: 48, fontFamily: "'Courier Prime', monospace", fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', pointerEvents: 'none' }}
      >
        tap anywhere to continue
      </motion.div>
    </motion.div>
  );
}