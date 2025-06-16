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
    
    const hill1Points = this.drawMountainRange(mountainColors[0], 0.85, 200, 10);
    const hill2Points = this.drawMountainRange(mountainColors[1], 0.75, 150, 15);
    const hill3Points = this.drawMountainRange(mountainColors[2], 0.65, 100, 20);

    for(let i=0; i<30; i++) {
        const randX = Math.random() * canvas.width;
        const hillSegment = Math.floor(randX / (canvas.width / 10));
        if (hillSegment >= hill1Points.length -1) continue;

        const y1 = hill1Points[hillSegment].y;
        const y2 = hill1Points[hillSegment + 1] ? hill1Points[hillSegment + 1].y : y1;
        const x1 = hill1Points[hillSegment].x;
        const x2 = hill1Points[hillSegment + 1] ? hill1Points[hillSegment + 1].x : x1;
        const y = y1 + ((y2 - y1) * ((randX - x1)/(x2 - x1 || 1)));

        if (y < canvas.height) {
             this.drawTree(randX, y - 5);
        }
    }
    console.log('Canvas size:', canvas.width, canvas.height);

  }

  private drawMountainRange(color: string, yRatio: number, roughness: number, segments: number): {x: number, y: number}[] {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(-1, canvas.height);

    let points = [];
    for (let i = 0; i <= segments; i++) {
        const x = (canvas.width / segments) * i;
        const y = (canvas.height * yRatio) - (Math.random() * roughness) + (roughness / 2);
        points.push({x: x, y: y});
        this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(canvas.width + 1, canvas.height);
    this.ctx.closePath();
    this.ctx.fill();
    return points;
  }

  private drawTree(x: number, y: number): void {
      this.ctx.fillStyle = '#1A4314';
      this.ctx.fillRect(x - 2, y - 10, 4, 10);
      
      this.ctx.fillStyle = '#228B22';
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - 50);
      this.ctx.lineTo(x - 15, y - 20);
      this.ctx.lineTo(x + 15, y - 20);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(x, y - 30);
      this.ctx.lineTo(x - 12, y - 10);
      this.ctx.lineTo(x + 12, y - 10);
      this.ctx.closePath();
      this.ctx.fill();
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

