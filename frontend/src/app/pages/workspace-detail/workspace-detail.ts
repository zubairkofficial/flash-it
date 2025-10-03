import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace/workspace';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';
import { GenerateFlashcardSection } from '../../generate-flashcard-section/generate-flashcard-section';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';
import { SiteHeader } from '../../shared/site-header/site-header';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { Pagination } from '../../components/pagination/pagination';
import { Api } from '../../../utils/api/api';
// import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-workspace-detail',
  imports: [
    CommonModule,
    MatIconModule,
    ConfirmModal,
    GenerateFlashcardSection,
    SignedInSidebar,
    SiteHeader,
    FilterBar,
    Pagination,
    MatIcon,
  ],
  providers: [Api, WorkspaceService],
  standalone: true,
  templateUrl: './workspace-detail.html',
  styleUrl: './workspace-detail.css',
})
export class WorkspaceDetail implements OnInit {
  public goBack(): void {
    this.router.navigate(['/dashboard'], { relativeTo: this.route });
  }
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public workspace: any = null;
  public InviteLinks: any[] = [];
  public deleteMessage: any = null;
  public isInviteModalOpen: boolean = false;
  public isCopySuccess: boolean = false;
  public isUserAdmin: boolean = false; // Add this property
  public confirmModalOpen: boolean = false;
  public toDelete: { workspace_id: number; user_id: number } | null = null;
  public credits = 0;
  public query: string = '';
  public page: number = 1;
  public pageSize: number = 5;
  public filteredFlashcards: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid workspace id';
      return;
    }
    this.fetchWorkspace(id);
  }

  private fetchWorkspace(id: number): void {
    console.log('id', id);
    this.isLoading = true;
    this.workspaceService
      .getWorkspaceById(+id, {
        page: this.page,
        pageSize: this.pageSize,
        q: this.query,
      })
      .subscribe({
        next: (data: any) => {
          console.log('workspace data', data);
          this.isLoading = false;
          this.workspace = data;
          this.applyFilter();
          const user = localStorage.getItem('userData');
          const userData = user ? JSON.parse(user) : null;
          const workspaceAdminId = data?.admin?.id;
          const currentUserId = userData?.id;

          if (workspaceAdminId && currentUserId) {
            this.isUserAdmin = workspaceAdminId === currentUserId;
          } else {
            this.isUserAdmin = false;
          }
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage =
            err?.error?.message || 'Failed to load workspace.';
          this.isLoading = false;
        },
      });
  }

  public openFlashcard(flashcardId: number): void {
    this.router.navigate(['/flashcard', flashcardId]);
  }

  public onFlashcardFilterChange(q: string): void {
    this.query = (q || '').toLowerCase();
    this.page = 1;
    this.applyFilter();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.fetchWorkspace(id);
  }

  private applyFilter(): void {
    const list: any[] = this.workspace?.flashcards || [];
    if (!this.query) {
      this.filteredFlashcards = [...list];
    } else {
      this.filteredFlashcards = list.filter((fc) =>
        (fc?.raw_data?.title || 'flashcard').toLowerCase().includes(this.query)
      );
    }
  }

  public get pagedFlashcards(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredFlashcards.slice(start, start + this.pageSize);
  }
  public onPageChange(p: number): void {
    this.page = p;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.fetchWorkspace(id);
  }
  public onPageSizeChange(s: number): void {
    this.pageSize = s;
    this.page = 1;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.fetchWorkspace(id);
  }
  public generateFlashcard(flashcardId: number): void {
    this.router.navigate(['/flashcard', flashcardId]);
  }

  public openInvitLink(id: number): void {
    this.isLoading = true;
    this.workspaceService.getInviteLinkByWorkspaceId(id).subscribe({
      next: (data) => {
        console.log('invite link data', data);
        this.InviteLinks = data.invites || [];
        this.isLoading = false;
        this.isInviteModalOpen = true;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to load workspace.';
        this.isLoading = false;
      },
    });
  }

  public closeInviteModal(): void {
    this.isInviteModalOpen = false;
    this.isCopySuccess = false;
  }
  public handleFlashCard(): void {
    this.router.navigate([`/workspace/${this.workspace.id}/flashcard/create`]);
  }

  public copyInviteUrl(link: { url: string }): void {
    const url = link?.url;
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
  public openRawDataPage(flashcardId: number): void {
    this.router.navigate([`/flashcard/${flashcardId}/detail`]);
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
        this.errorMessage =
          err?.error?.message || 'Failed to delete workspace member.';
        this.isLoading = false;
        this.confirmModalOpen = false;
      },
    });
  }
}
