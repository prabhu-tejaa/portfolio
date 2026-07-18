import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
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
    loaded?: boolean;
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
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WorkComponent {
  private analytics = inject(AnalyticsService);
  activeDialog: 'adapt' | 'teamlease' | null = null;
  selectedImage: string | null = null;

  siemensHero = { logo: 'assets/siemens-logo.png' };

  projectDetails: Record<string, WorkProject> = {
    adapt: {
      cardTitle: 'ADEPT CHIPS',
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
            'Led the complex migration of the VersiCharge Configurator from Angular 9 to Angular 14, resolving critical OSS security vulnerabilities and spearheading a comprehensive UI revamp.',
            'Engineered a voice controlled IoT commissioning Proof of Concept (POC) using the Alexa Skills Kit, demonstrating hands free hardware configuration to business stakeholders.',
            'Resolved critical FCM token synchronization failures for the China region and executed European cellular compliance updates, ensuring stable and standards compliant international releases before project handover.'
          ],
          tech: ['Angular', 'Electron.js', 'Node.js', 'RxJS', 'Agile/Scrum', 'Jira']
        },
        {
          title: 'Sifinity Setup (Mobile)',
          role: 'Software Engineer',
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
            'Developed a cross platform EV commissioning suite for iOS, Android and Desktop using Ionic Angular and Electron, driven by a unified Node.js backend to ensure cross device feature parity.'
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
            'Engineered an event driven user onboarding architecture using REST based Webhooks, drastically reducing data synchronization latency from 4 hours to near real time.',
            'Architected a custom OQL (Object Query Language) reporting engine to process and aggregate energy consumption datasets (10,000+ records), optimizing query performance for high volume data retrieval.',
            'Developed production ready microflows for the Siemens Sifinity Fleet platform by processing and integrating incoming telemetry data, implementing complex domain models and core business logic.'
          ],
          tech: ['Mendix', 'OQL', 'CSS3', 'HTML5', 'Logic Automation', 'Jira', 'Postman', 'Git']
        }
      ]
    }
  };

  openDialog(type: 'adapt' | 'teamlease') {
    this.analytics.trackEvent('dialog_open', { project_type: type });
    this.activeDialog = type;
    document.body.classList.add('no-scroll');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.activeDialog) {
      this.closeDialog();
    }
    if (this.selectedImage) {
      this.closeImage();
    }
  }

  closeDialog() {
    this.analytics.trackEvent('dialog_close');
    this.activeDialog = null;
    document.body.classList.remove('no-scroll');
  }

  openImage(src: string) {
    this.analytics.trackEvent('image_open', { image_src: src });
    this.selectedImage = src;
  }

  closeImage() {
    this.analytics.trackEvent('image_close');
    this.selectedImage = null;
  }
}