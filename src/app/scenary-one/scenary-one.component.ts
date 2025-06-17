import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-scenary-one',
  // This tells Angular that the component is self-contained.
  standalone: true,
  // No special imports are needed for the template itself.
  imports: [],
  // These properties link to your external HTML and SCSS files.
  templateUrl: './scenary-one.component.html',
  styleUrl: './scenary-one.component.scss'
})
export class ScenaryOneComponent implements AfterViewInit {
  // --- COMPONENT LOGIC ---
  // The logic remains the same as before.

  @ViewChild('sceneContainer') sceneContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('backgroundCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // Component properties
  rainCount: number = 150;
  butterflyCount: number = 5;
  isControlsOpen = false;
  private sunVisible: boolean = false;


  private ctx!: CanvasRenderingContext2D;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.canvasRef) {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        this.drawScene();
        this.updateElements('.rain', this.rainCount, this.createRaindrop.bind(this));
        this.updateElements('.butterfly', this.butterflyCount, this.createButterfly.bind(this));
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.drawScene();
  }

  onRainSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.rainCount = parseInt(target.value, 10);
    this.updateElements('.rain', this.rainCount, this.createRaindrop.bind(this));
    if (this.rainCount === 0 && !this.sunVisible) {
      this.drawSun();
      this.sunVisible = true;
    } else if (this.rainCount > 0 && this.sunVisible) {
      this.clearSun();
      this.sunVisible = false;
    }
  }
  private clearSun(): void {
    if (!this.ctx) return;
  
    const canvas = this.canvasRef.nativeElement;
    const sunRadius = 40;
    const sunX = canvas.width - sunRadius - 80;
    const sunY = sunRadius + 60;
    const glowRadius = sunRadius * 2.2; // cover entire glow
  
    // Save canvas state
    this.ctx.save();
  
    // Clear circular region with glow buffer
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, glowRadius, 0, Math.PI * 2);
    this.ctx.clip();  // clip to circular region
    this.ctx.clearRect(sunX - glowRadius, sunY - glowRadius, glowRadius * 2, glowRadius * 2);
  
    // Restore canvas state
    this.ctx.restore();
  }
  
  
  onButterflySliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.butterflyCount = parseInt(target.value, 10);
    this.updateElements('.butterfly', this.butterflyCount, this.createButterfly.bind(this));
  }

  private drawScene(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.el.nativeElement.offsetWidth;
    canvas.height = this.el.nativeElement.offsetHeight;
  
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const mountainColors = ['#6B8E23', '#556B2F', '#8FBC8F'];
  
    const hill1Points = this.drawMountainRange(mountainColors[0], 0.85, 200, 20);
    const hill2Points = this.drawMountainRange(mountainColors[1], 0.75, 150, 20);
    const hill3Points = this.drawMountainRange(mountainColors[2], 0.65, 100, 20);
  
    // Plant more trees on closer hills
    // this.plantTreesOnHill(hill3Points, 50);
    // this.plantTreesOnHill(hill2Points, 60);
    this.plantTreesOnHill(hill1Points, 37);
    if(this.rainCount == 0){
      this.drawSun();
    }

  
    console.log('Canvas size:', canvas.width, canvas.height);
  }
  

  
private drawMountainRange(color: string, yRatio: number, roughness: number, segments: number): { x: number, y: number }[] {
  const canvas = this.canvasRef.nativeElement;
  const ctx = this.ctx;

  const gradient = ctx.createLinearGradient(0, canvas.height * yRatio, 0, canvas.height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, '#3a3a3a'); // darker bottom for depth

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(-40, canvas.height);

  const points: { x: number, y: number }[] = [];

  for (let i = 0; i <= segments + 2; i++) {
      const x = ((canvas.width + 80) / segments) * i - 40;
      const y = canvas.height * yRatio - (Math.random() * roughness + roughness / 2);
      points.push({ x, y });

      if (i === 0) {
          ctx.lineTo(x, y);
      } else {
          const prev = points[i - 1];
          const cx = (prev.x + x) / 2;
          const cy = (prev.y + y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      }
  }

  ctx.lineTo(canvas.width + 40, canvas.height);
  ctx.lineTo(-40, canvas.height);
  ctx.closePath();
  ctx.fill();

  return points;
}

private plantTreesOnHill(points: { x: number, y: number }[], treeCount: number): void {
  const canvas = this.canvasRef.nativeElement;

  for (let i = 0; i < treeCount; i++) {
    const randX = Math.random() * canvas.width;
    const segmentWidth = canvas.width / (points.length - 1);
    const segmentIndex = Math.floor(randX / segmentWidth);

    if (segmentIndex < 0 || segmentIndex >= points.length - 1) continue;

    const p1 = points[segmentIndex];
    const p2 = points[segmentIndex + 1];
    const t = (randX - p1.x) / (p2.x - p1.x || 1);
    const curveY = p1.y + (p2.y - p1.y) * t;

    // Define a Y-band BELOW the curve for trees only
    const minY = curveY + 50;                      // trees start 50px below hill curve
    const maxY = Math.min(canvas.height - 20, minY + 80); // up to 80px tall band

    const y = canvas.height - 300 + Math.random() * 300;


    if (y < canvas.height) {
      this.drawTree(randX, y);
    }
  }
}

private drawSun(): void {
  if (!this.ctx) return;
  const canvas = this.canvasRef.nativeElement;

  const sunRadius = 40;
  const sunX = canvas.width - sunRadius - 80;
  const sunY = sunRadius + 60;
  
  

  // Draw sun body
  this.ctx.beginPath();
  this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  this.ctx.fillStyle = '#FFD700'; // golden yellow
  this.ctx.fill();
  this.ctx.closePath();

  // Optional: light glow
  const gradient = this.ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 2);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  this.ctx.beginPath();
  this.ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
  this.ctx.fillStyle = gradient;
  this.ctx.fill();
}




private drawTree(x: number, y: number): void {
  const ctx = this.ctx;
  if (!ctx) return;

  const trunkWidth = 3 + Math.random(); 
  const trunkHeight = 12 + Math.random() * 4;
  const trunkX = x - trunkWidth / 2;
  const trunkY = y - trunkHeight;

  const trunkGradient = ctx.createLinearGradient(trunkX, trunkY, trunkX, y);
  trunkGradient.addColorStop(0, '#7B3F00');
  trunkGradient.addColorStop(1, '#3E2615');
  ctx.fillStyle = trunkGradient;
  ctx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);

  const foliageHeight = 30 + Math.random() * 15;
  const layerCount = 3;
  const layerSpacing = foliageHeight / layerCount;

  const greens = ['#2E8B57', '#1E5631', '#4CAF50', '#3C9D55'];
  ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];

  for (let i = 0; i < layerCount; i++) {
      const layerY = y - trunkHeight - i * layerSpacing;
      const width = 22 - i * 6;
      ctx.beginPath();
      ctx.moveTo(x, layerY - layerSpacing);
      ctx.lineTo(x - width / 2, layerY);
      ctx.lineTo(x + width / 2, layerY);
      ctx.closePath();
      ctx.fill();
  }

  // Soft shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.ellipse(x, y, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();
}



  private updateElements(selector: string, count: number, createFn: () => void): void {
    if (!this.sceneContainerRef) return;
    const existing = this.sceneContainerRef.nativeElement.querySelectorAll(selector);
    let toRemove = existing.length - count;

    for(let i=0; i < toRemove; i++) {
        if (existing[i]) {
            this.renderer.removeChild(this.sceneContainerRef.nativeElement, existing[i]);
        }
    }
    for(let i=0; i < (count - existing.length); i++) {
        createFn();
    }
  }

  private createRaindrop(): void {
    const drop = this.renderer.createElement('div');
    this.renderer.addClass(drop, 'rain');
    this.renderer.setStyle(drop, 'left', `${Math.random() * 105 - 2}vw`);
    this.renderer.setStyle(drop, 'animation-duration', `${0.6 + Math.random() * 0.8}s`);
    this.renderer.setStyle(drop, 'animation-delay', `${Math.random() * 5}s`);
    this.renderer.appendChild(this.sceneContainerRef.nativeElement, drop);
    console.log('Raindrop created');
  }
  
  private createButterfly(): void {
    
    
    const butterfly = this.renderer.createElement('div');
    this.renderer.addClass(butterfly, 'butterfly');

    const hue = 200 + Math.random() * 120; 
    
    butterfly.innerHTML = `
    <svg viewBox="0 0 40 40" style="--wing-color: hsl(${hue}, 90%, 70%); --stroke-color: hsl(${hue}, 80%, 30%);">
        <path class="wing left-wing" fill="var(--wing-color)" stroke="var(--stroke-color)" d="M 20,20 C 0,0 5,40 20,20 Z"></path>
        <path class="wing right-wing" fill="var(--wing-color)" stroke="var(--stroke-color)" d="M 20,20 C 40,0 35,40 20,20 Z"></path>
    </svg>
`;

    
    const flightDuration = 10 + Math.random() * 8;
    const startY = 20 + Math.random() * 50;
    const delay = Math.random() * flightDuration;

    this.renderer.setStyle(butterfly, 'top', `${startY}vh`);
    this.renderer.setStyle(butterfly, 'animation-duration', `${flightDuration.toFixed(2)}s`);
    this.renderer.setStyle(butterfly, 'animation-delay', `-${delay.toFixed(2)}s`);
    
    // this.renderer.setStyle(butterfly, '--wing-color', `hsl(${hue}, 90%, 70%)`);
    // this.renderer.setStyle(butterfly, '--stroke-color', `hsl(${hue}, 80%, 30%)`);
    this.renderer.appendChild(this.sceneContainerRef.nativeElement, butterfly);
    console.log('Butterfly created');
  }
}

