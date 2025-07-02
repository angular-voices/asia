import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService, SubscriptionData } from '../../services/email.service';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
    >
      <h3 class="text-lg font-semibold mb-4 text-white">
        Subscribe for Updates
      </h3>

      @if (isSubmitting()) {
      <div class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"
        ></div>
        <p class="text-white">Subscribing you...</p>
      </div>
      } @else if (isSuccess()) {
      <div class="text-center py-8">
        <div class="text-green-400 text-4xl mb-4">✅</div>
        <h4 class="text-white font-semibold mb-2">Success!</h4>
        <p class="text-white/80 text-sm">{{ successMessage() }}</p>
        <button
          (click)="resetForm()"
          class="mt-4 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          Subscribe Another Email
        </button>
      </div>
      } @else if (errorMessage()) {
      <div class="text-center py-8">
        <div class="text-red-400 text-4xl mb-4">❌</div>
        <h4 class="text-white font-semibold mb-2">Oops!</h4>
        <p class="text-white/80 text-sm">{{ errorMessage() }}</p>
        <button
          (click)="resetForm()"
          class="mt-4 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          Try Again
        </button>
      </div>
      } @else {
      <form
        [formGroup]="subscriptionForm"
        (ngSubmit)="onSubmit()"
        class="space-y-4"
      >
        <input
          type="email"
          formControlName="email"
          placeholder="Enter your email"
          required
          autocomplete="email"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          [class.border-red-400]="
            subscriptionForm.get('email')?.invalid &&
            subscriptionForm.get('email')?.touched
          "
        />
        @if (subscriptionForm.get('email')?.invalid &&
        subscriptionForm.get('email')?.touched) {
        <p class="text-red-300 text-sm">Please enter a valid email address</p>
        }

        <input
          type="text"
          formControlName="name"
          placeholder="Your name (optional)"
          autocomplete="name"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        <input
          type="text"
          formControlName="country"
          placeholder="Your country (optional)"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="speaking"
            formControlName="interestedInSpeaking"
            class="rounded"
          />
          <label for="speaking" class="text-sm text-white"
            >I'm interested in speaking opportunities</label
          >
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="helping"
            formControlName="wantToVolunteer"
            class="rounded"
          />
          <label for="helping" class="text-sm text-white"
            >I want to volunteer and help</label
          >
        </div>

        <button
          type="submit"
          [disabled]="subscriptionForm.invalid || isSubmitting()"
          class="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Subscribe Now
        </button>
      </form>
      }
    </div>
  `,
  styles: [],
})
export class SubscriptionFormComponent {
  subscriptionForm: FormGroup;
  isSubmitting = signal(false);
  isSuccess = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      country: [''],
      interestedInSpeaking: [false],
      wantToVolunteer: [false],
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      const formData: SubscriptionData = this.subscriptionForm.value;

      this.emailService.subscribe(formData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          if (response.success) {
            this.isSuccess.set(true);
            this.successMessage.set(response.message);
          } else {
            this.errorMessage.set(
              response.message || 'Something went wrong. Please try again.'
            );
          }
        },
        error: (error) => {
          this.isSubmitting.set(false);
          console.error('Subscription error:', error);
          this.errorMessage.set(
            'Email sending failed. The error has been logged. Please try again later.'
          );
        },
      });
    }
  }

  resetForm(): void {
    this.subscriptionForm.reset({
      email: '',
      name: '',
      country: '',
      interestedInSpeaking: false,
      wantToVolunteer: false,
    });
    this.isSuccess.set(false);
    this.errorMessage.set('');
  }
}
