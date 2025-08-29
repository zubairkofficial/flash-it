import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workspace-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './workspace-modal.html',
  styleUrl: './workspace-modal.css',
})
export class WorkSpaceModal {
  @Input() public open: boolean = false;
  @Input() public title: string = 'Confirm';
  @Input() public message: string = 'Are you sure?';
  @Input() public confirmText: string = 'Yes';
  @Input() public cancelText: string = 'Cancel';
  public workspaceName: string = '';
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


