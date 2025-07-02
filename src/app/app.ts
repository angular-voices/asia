import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { SubscriptionForm } from './components/subscription-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent, SubscriptionForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'angular-voices-of-asia';
}
