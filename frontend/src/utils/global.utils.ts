import { Injectable } from '@angular/core';

class globals {
  private NODE_ENV: string = 'production';

  // private DEV_URL: string = 'http://localhost:3001';
  private DEV_URL: string = 'http://192.168.18.29:3001';
  
  private PROD_URL: string = 'http://16.171.67.50/backend';
  private URL: string =
    this.NODE_ENV === 'development' ? this.DEV_URL : this.PROD_URL;

  public getURL(): string {
    return this.URL;
  }

  // Responsive utility functions
  public isMobile(): boolean {
    return window.innerWidth < 768;
  }

  public isTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  public isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }

  public getScreenSize(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  // Utility to handle responsive breakpoints
  public getResponsiveValue<T>(mobile: T, tablet?: T, desktop?: T): T {
    const screenSize = this.getScreenSize();

    switch (screenSize) {
      case 'mobile':
        return mobile;
      case 'tablet':
        return tablet || mobile;
      case 'desktop':
        return desktop || tablet || mobile;
      default:
        return mobile;
    }
  }

  // Format number with proper spacing for large numbers
  public formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }

  // Truncate text with ellipsis
  public truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Generate avatar initials from name
  public getAvatarInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

}

@Injectable({
  providedIn: 'root',
})
export class globalInstance {
  private static instance: globals;

  private constructor() {}

  public static getInstance(): globals {
    if (!globalInstance.instance) {
      globalInstance.instance = new globals();
    }
    return globalInstance.instance;
  }
}
