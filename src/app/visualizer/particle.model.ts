export class Particle {
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