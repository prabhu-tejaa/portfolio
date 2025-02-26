import { Component, AfterViewInit, Renderer2, ElementRef, OnInit, HostListener } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselControlComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective
} from '@coreui/angular';

import { Router } from '@angular/router';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  imports: [ThemeDirective, CarouselComponent, CarouselInnerComponent, NgFor, CarouselItemComponent]
})
export class PortfolioComponent implements OnInit, AfterViewInit {

  slides: any[] = new Array(30).fill({ id: -1, src: '', title: '', subtitle: '' });
  lastScrollTop = 0;
  isScrollingDown = false;
  isInHomeSection = false;
  observer: IntersectionObserver = {} as IntersectionObserver; // Initialize here
  versiChargeConfigurator = "./assets/imgs/versi charge configurator.jpeg"
  musicVisualizer = "./assets/imgs/musicVisualizer.png"
  private animationFrameId: number | null = null;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop) {
      this.isScrollingDown = true;
    } else {
      this.isScrollingDown = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative scrolling
  }


  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) { }

  ngAfterViewInit() {
    // Custom cursor
    const cursor = this.el.nativeElement.querySelector('.cursor');
    const follower = this.el.nativeElement.querySelector('.cursor-follower');

    this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      if (cursor) {
        this.renderer.setStyle(cursor, 'left', `${e.clientX}px`);
        this.renderer.setStyle(cursor, 'top', `${e.clientY}px`);
      }
      setTimeout(() => {
        if (follower) {
          this.renderer.setStyle(follower, 'left', `${e.clientX}px`);
          this.renderer.setStyle(follower, 'top', `${e.clientY}px`);
        }
      }, 100);
    });

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When the element enters the viewport
          this.renderer.addClass(entry.target, 'in-view');
          if (entry.target.classList.contains('skill-bar')) {
            const percent = entry.target.getAttribute('data-percent');
            this.renderer.setStyle(entry.target, 'width', `${percent}%`);
          }
        } else {
          // When the element leaves the viewport
          this.renderer.removeClass(entry.target, 'in-view');
          if (entry.target.classList.contains('skill-bar')) {
            this.renderer.setStyle(entry.target, 'width', '0%');
          }
        }
      });
    }, observerOptions);


    const elementsToObserve = this.el.nativeElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .skill-bar');
    elementsToObserve.forEach((el: HTMLElement) => observer.observe(el));

    // Smooth scrolling
    const anchors = this.el.nativeElement.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor: HTMLElement) => {
      this.renderer.listen(anchor, 'click', (e: Event) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const targetElement = this.el.nativeElement.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Typing animation
    const text = 'Software Engineer';
    const typingText = this.el.nativeElement.querySelector('.typing-text');
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        if (typingText) {
          typingText.innerHTML += text.charAt(i);
        }
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    setTimeout(typeWriter, 1000);
    this.initParticles();

  }

  ngOnInit(): void {
    this.observeHomeSection();
    this.slides[0] = {
      id: 0,
      src: './assets/imgs/techno-elevate.jpeg',
      title: 'Zero slide',
      subtitle: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
    };
    this.slides[1] = {
      id: 1,
      src: './assets/imgs/first-day-siemens.jpeg',
      title: 'First slide',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    };
    this.slides[2] = {
      id: 2,
      src: './assets/imgs/adept-chips-form-filling.jpeg',
      title: 'Second slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[3] = {
      id: 3,
      src: './assets/imgs/office-food.jpeg',
      title: 'Third slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[4] = {
      id: 4,
      src: './assets/imgs/laptop-card.jpeg',
      title: 'Fourth slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[5] = {
      id: 5,
      src: './assets/imgs/siemens.jpeg',
      title: 'Fifth slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[6] = {
      id: 6,
      src: './assets/imgs/me-01.jpeg',
      title: 'Sixth slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[7] = {
      id: 7,
      src: './assets/imgs/work-01.jpeg',
      title: 'Seventh slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[8] = {
      id: 8,
      src: './assets/imgs/work-02.jpeg',
      title: 'Eight slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[9] = {
      id: 9,
      src: './assets/imgs/work-03.jpeg',
      title: 'Ninth slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[10] = {
      id: 10,
      src: './assets/imgs/work-04.jpeg',
      title: 'Tenth slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[11] = {
      id: 11,
      src: './assets/imgs/work-05.jpeg',
      title: 'Eleven slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[12] = {
      id: 12,
      src: './assets/imgs/work-06.jpeg',
      title: 'Twelve slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[13] = {
      id: 13,
      src: './assets/imgs/work-07.jpeg',
      title: 'Thirteen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[14] = {
      id: 14,
      src: './assets/imgs/work-08.jpeg',
      title: 'Fourteen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[15] = {
      id: 15,
      src: './assets/imgs/work-09.jpeg',
      title: 'Fifteen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[16] = {
      id: 16,
      src: './assets/imgs/work-10.jpeg',
      title: 'Sixteen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[17] = {
      id: 17,
      src: './assets/imgs/work-11.jpeg',
      title: 'Seventeen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[18] = {
      id: 18,
      src: './assets/imgs/fam-01.jpeg',
      title: 'Eighteen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[19] = {
      id: 19,
      src: './assets/imgs/fam-02.jpeg',
      title: 'Nineteen slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[20] = {
      id: 20,
      src: './assets/imgs/fam-03.jpeg',
      title: 'Twenty slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[21] = {
      id: 21,
      src: './assets/imgs/fam-04.jpeg',
      title: 'Twenty one slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[22] = {
      id: 22,
      src: './assets/imgs/innovation-01.jpeg',
      title: 'Twenty two slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[23] = {
      id: 23,
      src: './assets/imgs/innovation-02.jpeg',
      title: 'Twenty three slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[24] = {
      id: 24,
      src: './assets/imgs/journey.jpeg',
      title: 'Twenty four slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[25] = {
      id: 25,
      src: './assets/imgs/me-05.jpeg',
      title: 'Twenty five slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[26] = {
      id: 26,
      src: './assets/imgs/me-04.jpeg',
      title: 'Twenty six slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[27] = {
      id: 27,
      src: './assets/imgs/me-02.jpeg',
      title: 'Twenty seven slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[28] = {
      id: 28,
      src: './assets/imgs/me-06.jpeg',
      title: 'Twenty eight slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
    this.slides[29] = {
      id: 29,
      src: './assets/imgs/me-03.jpeg',
      title: 'Twenty nine slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };

  }


  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private observeHomeSection() {
    const homeSection = document.querySelector('#home');
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Check if the section is in the viewport
        this.isInHomeSection = entry.isIntersecting;
      });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is in the viewport
    if (homeSection) {
      this.observer.observe(homeSection);
    }
  }

  private initParticles() {
    const canvas = document.getElementById('particlesCanvas') as HTMLCanvasElement;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let particlesArray: Particle[] = [];
    const numberOfParticles = 100;
    const colorPalette = ['#FF6B6B', '#4ECDC4', '#C7F464', '#FFE66D', '#FF9F1C']; // Multi-color palette
  
    // Track mouse position
    let mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 100, // Radius of influence around the mouse
    };
  
    // Update mouse position on move
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });
  
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      baseSize: number;
      targetColor: string;
      currentColor: string;
  
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 5 + 2;
        this.size = this.baseSize;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        this.targetColor = this.color;
        this.currentColor = this.color;
      }
  
      update() {
        // Fluid movement using Perlin noise or smoother functions
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.y += this.speedY + Math.cos(this.x * 0.01) * 0.5;
  
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
  
        // Pulsating effect
        this.size = this.baseSize + Math.sin(Date.now() * 0.005) * 2;
  
        // Smooth color transition
        if (this.currentColor !== this.targetColor) {
          this.currentColor = this.lerpColor(this.currentColor, this.targetColor, 0.05);
        } else {
          this.targetColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        }
  
        // Move particles away from the mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 10; // Move particle away from the mouse
          this.y -= Math.sin(angle) * force * 10;
        }
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.currentColor;
        ctx.fill();
      }
  
      lerpColor(color1: string, color2: string, amount: number): string {
        const hexToRgb = (hex: string) => {
          const bigint = parseInt(hex.slice(1), 16);
          return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        };
  
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
  
        const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * amount);
        const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * amount);
        const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * amount);
  
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
  
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
  
    function animate() {
      // Dark gradient background
      const gradient = ctx.createLinearGradient(
        0, 0, // Start at top-left
        canvas.width, canvas.height // End at bottom-right
      );
      gradient.addColorStop(0, '#0A192F'); // Dark blue
      gradient.addColorStop(1, '#000000'); // Black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Draw particles
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
  
      // Draw connection lines
      drawConnectionLines();
  
      requestAnimationFrame(animate);
    }
  
    function drawConnectionLines() {
      const maxDistance = 100; // Maximum distance to draw a line
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    }
  
    // Handle window resize
    window.addEventListener('resize', () => {
      const oldParticles = [...particlesArray];
  
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      particlesArray = oldParticles.map(p => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        return p;
      });
    });
  
    init();
    animate();
  }

navigateToVisualizer() {
  this.router.navigate(['/visualizerComponent']); // Replace '/visualizer' with the actual route to the visualizer component
}

}


