import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query
} from '@angular/animations';

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
export class AboutComponent {
  timeline = [
    { year: '1996', title: 'The Origin', desc: 'Born in India.', icon: '✨' },
    { year: 'Jun 2000 - March 2002', title: 'The Foundation', desc: 'St.John school, gannavaram', icon: '🎓' },
    { year: '2002 - 2006', title: 'Mastering the Code', desc: 'Loyola', icon: '💻' },
    { year: '2006 - 2008', title: 'The Awakening', desc: 'Narayana Concept School', icon: '👁️' },
    { year: '2008 - 2010', title: 'System Upgrade: v2.0', desc: 'David Memorial High School', icon: '💪' },
    { year: '2010 - 2012', title: 'Creative Engineer', desc: 'Bhashyam', icon: '🚀' }
  ];
}
