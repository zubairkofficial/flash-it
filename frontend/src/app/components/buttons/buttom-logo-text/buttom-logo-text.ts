import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttom-logo-text',
  imports: [],
  templateUrl: './buttom-logo-text.html',
  styleUrl: './buttom-logo-text.css',
})
export class ButtomLogoText {
  @Input() text: string = 'Logo Text';
  @Input() styles: string = '';
  // @Input() icon: HTMLElement = null;
  concatClass = '';
  ngOnInit(): void {
    this.concatClass =
      'btn btn-outline-white flex flex-row items-center justify-center gap-4' + ' ' + this.styles;
  }

  onClick() {
    console.log('button logo text clicked');
  }
}
