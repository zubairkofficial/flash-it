import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  @Input() public open: boolean = false;
  @Input() public title: string = 'Confirm';
  @Input() public message: string = 'Are you sure?';
  @Input() public confirmText: string = 'Yes';
  @Input() public cancelText: string = 'Cancel';

  @Output() public confirmed = new EventEmitter<void>();
  @Output() public cancelled = new EventEmitter<void>();

  public onBackdropClick(): void {
    this.cancelled.emit();
  }

  public onCancel(): void {
    this.cancelled.emit();
  }

  public onConfirm(): void {
    this.confirmed.emit();
  }
}









