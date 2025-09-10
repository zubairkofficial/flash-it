import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  public isMenuOpen = false;

  public openMenu(): void {
    this.isMenuOpen = true;
  }

  public closeMenu(): void {
    this.isMenuOpen = false;
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}



