import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule],
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
        action="https://gmail.us10.list-manage.com/subscribe/post?u=96308e1bca9b9091ba10124e8&amp;id=935d1c5649&amp;v_id=5546&amp;f_id=0030c7e5f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        class="validate"
        target="_blank"
      >
        <div id="mc_embed_signup_scroll" class="space-y-4">
          <!-- Hidden field for Mailchimp -->
          <div aria-hidden="true" style="position: absolute; left: -5000px;">
            <input
              type="text"
              name="b_96308e1bca9b9091ba10124e8_935d1c5649"
              tabindex="-1"
              value=""
            />
          </div>
          <!-- Email Field -->
          <div>
            <label
              for="mce-EMAIL"
              class="block text-sm font-semibold text-gray-800 mb-2"
            >
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              required
              class="w-full px-4 py-3 border-2 border-angular-pink/60 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink focus:border-angular-pink transition-all duration-200"
              placeholder="your@email.com"
            />
          </div>

          <!-- Name Fields Row -->
          <div class="grid grid-cols-2 gap-4">
            <!-- First Name Field -->
            <div>
              <label
                for="mce-FNAME"
                class="block text-sm font-semibold text-gray-800 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                name="FNAME"
                id="mce-FNAME"
                class="w-full px-4 py-3 border-2 border-angular-pink/60 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink focus:border-angular-pink transition-all duration-200"
                placeholder="First name"
              />
            </div>

            <!-- Last Name Field -->
            <div>
              <label
                for="mce-LNAME"
                class="block text-sm font-semibold text-gray-800 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                name="LNAME"
                id="mce-LNAME"
                class="w-full px-4 py-3 border-2 border-angular-pink/60 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink focus:border-angular-pink transition-all duration-200"
                placeholder="Last name"
              />
            </div>
          </div>

          <!-- Country Field -->
          <div>
            <label
              for="mce-COUNTRY"
              class="block text-sm font-semibold text-gray-800 mb-2"
            >
              Country
            </label>
            <input
              type="text"
              name="COUNTRY"
              id="mce-COUNTRY"
              class="w-full px-4 py-3 border-2 border-angular-pink/60 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-angular-pink focus:border-angular-pink transition-all duration-200"
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
                id="gdpr_52120"
                name="gdpr[52120]"
                value="Y"
                required
                class="mt-1 h-4 w-4 text-angular-pink focus:ring-angular-pink border-gray-300 rounded"
              />
              <div>
                <label
                  for="gdpr_52120"
                  class="text-sm font-medium text-gray-700"
                >
                  I agree to receive emails about updates, events, and other
                  relevant content
                </label>
                <p class="text-xs text-gray-500 mt-1">
                  You can unsubscribe at any time. We respect your privacy.
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <input
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
            value="Subscribe to Updates"
            class="w-full bg-angular-pink text-white font-semibold py-4 px-8 rounded-xl hover:bg-angular-purple transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-angular-pink/30"
          />

          <!-- Mailchimp Response Messages -->
          <div id="mce-responses" class="clear foot">
            <div
              class="response"
              id="mce-error-response"
              style="display: none;"
            ></div>
            <div
              class="response"
              id="mce-success-response"
              style="display: none;"
            ></div>
          </div>

          <!-- Mailchimp Attribution -->
          <div class="text-center mt-4">
            <p class="text-xs text-gray-500">
              Powered by
              <a
                href="https://mailchimp.com"
                target="_blank"
                class="text-angular-pink hover:text-angular-purple transition-colors"
              >
                Mailchimp
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SubscriptionForm {
  constructor() {
    // Mailchimp handles all form submission logic
  }
}
