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

  constructor(private sanitizer: DomSanitizer) {
    const url = `https://open.spotify.com/embed/playlist/${this.playlistId}?utm_source=generator&theme=1&autoplay=1`;
    this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // --- DETECT MOBILE BASED ON WINDOW WIDTH ---
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 600; // You can adjust the breakpoint
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
  
      // Add this listener to handle the audio end
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.audioLoaded = true; // If you want to show the "Upload" button again
        this.choseFile = true;
        this.currentTime = 0; // Reset the current time
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
    this.initParticles();
    this.checkIfMobile(); // Initial check
    window.addEventListener('resize', this.checkIfMobile.bind(this)); // Listen for resize
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

    if (!this.analyser) return; // Prevent error before audio loads
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
      particle.update(frequencyData);
      particle.draw(ctx);
    });
  }

  private initParticles() {
    const canvas = this.canvasRef.nativeElement;
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray.push(new Particle(canvas));
    }
  }

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
  }
}

// --- PARTICLE CLASS UNCHANGED ---
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
    this.color = ['#FF6B6B', '#4ECDC4', '#C7F464', '#FFE66D', '#FF9F1C'][Math.floor(Math.random() * 5)];
  }

  update(frequencyData: Uint8Array) {
    const bass = frequencyData[0];
    const treble = frequencyData[frequencyData.length - 1];
    this.x += this.speedX + Math.sin(this.y * 0.01) * (bass / 128);
    this.y += this.speedY + Math.cos(this.x * 0.01) * (treble / 128);
    if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;
    this.size = this.baseSize + (bass / 256) * 10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
