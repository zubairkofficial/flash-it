import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttom-primary',
  imports: [CommonModule],
  templateUrl: './buttom-primary.html',
  styleUrl: './buttom-primary.css',
})
export class ButtomPrimary {
  @Input() text: string = 'Primary';
  @Input() styles: string = '';
  // concatClass = '';
  // ngOnInit(): void {
  //   // this.concatClass = 'btn btn-primary' + ' ' + this.styles;
  // }

  get concatClass(): string[] {
    return ['btn', 'btn-primary', ...this.styles.trim().split(/\s+/)];
  }

  onClick() {
    console.log('button primary clicked');
  }
}
