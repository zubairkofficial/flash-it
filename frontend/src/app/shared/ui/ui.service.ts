import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  public isMenuOpen = false;

  public openMenu(): void {
    this.isMenuOpen = true;
    try {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } catch {}
  }

  public closeMenu(): void {
    this.isMenuOpen = false;
    try {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    } catch {}
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    try {
      const locked = this.isMenuOpen;
      document.body.style.overflow = locked ? 'hidden' : '';
      document.documentElement.style.overflow = locked ? 'hidden' : '';
    } catch {}
  }
}



