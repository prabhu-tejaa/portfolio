import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger, group } from '@angular/animations';

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

  adept = "assets/adeptchips_logo.jpeg";
  teamlease = "assets/TeamLease-Logo.png";

  images: Record<string, string[]> = {
    adapt: ['assets/adapt-dashboard-1.jpg', 'assets/adapt-dashboard-2.jpg'],
    teamlease: ['assets/teamlease-ui-1.jpg', 'assets/teamlease-ui-2.jpg']
  };

  siemensHero = { logo: 'assets/siemens-logo.png' };

  get currentProjectImages() {
    return this.activeDialog ? this.images[this.activeDialog] : [];
  }

  openDialog(type: 'adapt' | 'teamlease') {
    this.activeDialog = type;
  }

  closeDialog() {
    this.activeDialog = null;
  }

  openImage(src: string) {
    this.selectedImage = src;
  }

  closeImage() {
    this.selectedImage = null;
  }
}