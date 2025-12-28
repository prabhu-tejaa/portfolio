import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query
} from '@angular/animations';
import Lenis from 'lenis';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('pageAnimations', [
      transition(':leave', [
        query('.event-row', [
          animate(
            '320ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            style({
              transform: 'translateY(16px)',
              opacity: 0
            })
          )
        ], { optional: true })
      ])
    ])
  ]
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef;
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  isModalOpen = false;
  selectedItem: any = null;
  selectedSubItem: any = null; // Track nested navigation state

  timeline = [
    {
      year: '1996 - 2000',
      title: 'The Origin',
      desc: 'Born in Tenali, raised between my grandparents’ home and Bapatla.',
      fullDesc: `I was born on a rainy Saturday, September 21, 1996, between 12:30 PM and 1:00 PM at Uma Hospital in Tenali. My birth was critical; doctors feared for my survival as I had consumed the amniotic fluid in the womb. I was also born with my right foot turned outward to the right, which naturally corrected itself within one month.

I celebrated my 1st birthday at my grandfather’s house (my father’s childhood home). 

While both sets of grandparents lived in Tenali, my childhood was spent between their home and Bapatla, where my father worked. My sister was also born in the same Uma Hospital in 1999.`,
      icon: '✨'
    },
    {
      year: '2000 - 2026',
      title: 'Academic Foundation',
      desc: 'A comprehensive timeline of foundational schooling and higher education.',
      fullDesc: `Foundational & Secondary Education:
• 2000 - 2002: St. John's High School, Gannavaram (Primary Education)
• 2002 - 2006: Loyola Public School, Nallapadu (Elementary Studies)
• 2006 - 2008: Narayana Concept School, Tarnaka (Middle School)
• 2008 - 2010: David Memorial High School, Tarnaka (Middle School)
• 2010 - 2012: Bhashyam Public School, Habsiguda (Secondary Education)

Higher Secondary & Professional Studies:
• 2012 - 2015: Intermediate Studies | Sri Chaitanya Junior College, Habsiguda
• 2015 - 2017: Undergraduate Coursework in Civil Engineering | St. Ann's Engineering College, Chirala
• 2018: Bachelor of Science (B.Sc.) in Computer Science | Calorx Teachers' University, Gujarat
• 2024 - 2026: Master of Computer Applications (MCA) | Vellore Institute of Technology (VIT)`,
      icon: '🎓'
    },
    {
      year: '2020 - Present',
      title: 'Professional Orbit',
      desc: 'A timeline of corporate operations, specialized training, and long-term consulting.',
      fullDesc: `Career Milestones & Corporate Training:
• Feb 2020 - March 2020: Medical Sales Representative | Nouveau Medicament
- Initiated career with a 15-day intensive corporate training program at the Chennai headquarters.
- Executed field operations and medical sales strategies within the Visakhapatnam (Vizag) sector.

Strategic Professional Tenure:
• June 17, 2022 - June 30, 2024: External Consultant | Siemens
- Dedicated a 24-month tenure as a full-time external resource, maintaining consistent daily office operations.
- Navigated corporate payroll and contract transitions seamlessly:
  - First 1.5 Years: Payroll and contract managed through Adept Chips.
  - Final 6 Months: Successfully transitioned to TeamLease for payroll management.`,
      icon: '💼'
    },
    {
      year: 'Beyond the Code',
      title: 'Personal Horizon',
      desc: 'Passionate about gaming, space exploration, and continuous learning.',
      icon: '✨',
      // Sub-items for the nested modal navigation
      subItems: [
        {
          title: 'The Virtual Tactician',
          icon: '🎮',
          desc: 'A strategic mind honed through immersive gaming worlds.',
          fullDesc: `Gaming is more than a pastime; it’s a canvas for strategy and reflexes. 

I’ve spent countless hours mastering the mechanics of Valorant, Counter-Strike 2, and GTA V. These aren't just games—they are environments where teamwork, split-second decision-making, and tactical planning are paramount.

Whether holding a site in CS2 or executing a perfect execute in Valorant, I bring the same focus and analytical mindset to gaming as I do to software development.`
        },
        {
          title: 'The Cosmic Observer',
          icon: '🚀',
          desc: 'Fascinated by the mechanics of the universe and space tech.',
          fullDesc: `Space has always captivated me. From the engineering marvels of SpaceX's reusable rockets to the physics of black holes, I am an avid follower of cosmic exploration.

I closely follow mission launches, astronomical discoveries, and the evolving narrative of humanity's journey to the stars. This curiosity drives me to understand complex systems, whether they are orbiting in space or running in a cloud server.`
        },
        {
          title: 'The Digital Architect',
          icon: '💻',
          desc: 'Building, breaking, and refining code for the love of creation.',
          fullDesc: `Coding isn't just a job; it's a craft. I love the process of turning abstract logic into tangible, interactive experiences.

My "Personal Horizon" in tech involves constantly exploring new frameworks, optimizing performance, and creating interfaces that feel alive. This portfolio itself is a testament to that passion—a playground where 3D graphics, physics, and rigorous logic collide.`
        },
        {
          title: 'The Earthly Explorer',
          icon: '🌍',
          desc: 'Finding balance through travel and new perspectives.',
          fullDesc: `When I step away from the screen, I seek the grounding nature of the real world. Traveling allows me to reset, gain new perspectives, and appreciate the analog beauty of life.

Every trip is a reminder that while the digital world is limitless, the physical world offers a depth of experience that fuels creativity and resilience.`
        }
      ]
    }
  ];

  @HostListener('document:keydown.escape')
  onEscapeKeydown() {
    if (this.isModalOpen) {
      if (this.selectedSubItem) {
        this.closeSubItem();
      } else {
        this.closeModal();
      }
    }
  }

  ngOnInit() { }

  openModal(item: any) {
    this.selectedItem = item;
    this.selectedSubItem = null; // Reset sub-item
    this.isModalOpen = true;
    this.lenis?.stop(); // Pause smooth scroll
  }

  closeModal() {
    this.isModalOpen = false;
    this.lenis?.start(); // Resume smooth scroll
    setTimeout(() => {
      this.selectedItem = null;
      this.selectedSubItem = null;
    }, 300);
  }

  // --- Nested Navigation Methods ---

  openSubItem(subItem: any) {
    this.selectedSubItem = subItem;
  }

  closeSubItem() {
    this.selectedSubItem = null;
  }

  ngAfterViewInit() {
    this.lenis = new Lenis({
      wrapper: this.containerRef.nativeElement,
      content: this.containerRef.nativeElement.querySelector('.timeline'),
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  ngOnDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
  }
}
