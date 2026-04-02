import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger, group } from '@angular/animations';

interface WorkProject {
  title: string;
  subTitle?: string;
  role?: string;
  period: string;
  desc?: string;
  cardTitle?: string;
  cardSubTitle?: string;
  contributions?: string[];
  tech?: string[];
  subProjects?: {
    title: string;
    role: string;
    desc: string;
    logo?: string;
    wide?: boolean;
    links?: { label: string; url: string; type?: 'android' | 'ios' | 'web' }[];
    contributions: string[];
    tech: string[];
  }[];
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.timeline-label', [
          style({ opacity: 0, transform: 'translateY(-40%) rotate(180deg)' })
        ], { optional: true }),

        query('.glass-card', [
          style({ opacity: 0, transform: 'translateY(30px)' })
        ], { optional: true }),

        group([
          query('.anchor-pane', [
            animate(
              '0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
              style({ opacity: 1, transform: 'translateX(0)' })
            )
          ], { optional: true }),

          query('.timeline-label', [
            animate(
              '0.6s 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(-50%) rotate(180deg)' })
            )
          ], { optional: true }),

          query('.glass-card', stagger(200, [
            animate(
              '0.7s 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ]), { optional: true })
        ])
      ])
    ])
  ]
})
export class WorkComponent {
  activeDialog: 'adapt' | 'teamlease' | null = null;
  selectedImage: string | null = null;

  siemensHero = { logo: 'assets/siemens-logo.png' };

  projectDetails: Record<string, WorkProject> = {
    adapt: {
      cardTitle: 'ADAPT CHIPS',
      cardSubTitle: 'Siemens EV Ecosystem (Desktop & Mobile)',
      title: 'SIEMENS // ADEPT CHIPS',
      subTitle: '',
      role: '',
      period: 'June 17, 2022 – December 22, 2023',
      desc: '',
      subProjects: [
        {
          title: 'VersiCharge Desktop Tool',
          role: 'Software Engineer',
          desc: 'Developed a high-impact desktop application (v1.1.4+) for localized and global commissioning of VersiCharge AC Wallboxes.',
          logo: 'assets/pc-tool.png',
          links: [
            { 
              label: 'Commissioning Tool Page', 
              url: 'https://support.industry.siemens.com/cs/document/109798469/versicharge-ac-wallbox-commissioning-tools?dti=0&lc=en-IN',
              type: 'web'
            }
          ],
          contributions: [
            'Contributed to the full development lifecycle of a mission-critical international product.',
            'Collaborated with global teams to adapt tools for diverse technical and cultural use cases.',
            'Streamlined commissioning tasks, automating manual setups for large-scale deployments.',
            'Resolved high-priority FCM Token issues in the CAIN region, ensuring stable status updates.'
          ],
          tech: ['Angular', 'Electron.js', 'Node.js', 'RxJS', 'Agile/Scrum', 'Jira']
        },
        {
          title: 'Sifinity Setup (Mobile)',
          role: 'Software Development Engineer',
          desc: 'Built a powerful cross-platform operational app for managing EV chargers across iOS, Android, and Desktop.',
          logo: 'assets/s-s.png',
          links: [
            { 
              label: 'Play Store', 
              url: 'https://play.google.com/store/apps/details?id=com.siemens.sifinitysetup&hl=en',
              type: 'android'
            },
            { 
              label: 'App Store', 
              url: 'https://apps.apple.com/us/app/sifinity-setup/id6476152331',
              type: 'ios'
            }
          ],
          contributions: [
            'Led cross-platform implementation for intuitive fleet and charger management.',
            'Streamlined bulk commissioning, enabling simultaneous configuration of multiple chargers.',
            'Partnered with product owners to deliver a secure, high-quality app for large-scale logistics.',
            'Automated key config tasks via backend integration, dramatically increasing operational efficiency.'
          ],
          tech: ['Ionic Framework', 'Capacitor', 'Angular', 'Apache Cordova', 'TypeScript', 'Java']
        }
      ]
    },
    teamlease: {
      cardTitle: 'TEAMLEASE SERVICES',
      cardSubTitle: 'Sifinity Fleet (Mendix-based platform)',
      title: 'TeamLease Services',
      period: 'January 02, 2024 – June 28, 2024',
      subProjects: [
        {
          title: 'Sifinity Fleet (Mendix Platform)',
          role: 'Software Development Engineer',
          desc: 'Architected and enhanced a Mendix-based fleet management ecosystem for global VersiCharge EV charger networks.',
          logo: 'assets/s-f.png',
          wide: true,
          links: [
            { 
              label: 'Platform Link (Archive)', 
              url: 'https://sifinity.fleet.emobility.io/',
              type: 'web'
            }
          ],
          contributions: [
            'Role-Based Access Control (RBAC): Implemented a robust security layer for drivers, managers, and admins, improving system integrity.',
            'Customer Lifecycle Management: Orchestrated the end-to-end journey from station purchase to real-time performance monitoring.',
            'Data Integration & Reporting: Developed real-time OQL-based analytics tools for energy consumption and charger health tracking.',
            'Platform Optimization: Automated complex operational workflows within the Mendix environment, increasing team productivity.'
          ],
          tech: ['Mendix', 'OQL', 'CSS3', 'HTML5', 'Logic Automation', 'Jira', 'Postman', 'Git']
        }
      ]
    }
  };

  openDialog(type: 'adapt' | 'teamlease') {
    this.activeDialog = type;
    document.body.classList.add('no-scroll');
  }

  closeDialog() {
    this.activeDialog = null;
    document.body.classList.remove('no-scroll');
  }

  openImage(src: string) {
    this.selectedImage = src;
  }

  closeImage() {
    this.selectedImage = null;
  }
}