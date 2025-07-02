import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubscriptionData {
  email: string;
  name?: string;
  country?: string;
  interestedInSpeaking: boolean;
  wantToVolunteer: boolean;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  readonly #apiUrl = '/api/subscribe';
  readonly #http = inject(HttpClient);

  subscribe(data: SubscriptionData): Observable<SubscriptionResponse> {
    return this.#http.post<SubscriptionResponse>(this.#apiUrl, data);
  }
}
