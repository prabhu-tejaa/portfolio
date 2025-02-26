import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class VisualizerComponent implements AfterViewInit {
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
  private colorPalette = ['#FF6B6B', '#4ECDC4', '#C7F464', '#FFE66D', '#FF9F1C']; // Multi-color palette

  onFileChange(event: Event) {
    const fileInput = this.audioFileRef.nativeElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFileName = file.name;
      const fileURL = URL.createObjectURL(file);

      // Reset the audio element if it already exists
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0; // Reset the playback position
        this.audio.src = ''; // Clear the previous source
      }

      // Create a new audio element
      this.audio = new Audio(fileURL);
      this.audio.addEventListener('timeupdate', () => this.updateProgress());
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration;
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

    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);

    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw your existing visualizer
    this.drawAudioVisualizer();

    // Update and draw particles
    this.updateParticles(this.dataArray);
  }

  drawAudioVisualizer() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const barCount = this.bufferLength / 2;
    const barWidth = width / barCount; // Full width, no gaps
    const barHeightScale = height / 256; // Scale height based on canvas height

    // Define a higher bass threshold (adjust this value as needed)
    const bassThreshold = 500; // Increased threshold for very high bass

    for (let i = 0; i < barCount; i++) {
      let barHeight = this.dataArray[i] * barHeightScale; // Scale height dynamically

      // Apply bass threshold logic
      if (this.dataArray[i] < bassThreshold) {
        // Scale down the bar height for lower bass levels
        barHeight = (this.dataArray[i] / bassThreshold) * height;
      }

      // Generate random HSL colors for dynamic gradients
      const hue1 = Math.random() * 360; // Random hue between 0 and 360
      const hue2 = (hue1 + 120) % 360; // Complementary hue
      const hue3 = (hue1 + 240) % 360; // Another complementary hue

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `hsl(${hue1}, 100%, 50%)`); // Bright color
      gradient.addColorStop(0.5, `hsl(${hue2}, 100%, 50%)`); // Complementary color
      gradient.addColorStop(1, `hsl(${hue3}, 100%, 50%)`); // Another complementary color
      ctx.fillStyle = gradient;

      // Reverse the index for top and right sides
      const reverseIndex = barCount - 1 - i;

      // 🔵 **TOP (Reverse of bottom, triangles pointing upward)**
      ctx.beginPath();
      ctx.moveTo(reverseIndex * barWidth, 0); // Top-left corner (reversed)
      ctx.lineTo(reverseIndex * barWidth + barWidth, 0); // Top-right corner (reversed)
      ctx.lineTo(reverseIndex * barWidth + barWidth / 2, barHeight); // Bottom center (reversed)
      ctx.closePath();
      ctx.fill();

      // 🔴 **BOTTOM (Triangles pointing upward, normal)**
      ctx.beginPath();
      ctx.moveTo(i * barWidth, height); // Bottom-left corner
      ctx.lineTo(i * barWidth + barWidth, height); // Bottom-right corner
      ctx.lineTo(i * barWidth + barWidth / 2, height - barHeight); // Top center
      ctx.closePath();
      ctx.fill();

      // 🟢 **LEFT (Triangles pointing rightward, normal)**
      ctx.beginPath();
      ctx.moveTo(0, i * barWidth); // Top-left corner
      ctx.lineTo(0, i * barWidth + barWidth); // Bottom-left corner
      ctx.lineTo(barHeight, i * barWidth + barWidth / 2); // Right center
      ctx.closePath();
      ctx.fill();

      // 🟡 **RIGHT (Reverse of left, triangles pointing leftward)**
      ctx.beginPath();
      ctx.moveTo(width, reverseIndex * barWidth); // Top-right corner (reversed)
      ctx.lineTo(width, reverseIndex * barWidth + barWidth); // Bottom-right corner (reversed)
      ctx.lineTo(width - barHeight, reverseIndex * barWidth + barWidth / 2); // Left center (reversed)
      ctx.closePath();
      ctx.fill();
    }
  }

  updateParticles(frequencyData: Uint8Array) {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    // Update and draw particles
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
}

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
    this.baseSize = Math.random() * 5 + 2; // Base size for pulsating effect
    this.size = this.baseSize;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = ['#FF6B6B', '#4ECDC4', '#C7F464', '#FFE66D', '#FF9F1C'][Math.floor(Math.random() * 5)];
  }

  update(frequencyData: Uint8Array) {
    const bass = frequencyData[0]; // Low-frequency data (bass)
    const treble = frequencyData[frequencyData.length - 1]; // High-frequency data (treble)

    // Wave-like movement for music effect
    this.x += this.speedX + Math.sin(this.y * 0.01) * (bass / 128); // Bass affects horizontal movement
    this.y += this.speedY + Math.cos(this.x * 0.01) * (treble / 128); // Treble affects vertical movement

    // Bounce off edges
    if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;

    // Pulsating effect based on bass
    this.size = this.baseSize + (bass / 256) * 10; // Size changes with bass
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}