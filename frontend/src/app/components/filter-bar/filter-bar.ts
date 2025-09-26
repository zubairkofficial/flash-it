import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  @Input() placeholder: string = 'Search';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  public onInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }
}


