import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace/workspace';

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
}


