import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-buttom-primary',
  imports: [MatIconModule],
  templateUrl: './buttom-primary.html',
  styleUrl: './buttom-primary.css',
})
export class ButtomPrimary {
  @Input() text: string = 'Primary';
  @Input() styles: string = '';
  @Input() type: string = 'button'
  @Input() isLoading: boolean = false; 


  get concatClass(): string[] {
    return ['btn', 'btn-primary', ...this.styles.trim().split(/\s+/)];
  }

}
