import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() page: number = 1;
  @Input() pageSize: number = 5;
  @Input() total: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() pageSizeOptions: number[] = [5, 10, 15, 20, 30];
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  private ngOnInit(): void {
    console.log("pageChange",this.pageSize)
  }
  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  public get pages(): number[] {
    const count = this.totalPages;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  public goto(page: number): void {
    const clamped = Math.min(this.totalPages, Math.max(1, page));
    if (clamped !== this.page) {
      this.page = clamped;
      this.pageChange.emit(this.page);
    }
  }

  public onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(value) || value <= 0) return;
    this.pageSize = value;
  

    this.page = 1;
    this.pageSizeChange.emit(this.pageSize);
    this.pageChange.emit(this.page);


  }
}


