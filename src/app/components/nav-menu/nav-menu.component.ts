import { Component, HostListener } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  isMenuOpen = false;
  isScrolled = false;

  menuItems = [
    { label: 'Home', href: '#home', icon: '🏠' },
    { label: 'About', href: '#about', icon: 'ℹ️' },
    { label: 'Team', href: '#team', icon: '👥' },
    { label: 'What to Expect', href: '#expect', icon: '✨' },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  scrollToSection(href: string): void {
    this.closeMenu();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
