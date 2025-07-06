import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/40"
    >
      <div class="text-center mb-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Stay Updated</h3>
        <p class="text-gray-700 font-medium">
          Get notified about conference updates and announcements
        </p>
      </div>

      <form
        [formGroup]="subscriptionForm"
        (ngSubmit)="onSubmit()"
        class="space-y-4"
      >
        <!-- Email Field -->
        <div>
          <label
            for="email"
            class="block text-left text-sm font-semibold text-gray-800 mb-2"
          >
            Email Address <span class="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink transition-all duration-200 bg-gray-50"
            placeholder="your@email.com"
          />
          @let emailControl = subscriptionForm.get('email');
          @if (emailControl && emailControl.errors && isValidationActive()) {
            <div class="mt-1 text-sm text-red-600">
              @if (emailControl.errors['required']) {
                <span>Email is required.</span>
              }
              @if (emailControl.errors['email']) {
                <span>Please enter a valid email address.</span>
              }
            </div>
          }
        </div>

        <!-- Name Fields Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- First Name Field -->
          <div>
            <label
              for="firstName"
              class="block text-left text-sm font-semibold text-gray-800 mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              formControlName="firstName"
              class="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink transition-all duration-200 bg-gray-50"
              placeholder="First name"
            />
          </div>

          <!-- Last Name Field -->
          <div>
            <label
              for="lastName"
              class="block text-left text-sm font-semibold text-gray-800 mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              formControlName="lastName"
              class="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink transition-all duration-200 bg-gray-50"
              placeholder="Last name"
            />
          </div>
        </div>

        <!-- Country Field -->
        <div>
          <label
            for="country"
            class="block text-left text-sm font-semibold text-gray-800 mb-2"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            formControlName="country"
            class="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink transition-all duration-200 bg-gray-50"
            placeholder="Your country"
          />
        </div>

        <!-- GDPR Consent -->
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdpr"
              formControlName="gdpr"
              class="mt-1 h-4 w-4 text-angular-pink focus:ring-angular-pink border-gray-300 rounded"
            />
            <div>
              <label
                for="gdpr"
                class="text-left text-sm font-medium text-gray-700"
              >
                I agree to receive emails about updates, events, and other
                relevant content
              </label>
              <p class="text-xs text-gray-500 mt-1">
                You can unsubscribe at any time. We respect your privacy.
              </p>
              @let gdprControl = subscriptionForm.get('gdpr');
              @if (gdprControl && gdprControl.errors && isValidationActive()) {
                <p class="text-xs text-red-600 mt-1">
                  You must agree to receive emails to continue.
                </p>
              }
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <input
          type="submit"
          name="subscribe"
          id="mc-embedded-subscribe"
          [value]="isSubmitting() ? 'Subscribing...' : 'Subscribe to Updates'"
          [disabled]="isSubmitting()"
          class="w-full bg-angular-pink text-white font-semibold py-4 px-8 rounded-xl hover:bg-angular-purple transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-angular-pink/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        />

        <!-- Success/Error Messages -->
        @if (message()) {
          <div
            class="mt-4 p-4 rounded-lg text-sm font-medium"
            [class]="
              messageType() === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            "
          >
            {{ message() }}
          </div>
        }
      </form>
    </div>
  `,
})
export class SubscriptionForm {
  protected readonly isSubmitting = signal(false);
  protected readonly message = signal('');
  protected readonly messageType = signal<'success' | 'error'>('success');
  protected readonly isValidationActive = signal(false);

  readonly #http = inject(HttpClient);

  protected readonly subscriptionForm = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    country: [''],
    gdpr: [false, Validators.requiredTrue],
  });

  onSubmit() {
    this.isValidationActive.set(true);

    if (this.subscriptionForm.invalid) {
      this.message.set('Please fill in all required fields correctly.');
      this.messageType.set('error');
      return;
    }

    const formValue = this.subscriptionForm.getRawValue();

    this.isSubmitting.set(true);
    this.message.set('');

    const request = {
      email: formValue.email,
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      country: formValue.country || '',
    };

    this.#http
      .post<{
        success: boolean;
        message: string;
        isUpdate: boolean;
      }>(
        'https://angular-voices-asia-functions.angularvoicesofasia.workers.dev/',
        request,
      )
      .subscribe({
        next: (response) => {
          if (response.isUpdate) {
            this.message.set(
              'Your subscription has been updated successfully!',
            );
          } else {
            this.message.set(
              'Thank you for subscribing! Please check your email to confirm.',
            );
          }
          this.messageType.set('success');
        },
        error: (error: unknown) => {
          this.message.set('There was an error. Please try again.');
          this.messageType.set('error');
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
