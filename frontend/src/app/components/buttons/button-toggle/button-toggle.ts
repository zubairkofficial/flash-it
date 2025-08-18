import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-button-toggle',
  imports: [CommonModule],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.css',
})
export class ButtonToggle {
  @Input() availableStates: string[] = [];
  @Input() active!: string;
  @Output() activeChange = new EventEmitter<string>();

  onClick(newState: string) {
   if (this.active === newState) return;
    this.active = newState;
    this.activeChange.emit(this.active);
  }
}
