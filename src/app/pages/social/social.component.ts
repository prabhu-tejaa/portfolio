import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import { SocialWorldService, InteractionEvent } from './services/social-world.service';

@Component({
    selector: 'app-social',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './social.component.html',
    styleUrls: ['./social.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialComponent implements AfterViewInit, OnDestroy {
    @ViewChild('rendererContainer') rendererContainer!: ElementRef;

    isModalOpen = false;
    isLoading = false;
    submissionStatus = '';
    contactForm = { email: '', message: '' };

    constructor(
        private worldService: SocialWorldService,
        private cdRef: ChangeDetectorRef,
        private zone: NgZone
    ) { }

    ngAfterViewInit(): void {
        this.worldService.init(this.rendererContainer.nativeElement);

        // Listen for 3D interactions
        this.worldService.onInteraction = (event: InteractionEvent) => {
            this.handleInteraction(event);
        };
    }

    ngOnDestroy(): void {
        this.worldService.dispose();
    }

    handleInteraction(event: InteractionEvent) {
        if (event.type === 'link' && event.url) {
            window.open(event.url, '_blank');
        } else if (event.type === 'contact') {
            this.zone.run(() => {
                this.isModalOpen = true;
                this.cdRef.markForCheck(); // Explicitly update UI
            });
        }
    }

    closeContactModal() {
        this.isModalOpen = false;
        this.worldService.resetScene();
        this.isLoading = false;
        this.submissionStatus = '';
        this.cdRef.markForCheck();
    }

    sendEmail(): void {
        if (!this.contactForm.email) return;

        this.isLoading = true;
        this.submissionStatus = 'Initializing transmission...';
        this.worldService.setSpeedUp(true);
        this.worldService.setTransitionState(true);
        this.cdRef.markForCheck();

        emailjs.send(environment.emailjs_service_id, environment.emailjs_template_id, this.contactForm, environment.emailjs_public_key)
            .then(() => {
                this.worldService.setSpeedUp(false);
                this.isLoading = false;
                this.submissionStatus = 'Message Sent Successfully!';
                this.cdRef.markForCheck();

                setTimeout(() => {
                    this.zone.run(() => {
                        this.isModalOpen = false;
                        this.worldService.setTransitionState(false);
                        this.submissionStatus = '';
                        this.worldService.resetScene();
                        this.cdRef.markForCheck();
                    });
                }, 2000);
            })
            .catch((error) => {
                this.worldService.setSpeedUp(false);
                this.isLoading = false;
                this.worldService.setTransitionState(false);
                this.submissionStatus = 'Error. Please try again.';
                console.error(error);
                this.cdRef.markForCheck();
            });
    }
}