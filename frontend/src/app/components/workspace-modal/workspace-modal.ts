import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {WORKSPACE_USER_PERMISSION } from '../../../utils/enum'
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
  @Input() public initialName: string = '';
  public workspaceName: string = '';
  public workspaceRole: string = '';
  @Output() public confirmed = new EventEmitter<{ name: string; role: string }>();

  @Output() public cancelled = new EventEmitter<void>();
public WORKSPACE_USER_PERMISSION=""
  public onBackdropClick(): void {
    this.cancelled.emit();
  }

  public onCancel(): void {
    this.cancelled.emit();
  }

  public onConfirm(): void {
    this.confirmed.emit({
      name: this.workspaceName,
      role: this.workspaceRole
    });
  }

  public ngOnChanges(): void {
    this.workspaceName = this.initialName || '';
  }

  public permissionOptions = [
    { label: 'Read & Export', value: WORKSPACE_USER_PERMISSION.RE },
    { label: 'Full Access (CRUD + Export)', value: WORKSPACE_USER_PERMISSION.CRUDE },
  ];
}


