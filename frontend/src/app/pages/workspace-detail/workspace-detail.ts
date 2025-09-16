import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace/workspace';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';
import { GenerateFlashcardSection } from '../../landing-page/generate-flashcard-section/generate-flashcard-section';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';
import { SiteHeader } from '../../shared/site-header/site-header';
// import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-workspace-detail',
  imports: [CommonModule,MatIconModule, ConfirmModal,GenerateFlashcardSection,SignedInSidebar,SiteHeader],
  standalone: true,
  templateUrl: './workspace-detail.html',
  styleUrl: './workspace-detail.css',
})
export class WorkspaceDetail implements OnInit {
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public workspace: any = null;
  public InviteLink: any = null;
  public deleteMessage: any = null;
  public isInviteModalOpen: boolean = false;
  public isCopySuccess: boolean = false;
  public generateFlashCard: boolean = false;
  public isUserAdmin: boolean = false; // Add this property
  public confirmModalOpen: boolean = false;
  public toDelete: { workspace_id: number; user_id: number } | null = null;
  public credits=0;
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
    console.log("id",id)
    this.isLoading = true;
    this.workspaceService.getWorkspaceById(+id).subscribe({
      next: (data: any) => {
        this.isLoading=false
        this.workspace = data;
        const user = localStorage.getItem("userData");
        const userData = user ? JSON.parse(user) : null;
        const workspaceAdminId = this.workspace?.admin?.id;
        const currentUserId = userData?.id;
        
        if (workspaceAdminId && currentUserId) {
          this.isUserAdmin = workspaceAdminId === currentUserId;
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
  public generateFlashcard(flashcardId: number): void {
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
  public handleFlashCard(): void {
    this.generateFlashCard = true;

  }

  public copyInviteUrl(): void {
    const url = this.InviteLink?.url;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      this.isCopySuccess = true;
      setTimeout(() => (this.isCopySuccess = false), 1500);
    });
  }
  public onRequestDelete(workspace_id: number, user_id: number): void {
    this.toDelete = { workspace_id, user_id };
    this.confirmModalOpen = true;
  }

  public onCancelDelete(): void {
    this.confirmModalOpen = false;
    this.toDelete = null;
  }

  public onConfirmDelete(): void {
    if (!this.toDelete) return;
    const { workspace_id, user_id } = this.toDelete;
    this.isLoading = true;
    this.workspaceService.deleteWorkspaceUser(workspace_id, user_id).subscribe({
      next: () => {
        this.isLoading = false;
        this.confirmModalOpen = false;
        this.toDelete = null;
        this.fetchWorkspace(workspace_id);
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to delete workspace member.';
        this.isLoading = false;
        this.confirmModalOpen = false;
      },
    });
  }
}


