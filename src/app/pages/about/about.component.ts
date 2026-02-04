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
      year: '1996',
      title: 'The Origin',
      desc: 'Born in Tenali, raised between my grandparents’ home and Bapatla.',
      fullDesc: `My story didn't actually start in 1996; it began long before my first breath.

In June 1995, the specific cells that would become me were already in motion, spending months maturing and preparing. By the final week of December, just as the year was coming to an end, the spark of my life finally took hold.

Nine months later, on a rainy Saturday September 21, 1996 I arrived at Uma Hospital in Tenali. The half-hour between 12:30 and 1:00 PM was a fragile time. I had swallowed amniotic fluid in the womb, and my right foot was turned completely outward.

It was a complicated entrance, but nature has its own way of healing. Within a month, my foot corrected itself and the initial fears of the doctors began to fade.

My early years were a mix of two worlds: the warmth of my grandparents' homes in Tenali and the time we spent in Bapatla for my father’s work. I celebrated my first birthday at my grandfather’s house—the same home where my father grew up.

In 1999, my sister was born at that same hospital in Tenali, rooting our family even deeper into the history of that place.`,
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
      year: '∞',
      title: 'Personal Horizon',
      desc: 'Passionate about gaming, space exploration, and continuous learning.',
      icon: '🌠',
      // Sub-items for the nested modal navigation
      subItems: [
        {
          title: 'The Virtual Tactician',
          icon: '🎮',
          desc: 'A strategic mind honed through immersive gaming worlds.',
          fullDesc: `"It all started with this massive Windows setup my dad brought home—huge monitor, heavy CPU, the works. I was only four, but I was already hooked.

My dad used to put passwords on it to keep me away, but that backfired. Being locked out didn't stop me; it just made me obsessed. I’d sit there staring at the screen, wondering what was happening behind that lock and how I could get inside. That curiosity was the first spark.

When I finally got in, it was a total immersion. I started with the old-school 2D GTA and Vice City, eventually moving through everything from the emotional weight of The Last of Us Part II and Life is Strange to the pure chaos of High on Life.

Whether I was on a PS4, Xbox, or PC, I realized playing a game is like living a character’s story—it actually changes how your brain evolves. I saw how PUBG Mobile united the world when we were all stuck inside during COVID, and it hit me: this space is powerful.

Those were the stepping stones. That childhood wonder of wanting to 'create something in this space' never left me. It’s what drove me into software engineering. In life, you have to find your lane; I found mine in the logic and the stories that make the virtual world feel real.".`
        },
        {
          title: 'The Cosmic Observer',
          icon: '🚀',
          desc: 'Fascinated by the mechanics of the universe and space tech.',
          fullDesc: `Space has always captivated me. From the engineering marvels of SpaceX's reusable rockets to the physics of black holes, I am an avid follower of cosmic exploration.

I closely follow mission launches, astronomical discoveries, and the evolving narrative of humanity's journey to the stars. This curiosity drives me to understand complex systems, whether they are orbiting in space or running in a cloud server.`
        },
        {
          title: 'Major events in life',
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
