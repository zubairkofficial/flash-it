import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-buttom-primary',
  imports: [CommonModule, MatIconModule],
  standalone: true,
  templateUrl: './buttom-primary.html',
  styleUrl: './buttom-primary.css',
})
export class ButtomPrimary {
  @Input() text: string = 'Primary';
  @Input() styles: string = '';
  @Input() type: string = 'button';
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = 'Loading...';

  get concatClass(): string[] {
    return ['btn', 'btn-primary', ...this.styles.trim().split(/\s+/)];
  }

  onClick() {
    console.log('button primary clicked');
  }
}
