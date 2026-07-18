import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener, inject } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
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
  private analytics = inject(AnalyticsService);

  isModalOpen = false;
  selectedItem: any = null;
  selectedSubItem: any = null; // Track nested navigation state

  timeline = [
    {
      year: '1996',
      title: 'The Origin',
      desc: 'Born in Tenali, raised between my grandparents’ home and Bapatla.',
      fullDesc: `<p>My story didn't actually start in 1996; it began long before my first breath.</p>
<p>In June 1995, the specific cells that would become me were already in motion, spending months maturing and preparing. By the final week of December, just as the year was coming to an end, the spark of my life finally took hold.</p>
<p>Nine months later, on a rainy Saturday September 21, 1996 I arrived at Uma Hospital in Tenali. The half-hour between 12:30 and 1:00 PM was a fragile time. I had swallowed amniotic fluid in the womb, and my right foot was turned completely outward.</p>
<p>It was a complicated entrance, but nature has its own way of healing. Within a month, my foot corrected itself and the initial fears of the doctors began to fade.</p>
<p>My early years were a mix of two worlds: the warmth of my grandparents' homes in Tenali and the time we spent in Bapatla for my father’s work. I celebrated my first birthday at my grandfather’s house—the same home where my father grew up.</p>
<p>In 1999, my sister was born at that same hospital in Tenali, rooting our family even deeper into the history of that place.</p>`,
      icon: '✨'
    },
    {
      year: '2000 - 2026',
      title: 'Academic Foundation',
      desc: 'A comprehensive timeline of foundational schooling and higher education.',
      fullDesc: `<div class="section-block">
  <h4>Foundational & Secondary Education</h4>
  <ul class="custom-list">
    <li><span class="highlight">2000 - 2002:</span> St. John's High School, Gannavaram (Primary Education)</li>
    <li><span class="highlight">2002 - 2006:</span> Loyola Public School, Nallapadu (Elementary Studies)</li>
    <li><span class="highlight">2006 - 2008:</span> Narayana Concept School, Tarnaka (Middle School)</li>
    <li><span class="highlight">2008 - 2010:</span> David Memorial High School, Tarnaka (Middle School)</li>
    <li><span class="highlight">2010 - 2012:</span> Bhashyam Public School, Habsiguda (Secondary Education)</li>
  </ul>
</div>
<div class="section-block mt-4">
  <h4>Higher Secondary & Professional Studies</h4>
  <ul class="custom-list">
    <li><span class="highlight">2012 - 2015:</span> Intermediate Studies | Sri Chaitanya Junior College, Habsiguda</li>
    <li><span class="highlight">2015 - 2017:</span> Undergraduate Coursework in Civil Engineering | St. Ann's Engineering College, Chirala</li>
    <li><span class="highlight">2018:</span> Bachelor of Science (B.Sc.) in Computer Science | Sabarmati University (formerly Calorx Teachers' University), Gujarat</li>
    <li><span class="highlight">2024 - 2026:</span> Master of Computer Applications (MCA) | Vellore Institute of Technology (VIT)</li>
  </ul>
</div>`,
      icon: '🎓'
    },
    {
      year: '2020 - Present',
      title: 'Professional Orbit',
      desc: 'A timeline of corporate operations, specialized training, and long-term consulting.',
      fullDesc: `<div class="section-block">
  <h4>Career Milestones & Corporate Training</h4>
  <ul class="custom-list">
    <li>
      <span class="highlight">Feb 2020 - March 2020:</span> Medical Sales Representative | Nouveau Medicament
      <ul class="sub-list">
        <li>Initiated career with a 15-day intensive corporate training program at the Chennai headquarters.</li>
        <li>Executed field operations and medical sales strategies within the Visakhapatnam (Vizag) sector.</li>
      </ul>
    </li>
  </ul>
</div>
<div class="section-block mt-4">
  <h4>Strategic Professional Tenure</h4>
  <ul class="custom-list">
    <li>
      <span class="highlight">June 17, 2022 - June 30, 2024:</span> External Consultant | Siemens
      <ul class="sub-list">
        <li>Dedicated a 24-month tenure as a full-time external resource, maintaining consistent daily office operations.</li>
        <li>Navigated corporate payroll and contract transitions seamlessly:
          <ul class="sub-list">
            <li><strong class="highlight">First 1.5 Years:</strong> Payroll and contract managed through Adept Chips.</li>
            <li><strong class="highlight">Final 6 Months:</strong> Successfully transitioned to TeamLease for payroll management.</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>`,
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
          fullDesc: `<p>"It all started with this massive Windows setup my dad brought home—huge monitor, heavy CPU, the works. I was only four, but I was already hooked.</p>
<p>My dad used to put passwords on it to keep me away, but that backfired. Being locked out didn't stop me; it just made me obsessed. I’d sit there staring at the screen, wondering what was happening behind that lock and how I could get inside. That curiosity was the first spark.</p>
<p>When I finally got in, it was a total immersion. I started with the old-school 2D GTA and Vice City, eventually moving through everything from the emotional weight of The Last of Us Part II and Life is Strange to the pure chaos of High on Life.</p>
<p>Whether I was on a PS4, Xbox, or PC, I realized playing a game is like living a character’s story—it actually changes how your brain evolves. I saw how PUBG Mobile united the world when we were all stuck inside during COVID, and it hit me: this space is powerful.</p>
<p>Those were the stepping stones. That childhood wonder of wanting to 'create something in this space' never left me. It’s what drove me into software engineering. In life, you have to find your lane; I found mine in the logic and the stories that make the virtual world feel real."</p>`
        },
        {
          title: 'The Cosmic Observer',
          icon: '🚀',
          desc: 'Fascinated by the mechanics of the universe and space tech.',
          fullDesc: `<p>Space has always captivated me. From the engineering marvels of SpaceX's reusable rockets to the physics of black holes, I am an avid follower of cosmic exploration.</p>
<p>I closely follow mission launches, astronomical discoveries, and the evolving narrative of humanity's journey to the stars. This curiosity drives me to understand complex systems, whether they are orbiting in space or running in a cloud server.</p>`
        },
        {
          title: 'Major events in life',
          icon: '💻',
          desc: 'Building, breaking, and refining code for the love of creation.',
          fullDesc: `<p>Coding isn't just a job; it's a craft. I love the process of turning abstract logic into tangible, interactive experiences.</p>
<p>My "Personal Horizon" in tech involves constantly exploring new frameworks, optimizing performance, and creating interfaces that feel alive. This portfolio itself is a testament to that passion—a playground where 3D graphics, physics, and rigorous logic collide.</p>`
        },
        {
          title: 'The Earthly Explorer',
          icon: '🌍',
          desc: 'Finding balance through travel and new perspectives.',
          fullDesc: `<p>When I step away from the screen, I seek the grounding nature of the real world. Traveling allows me to reset, gain new perspectives, and appreciate the analog beauty of life.</p>
<p>Every trip is a reminder that while the digital world is limitless, the physical world offers a depth of experience that fuels creativity and resilience.</p>`
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
    this.analytics.trackEvent('modal_open', { modal_name: item.title });
    this.selectedItem = item;
    this.selectedSubItem = null; // Reset sub-item
    this.isModalOpen = true;
    this.lenis?.stop(); // Pause smooth scroll
  }

  closeModal() {
    this.analytics.trackEvent('modal_close', { modal_name: 'about_details' });
    this.isModalOpen = false;
    this.lenis?.start(); // Resume smooth scroll
    setTimeout(() => {
      this.selectedItem = null;
      this.selectedSubItem = null;
    }, 300);
  }

  // --- Nested Navigation Methods ---

  openSubItem(subItem: any) {
    this.analytics.trackEvent('subitem_open', { item: subItem.title });
    this.selectedSubItem = subItem;
  }

  closeSubItem() {
    this.analytics.trackEvent('subitem_close', { item: this.selectedSubItem?.title });
    this.selectedSubItem = null;
  }

  ngAfterViewInit() {
    setTimeout(() => {
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
    }, 50);
  }

  ngOnDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
  }
}
