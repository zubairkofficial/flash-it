import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../services/workspace/workspace';

@Component({
  selector: 'app-workspace-invite',
  imports: [CommonModule],
  templateUrl: './workspace-invite.html',
  styleUrl: './workspace-invite.css'
})
export class WorkspaceInvite implements OnInit {
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public inviteId: string | null = null;
  public result: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private workspaceService: WorkspaceService) {}

  public ngOnInit(): void {
    this.inviteId = this.route.snapshot.paramMap.get('id');
    if (!this.inviteId) {
      this.errorMessage = 'Invalid invite link';
      return;
    }
    this.fetchInvite(this.inviteId);
  }

  private fetchInvite(id: string): void {
    this.isLoading = true;
    this.workspaceService.getInvitedById(id).subscribe({
      next: (data: any) => {
        this.result = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to join workspace.';
        this.isLoading = false;
      },
    });
  }

  public redirectHome():void{
    this.router.navigate(['/dashboard']);
  }
}
