import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttom-outlined',
  imports: [],
  templateUrl: './buttom-outlined.html',
  styleUrl: './buttom-outlined.css',
})
export class ButtomOutlined {
  @Input() text: string = 'Outlined';
  @Input() styles: string = '';

  get concatClass(): string[] {
    return ['btn', 'btn-outline', ...this.styles.trim().split(/\s+/)];
  }

  onClick() {
    console.log('button outlined clicked');
  }
}
