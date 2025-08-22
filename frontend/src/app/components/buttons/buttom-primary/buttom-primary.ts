import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttom-primary',
  imports: [],
  templateUrl: './buttom-primary.html',
  styleUrl: './buttom-primary.css',
})
export class ButtomPrimary {
  @Input() text: string = 'Primary';
  @Input() styles: string = '';
  @Input() type: string = 'button'

  get concatClass(): string[] {
    return ['btn', 'btn-primary', ...this.styles.trim().split(/\s+/)];
  }

}
