import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class VisualizerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audioFile', { static: true }) audioFileRef!: ElementRef<HTMLInputElement>;

  private ctx!: CanvasRenderingContext2D;
  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private bufferLength!: number;
  private audio!: HTMLAudioElement;
  private audioSource!: MediaElementAudioSourceNode;

  public isPlaying = false;
  public audioLoaded = false;
  selectedFileName = '';
  public choseFile = true;
  public currentTime = 0;
  public duration = 0;

  // Particles
  private particlesArray: Particle[] = [];
  private numberOfParticles = 100;
  private colorPalette = ['#FF6B6B', '#4ECDC4', '#C7F464', '#FFE66D', '#FF9F1C'];

  playlistId = '5W9YOseBdX1xOoLA8tppEh';

  circumference = 2 * Math.PI * 90; // r = 90 from SVG
  playlistUrl: SafeResourceUrl;

  // --- MOBILE DETECTION FLAG ---
  public isMobile = false;

  maxChars = 3

  // --- TWINKLING STARS ---
  // private twinkleStars: TwinkleStar[] = [];
  private twinkleCount = 7;

  constructor(private sanitizer: DomSanitizer) {
    const url = `https://open.spotify.com/embed/playlist/${this.playlistId}?utm_source=generator&theme=1&autoplay=1`;
    this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // --- DETECT MOBILE BASED ON WINDOW WIDTH ---
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 600;
  }

  truncateFilename(name: string, maxLength: number): string {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength - 3) + '...';
  }
  
  onFileChange(event: Event) {
    const fileInput = this.audioFileRef.nativeElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFileName = file.name;
      const fileURL = URL.createObjectURL(file);

      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = '';
      }

      this.audio = new Audio(fileURL);
      this.audio.addEventListener('timeupdate', () => this.updateProgress());
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration;
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.audioLoaded = true;
        this.choseFile = true;
        this.currentTime = 0;
      });

      this.setupAudioContext();
      this.audioLoaded = true;
      this.choseFile = true;
    }
  }

  togglePlayPause() {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.choseFile = true;
      this.audio.pause();
    } else {
      this.choseFile = false;
      this.audio.play();
      this.animate();
    }

    this.isPlaying = !this.isPlaying;
  }

  updateProgress() {
    this.currentTime = this.audio.currentTime;
  }

  seekAudio(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.audio.currentTime = parseFloat(inputElement.value);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngAfterViewInit() {
    this.setupCanvas();
    this.checkIfMobile(); // Set isMobile flag first
    this.numberOfParticles = this.isMobile ? 37 : 100; // Set correct particle count
    this.initParticles();
    // this.initTwinkleStars();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    // window.addEventListener('resize', this.handleResizeTwinkleStars.bind(this));
    this.animate();
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setupAudioContext() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.audioSource = this.audioContext.createMediaElementSource(this.audio);
    this.audioSource.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.analyser) return;
    this.analyser.getByteFrequencyData(this.dataArray);

    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // --- ONLY DRAW VISUALIZER IF NOT MOBILE ---
    if (!this.isMobile) {
      this.drawAudioVisualizer();
    }

    // --- ALWAYS DRAW PARTICLES ---
    this.updateParticles(this.dataArray);

    // --- DRAW TWINKLING STARS ---
    // this.updateTwinkleStars();
  }

  drawAudioVisualizer() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const barCount = this.bufferLength / 2;
    const barWidth = width / barCount;
    const barHeightScale = height / 256;
    const bassThreshold = 500;

    for (let i = 0; i < barCount; i++) {
      let barHeight = this.dataArray[i] * barHeightScale;
      if (this.dataArray[i] < bassThreshold) {
        barHeight = (this.dataArray[i] / bassThreshold) * height;
      }
      const hue1 = Math.random() * 360;
      const hue2 = (hue1 + 120) % 360;
      const hue3 = (hue1 + 240) % 360;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `hsl(${hue1}, 100%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${hue2}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue3}, 100%, 50%)`);
      ctx.fillStyle = gradient;

      const reverseIndex = barCount - 1 - i;

      // Top
      ctx.beginPath();
      ctx.moveTo(reverseIndex * barWidth, 0);
      ctx.lineTo(reverseIndex * barWidth + barWidth, 0);
      ctx.lineTo(reverseIndex * barWidth + barWidth / 2, barHeight);
      ctx.closePath();
      ctx.fill();

      // Bottom
      ctx.beginPath();
      ctx.moveTo(i * barWidth, height);
      ctx.lineTo(i * barWidth + barWidth, height);
      ctx.lineTo(i * barWidth + barWidth / 2, height - barHeight);
      ctx.closePath();
      ctx.fill();

      // Left
      ctx.beginPath();
      ctx.moveTo(0, i * barWidth);
      ctx.lineTo(0, i * barWidth + barWidth);
      ctx.lineTo(barHeight, i * barWidth + barWidth / 2);
      ctx.closePath();
      ctx.fill();

      // Right
      ctx.beginPath();
      ctx.moveTo(width, reverseIndex * barWidth);
      ctx.lineTo(width, reverseIndex * barWidth + barWidth);
      ctx.lineTo(width - barHeight, reverseIndex * barWidth + barWidth / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  updateParticles(frequencyData: Uint8Array) {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    this.particlesArray.forEach(particle => {
      particle.update(frequencyData, this.isPlaying);
      particle.draw(ctx);
    });
  }

  private initParticles() {
    const canvas = this.canvasRef.nativeElement;
    this.particlesArray = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray.push(new Particle(canvas));
    }
  }

  // === TWINKLING STARS LOGIC ===
  // private initTwinkleStars() {
  //   const canvas = this.canvasRef.nativeElement;
  //   this.twinkleStars = [];
  //   for (let i = 0; i < this.twinkleCount; i++) {
  //     this.twinkleStars.push(new TwinkleStar(canvas));
  //   }
  // }

  // private updateTwinkleStars() {
  //   const ctx = this.ctx;
  //   this.twinkleStars.forEach(star => {
  //     star.update();
  //     star.draw(ctx);
  //   });
  // }

  // private handleResizeTwinkleStars() {
  //   this.initTwinkleStars();
  // }

  ngOnDestroy() {
    if (this.audio) {
      const fadeOutDuration = 1000;
      const fadeStep = 50;
      const volumeStep = this.audio.volume / (fadeOutDuration / fadeStep);

      const fadeOut = setInterval(() => {
        if (this.audio.volume - volumeStep > 0) {
          this.audio.volume -= volumeStep;
        } else {
          clearInterval(fadeOut);
          this.audio.pause();
          this.audio.src = '';
          if (this.audioContext) {
            this.audioContext.close();
          }
        }
      }, fadeStep);
    }

    window.removeEventListener('resize', this.resizeCanvas.bind(this));
    window.removeEventListener('resize', this.checkIfMobile.bind(this));
    // window.removeEventListener('resize', this.handleResizeTwinkleStars.bind(this));
  }
}

// --- PARTICLE CLASS ---
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  baseSize: number;

  constructor(private canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.baseSize = Math.random() * 5 + 2;
    this.size = this.baseSize;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = [
      '#4ECDC4', '#C7F464', '#FFE66D', '#FF9F1C',
      '#FF6B6B', '#1A535C', '#6A4C93', '#FFB5E8',
      '#B8F2E6', '#D0E6A5', '#FFDAC1', '#F4A261',
      '#2A9D8F', '#E76F51', '#9D4EDD', '#00B4D8',
      '#F72585', '#3A86FF', '#8338EC', '#FFD6A5',
      '#06D6A0'
    ][Math.floor(Math.random() * 20)];
  }

  update(frequencyData: Uint8Array, isPlaying: boolean) {
    const bass = frequencyData[0];
    const treble = frequencyData[frequencyData.length - 1];
    const mid = frequencyData[Math.floor(frequencyData.length / 2)];
  
    const t = Date.now() * 0.001;
  
    // Smooth values with easing (optional)
    const smoothBass = bass / 256;
    const smoothMid = mid / 256;
    const smoothTreble = treble / 256;
  
    // Soothing movement (less noise, smoother sin/cos)
    this.x += this.speedX
      + Math.sin(this.y * 0.005 + t * 0.3) * smoothBass * 2
      + (Math.random() - 0.5) * smoothMid * 0.5;
  
    this.y += this.speedY
      + Math.cos(this.x * 0.005 - t * 0.2) * smoothTreble * 2
      + Math.sin(t * 0.3) * smoothMid * 1;
  
    if (isPlaying) {
      if (this.x > this.canvas.width) this.x = 0;
      if (this.x < 0) this.x = this.canvas.width;
      if (this.y > this.canvas.height) this.y = 0;
      if (this.y < 0) this.y = this.canvas.height;
    } else {
      if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;
    }
  
    // Soothing size changes
    const sizeBass = smoothBass * 3;    // make bass influence more subtle
    const sizeTreble = smoothTreble * 1;
  
    this.size = this.baseSize + sizeBass - sizeTreble;
    this.size = Math.max(this.baseSize * 0.5, this.size);
  }
  

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}


// --- TWINKLE STAR CLASS (Enhanced) ---
// class TwinkleStar {
//   x: number;
//   y: number;
//   baseX: number;
//   baseY: number;
//   radius: number;
//   radiusBase: number;
//   radiusPulse: number;
//   alpha: number;
//   speed: number;
//   direction: number;
//   floatAngle: number;
//   floatRadius: number;
//   color: string;
//   private canvas: HTMLCanvasElement;

//   constructor(canvas: HTMLCanvasElement) {
    
//     this.canvas = canvas;

//     // Position
//     this.baseX = Math.random() * canvas.width;
//     this.baseY = Math.random() * canvas.height;
//     this.x = this.baseX;
//     this.y = this.baseY;

//     // Radius
//     this.radiusBase = 1 + Math.random() * 1.2;
//     this.radiusPulse = 0.05 + Math.random() * 0.05;
//     this.radius = this.radiusBase;

//     // Twinkle properties
//     this.alpha = Math.random();
//     this.speed = 0.002 + Math.random() * 0.003; // slower twinkle
//     this.direction = Math.random() > 0.5 ? 1 : -1;

//     // Floating motion
//     this.floatAngle = Math.random() * Math.PI * 2;
//     this.floatRadius = 0.3 + Math.random() * 0.5;

//     // Slight color variation
//     const colors = ['#fffbe6', '#ffeedd', '#e6f7ff'];
//     this.color = colors[Math.floor(Math.random() * colors.length)];
    
//   }

//   update() {
//     // Twinkling alpha
//     this.alpha += this.speed * this.direction;
//     if (this.alpha <= 0.1) {
//       this.alpha = 0.1;
//       this.direction = 1;
//     }
//     if (this.alpha >= 1) {
//       this.alpha = 1;
//       this.direction = -1;
//     }

//     // Floating motion
//     this.floatAngle += 0.01;
//     this.x = this.baseX + Math.cos(this.floatAngle) * this.floatRadius;
//     this.y = this.baseY + Math.sin(this.floatAngle) * this.floatRadius;

//     // Pulsing radius
//     this.radius = this.radiusBase + Math.sin(Date.now() * 0.005 * this.speed) * this.radiusPulse;
//   }

//   draw(ctx: CanvasRenderingContext2D) {
//     ctx.save();
  
//     ctx.globalAlpha = this.alpha;
  
//     // Smooth soft glow
//     ctx.shadowBlur = 3 + this.alpha * 6; // max blur when alpha is high
//     ctx.shadowColor = this.color;
  
//     // Core star
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
//     ctx.fillStyle = this.color;
//     ctx.fill();
  
//     ctx.restore();
//   }
  
// }
