import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService, WorkspaceResponseItem, JoinedWorkspace } from '../../../services/workspace/workspace';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public workspaces: JoinedWorkspace[] = [];

  constructor(private workspaceService: WorkspaceService, private router: Router) {}

  public ngOnInit(): void {
    this.fetchWorkspaces();
  }

  private fetchWorkspaces(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.workspaceService.getWorkspaces().subscribe({
      next: (data: WorkspaceResponseItem[]) => {
        const firstUser = Array.isArray(data) && data.length > 0 ? data[0] : null;
        this.workspaces = firstUser?.joined_workspaces ?? [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to load workspaces.';
        this.isLoading = false;
      }
    });
  }

  public openWorkspace(id: number): void {
    this.router.navigate(['/workspace', id]);
  }
}