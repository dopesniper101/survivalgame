
import React, { useRef, useEffect } from 'react';
import { GameState, Npc } from '../types';
import { MAP_SIZE } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  activeItemId: string | null;
  onAction: (x: number, y: number) => void;
  swingProgress: number;
  isSwimming: boolean;
  velocity: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, activeItemId, onAction, swingProgress, isSwimming, velocity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terrainBufferRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const lerpColor = (c1: [number, number, number], c2: [number, number, number], f: number): [number, number, number] => 
    [Math.round(c1[0] + (c2[0] - c1[0]) * f), Math.round(c1[1] + (c2[1] - c1[1]) * f), Math.round(c1[2] + (c2[2] - c1[2]) * f)];

  const getHeightAt = (x: number, y: number) => {
    const dist = Math.sqrt(Math.pow(x - MAP_SIZE/2, 2) + Math.pow(y - MAP_SIZE/2, 2));
    let h = 1.0 - (dist / (MAP_SIZE * 0.48));
    h += Math.sin(x / 1200) * 0.1 + Math.cos(y / 1200) * 0.1;
    h += Math.sin(x / 400 + y / 500) * 0.05;
    return { height: h };
  };

  const getSmoothBiomeColor = (h: number): [number, number, number] => {
    const colors: [number, number, number][] = [
      [20, 18, 55],    // Deep Water
      [45, 75, 140],   // Water
      [170, 140, 100], // Sand
      [215, 185, 135], // Light Grass/Dirt
      [110, 180, 40],  // Grass
      [20, 45, 20],    // Forest
      [65, 80, 100],   // Rock
      [245, 250, 255]  // Snow
    ];
    
    if (h < 0.08) return lerpColor(colors[0], colors[1], h / 0.08);
    if (h < 0.14) return lerpColor(colors[1], colors[2], (h - 0.08) / 0.06);
    if (h < 0.22) return lerpColor(colors[2], colors[3], (h - 0.14) / 0.08);
    if (h < 0.45) return lerpColor(colors[3], colors[4], (h - 0.22) / 0.23);
    if (h < 0.75) return lerpColor(colors[4], colors[5], (h - 0.45) / 0.30);
    return lerpColor(colors[5], colors[7], (h - 0.75) / 0.25);
  };

  const drawHealthBar = (ctx: CanvasRenderingContext2D, x: number, y: number, health: number, maxHealth: number, width: number = 40) => {
    const height = 4;
    const padding = 2;
    const fullWidth = width;
    const currentWidth = (health / maxHealth) * fullWidth;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x - fullWidth / 2, y, fullWidth, height);

    // Foreground color logic
    const pct = health / maxHealth;
    if (pct > 0.6) ctx.fillStyle = '#22c55e'; // Green
    else if (pct > 0.3) ctx.fillStyle = '#f59e0b'; // Amber
    else ctx.fillStyle = '#ef4444'; // Red

    ctx.fillRect(x - fullWidth / 2, y, currentWidth, height);
  };

  const drawPlayerModel = (ctx: CanvasRenderingContext2D, p: any, isCrouching: boolean, rotation: number, swing: number = 0, itemIcon?: string, verticalOffset: number = 0, swimming: boolean = false) => {
    ctx.save();
    // Submerge player deeper if swimming
    const immersionY = swimming ? 10 : 0;
    ctx.translate(p.x, p.y + verticalOffset + immersionY);
    ctx.rotate(rotation);
    const skin = '#f1c27d'; 
    const shirt = '#334155';
    
    // Shadow (Hidden or blurred if swimming)
    if (!swimming) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(0, -verticalOffset, isCrouching ? 14 : 18, 12, 0, 0, Math.PI*2); ctx.fill();
    }

    // Body
    ctx.fillStyle = shirt;
    ctx.beginPath(); 
    const rx = isCrouching ? 20 : 18;
    const ry = isCrouching ? 15 : 18;
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI*2); ctx.fill();

    const drawArm = (isRight: boolean) => {
      ctx.save();
      const angle = isCrouching ? (isRight ? -0.15 : 0.15) : (isRight ? -0.5 : 0.5);
      const pullIn = isCrouching ? -4 : 0;
      ctx.rotate(angle);
      ctx.fillStyle = skin; ctx.fillRect(16 + pullIn, isRight ? -4 : -8, 10, 8);
      
      if (isRight && itemIcon) {
        ctx.save(); ctx.translate(22 + pullIn, 0); ctx.rotate(swing * 2.5);
        ctx.font = '22px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(itemIcon, 4, 0);
        ctx.restore();
      }
      ctx.restore();
    };
    drawArm(true); drawArm(false);

    // Head
    ctx.fillStyle = skin; 
    ctx.beginPath(); 
    ctx.arc(isCrouching ? 5 : 0, 0, 11, 0, Math.PI*2); 
    ctx.fill();

    // Eyes and Mouth
    const headX = isCrouching ? 5 : 0;
    ctx.fillStyle = '#000';
    // Eyes (dots facing forward)
    ctx.beginPath(); ctx.arc(headX + 5, -3, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(headX + 5, 3, 1.5, 0, Math.PI * 2); ctx.fill();
    // Mouth (small line)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(headX + 8, -2); ctx.lineTo(headX + 8, 2); ctx.stroke();

    ctx.restore();
  };

  const drawNpcModel = (ctx: CanvasRenderingContext2D, npc: Npc) => {
    ctx.save();
    ctx.translate(npc.x, npc.y);
    ctx.rotate(npc.rotation);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2); ctx.fill();

    if (npc.type === 'bear') {
      ctx.fillStyle = '#451a03'; 
      ctx.beginPath(); ctx.ellipse(0, 0, 24, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(20, 0, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(24, -6, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(24, 6, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.fillRect(25, -3, 2, 2); ctx.fillRect(25, 2, 2, 2);
    } 
    else if (npc.type === 'wolf') {
      ctx.fillStyle = '#64748b'; 
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-18, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18, 0, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(20, -5); ctx.lineTo(26, -9); ctx.lineTo(24, -2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(20, 5); ctx.lineTo(26, 9); ctx.lineTo(24, 2); ctx.fill();
      ctx.fillStyle = '#facc15'; ctx.fillRect(22, -2, 2, 2); ctx.fillRect(22, 1, 2, 2);
    } 
    else if (npc.type === 'boar') {
      ctx.fillStyle = '#271b12'; 
      ctx.beginPath(); ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(14, 0, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(18, -6); ctx.lineTo(24, -9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(18, 6); ctx.lineTo(24, 9); ctx.stroke();
    } 
    else if (npc.type === 'chicken') {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-6, -4); ctx.lineTo(-10, 0); ctx.lineTo(-6, 4); ctx.fill();
      ctx.beginPath(); ctx.arc(6, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(6, -4, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(9, -2); ctx.lineTo(13, 0); ctx.lineTo(9, 2); ctx.fill();
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); if (!ctx) return;
    const tCtx = terrainBufferRef.current.getContext('2d', { alpha: false }); if (!tCtx) return;

    let animId: number;
    const render = () => {
      const { player, entities, buildingParts, npcs, dayTime, weather, inventory, settings } = gameState;
      const width = canvas.width; const height = canvas.height;
      const now = Date.now();
      
      const zoom = settings.fov / 90;
      const camX = width / 2 - player.x * zoom; 
      const camY = height / 2 - player.y * zoom;

      let terrainRes = 0.25;
      if (settings.graphicsQuality === 'Low') terrainRes = 0.1;
      else if (settings.graphicsQuality === 'Ultra') terrainRes = 0.5;
      if (settings.performanceMode) terrainRes *= 0.6;

      const bW = Math.ceil(width * terrainRes); const bH = Math.ceil(height * terrainRes);
      if (terrainBufferRef.current.width !== bW) { terrainBufferRef.current.width = bW; terrainBufferRef.current.height = bH; }
      
      const img = tCtx.createImageData(bW, bH);
      for (let j = 0; j < bH; j++) {
        for (let i = 0; i < bW; i++) {
          const worldX = player.x + (i / terrainRes - width / 2) / zoom;
          const worldY = player.y + (j / terrainRes - height / 2) / zoom;
          const stats = getHeightAt(worldX, worldY);
          const c = getSmoothBiomeColor(stats.height);
          const idx = (j * bW + i) * 4;
          img.data[idx] = c[0]; img.data[idx+1] = c[1]; img.data[idx+2] = c[2]; img.data[idx+3] = 255;
        }
      }
      tCtx.putImageData(img, 0, 0);
      ctx.drawImage(terrainBufferRef.current, 0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-player.x, -player.y);

      const viewDistSq = (settings.viewDistance / zoom) ** 2;

      entities.forEach(ent => {
        const dSq = (ent.x - player.x)**2 + (ent.y - player.y)**2;
        if (dSq > viewDistSq) return;
        const sX = ent.x; const sY = ent.y;
        
        if (ent.type === 'tree') { 
          ctx.fillStyle = '#2d1a0a'; ctx.fillRect(sX-5, sY-8, 10, 14); 
          ctx.fillStyle = '#064e3b'; 
          ctx.beginPath(); ctx.moveTo(sX, sY-50); ctx.lineTo(sX-30, sY); ctx.lineTo(sX+30, sY); ctx.fill(); 
          if (ent.health < ent.maxHealth) drawHealthBar(ctx, sX, sY - 60, ent.health, ent.maxHealth, 40);
        } else if (ent.type === 'rock') { 
          ctx.fillStyle = '#52525b'; ctx.beginPath(); ctx.arc(sX, sY, 15, 0, Math.PI*2); ctx.fill(); 
          if (ent.health < ent.maxHealth) drawHealthBar(ctx, sX, sY - 25, ent.health, ent.maxHealth, 30);
        } else if (ent.type === 'ground_wood') { 
          ctx.fillStyle = '#3f2b1d'; ctx.fillRect(sX-10, sY-2, 20, 4); 
        } else if (ent.type === 'ground_stone') { 
          ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(sX, sY, 5, 0, Math.PI*2); ctx.fill(); 
        }
      });

      buildingParts.forEach(bp => {
        const dSq = (bp.x - player.x)**2 + (bp.y - player.y)**2;
        if (dSq > viewDistSq) return;
        ctx.fillStyle = '#3f2b1d';
        if (bp.partType === 'foundation') ctx.fillRect(bp.x-45, bp.y-45, 90, 90);
        else ctx.fillRect(bp.x-45, bp.y-5, 90, 10);
      });

      npcs.forEach(npc => {
        const dSq = (npc.x - player.x)**2 + (npc.y - player.y)**2;
        if (dSq > viewDistSq) return;
        drawNpcModel(ctx, npc);
        
        // NPC Health bars (Always visible)
        let barW = 40;
        let barY = npc.y - 30;
        if (npc.type === 'bear') { barW = 50; barY = npc.y - 40; }
        if (npc.type === 'chicken') { barW = 20; barY = npc.y - 15; }
        drawHealthBar(ctx, npc.x, barY, npc.health, npc.maxHealth, barW);
      });

      // Draw swimming ripples if applicable
      if (isSwimming) {
        ctx.strokeStyle = 'rgba(200, 240, 255, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const t = (now / 1000 + i * 0.5) % 1.5;
          const r = t * 40;
          const alpha = 1 - (t / 1.5);
          ctx.strokeStyle = `rgba(200, 240, 255, ${alpha * 0.5})`;
          ctx.beginPath();
          ctx.ellipse(player.x, player.y, r, r * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();

      const activeItem = inventory.find(i => i.id === activeItemId);
      // Faster, more intense bobbing when swimming
      const bobFreq = isSwimming ? 100 : 150;
      const bobAmp = isSwimming ? 6 : 4;
      const vOffset = (settings.cameraBobEnabled && velocity > 0.1) ? Math.sin(now / bobFreq) * bobAmp : 0;
      
      drawPlayerModel(ctx, { x: width/2, y: height/2 }, player.isCrouching, player.rotation, swingProgress, activeItem?.icon, vOffset, isSwimming);

      // Critical Survival Visual Effects
      if (player.health < 25 || player.hunger < 15 || player.thirst < 15) {
        const intensity = (player.health < 25 ? 0.3 : 0.15) + (Math.sin(now / 200) + 1) * 0.1;
        const gradient = ctx.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width/0.8);
        gradient.addColorStop(0, 'rgba(150, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(180, 0, 0, ${intensity})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      if (weather.type !== 'clear' && settings.weatherEnabled) {
        const density = settings.graphicsQuality === 'Low' ? 30 : (settings.graphicsQuality === 'Ultra' ? 120 : 60);
        ctx.strokeStyle = `rgba(200, 220, 255, ${0.3 * weather.intensity})`; ctx.lineWidth = 1;
        for (let i = 0; i < density; i++) {
          const rx = (i * 137 + now * 1.5) % width; const ry = (i * 211 + now * 5) % height;
          ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 15); ctx.stroke();
        }
      }

      const dayFactor = Math.pow(Math.abs(dayTime - 720) / 720, 2);
      ctx.fillStyle = `rgba(0, 5, 30, ${dayFactor * 0.45})`; ctx.fillRect(0,0,width,height);

      animId = requestAnimationFrame(render);
    };
    render(); return () => cancelAnimationFrame(animId);
  }, [gameState, activeItemId, swingProgress, velocity, isSwimming]);

  useEffect(() => {
    const res = () => { if (canvasRef.current) { canvasRef.current.width = window.innerWidth; canvasRef.current.height = window.innerHeight; } };
    window.addEventListener('resize', res); res(); return () => window.removeEventListener('resize', res);
  }, []);

  return <canvas ref={canvasRef} onMouseDown={(e) => onAction(e.clientX, e.clientY)} className="block w-full h-full cursor-none bg-[#0f172a]" />;
};
export default GameCanvas;
