import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace/workspace';
// import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-workspace-detail',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './workspace-detail.html',
  styleUrl: './workspace-detail.css',
})
export class WorkspaceDetail implements OnInit {
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public workspace: any = null;
  public InviteLink: any = null;
  public isInviteModalOpen: boolean = false;
  public isCopySuccess: boolean = false;
  public isUserAdmin: boolean = false; // Add this property

  constructor(private route: ActivatedRoute, private router: Router, private workspaceService: WorkspaceService) {}

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid workspace id';
      return;
    }
    this.fetchWorkspace(id);
  }

  private fetchWorkspace(id: number): void {
    this.isLoading = true;
    this.workspaceService.getWorkspaceById(id).subscribe({
      next: (data: any) => {
        this.workspace = data;
       const user= (localStorage.getItem("userData"))
       const userData=JSON.parse(user??"")
        if (this.workspace  && this.workspace.admin.id) {
          this.isUserAdmin = this.workspace.admin.id === userData.dataValues.id;
         } else {
          this.isUserAdmin = false;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to load workspace.';
        this.isLoading = false;
      },
    });
  }

  public openFlashcard(flashcardId: number): void {
    this.router.navigate(['/flashcard', flashcardId]);
  }

  public openInvitLink(id: number): void {
    this.isLoading = true;
    this.workspaceService.getInviteLinkByWorkspaceId(id).subscribe({
      next: (data: any) => {
        this.InviteLink = data;
        this.isLoading = false;
        this.isInviteModalOpen = true;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to load workspace.';
        this.isLoading = false;
      },
    })
  }

  public closeInviteModal(): void {
    this.isInviteModalOpen = false;
    this.isCopySuccess = false;
  }

  public copyInviteUrl(): void {
    const url = this.InviteLink?.url;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      this.isCopySuccess = true;
      setTimeout(() => (this.isCopySuccess = false), 1500);
    });
  }
}


