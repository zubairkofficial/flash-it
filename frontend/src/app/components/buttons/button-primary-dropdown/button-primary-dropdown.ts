import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-primary-dropdown',
  imports: [],
  templateUrl: './button-primary-dropdown.html',
  styleUrl: './button-primary-dropdown.css',
})
export class ButtonPrimaryDropdown {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() text: string = 'DropDown';
  @Input() styles: string = '';
  @Input() availableState: string[] = [];
  @Input() active!: string;
  @Output() activeChange = new EventEmitter<string>();

  get concatClass(): string[] {
    return [
      'btn',
      'btn-primary',
      'flex flex-row',
      ...this.styles.trim().split(/\s+/),
    ];
  }

  toggle() {
    this.isOpen = !this.isOpen;
    // this.isOpenChange.emit(this.isOpen);
  }

  onChange(newState: string) {
    if (this.active === newState) {
      return;
    }
    this.active = newState;
    this.activeChange.emit(newState);
    this.isOpen = false;
  }
}
