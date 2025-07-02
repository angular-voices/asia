import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent, SubscriptionFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'angular-voices-of-asia';
}
