import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WorkspaceService,
  WorkspaceResponseItem,
  JoinedWorkspace,
} from '../../../services/workspace/workspace';
import { Router } from '@angular/router';
import { WorkSpaceModal } from '../../components/workspace-modal/workspace-modal';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';
import { SiteHeader } from '../../shared/site-header/site-header';
import { notyf } from '../../../utils/notyf.utils';
import { Api } from '../../../utils/api/api';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { Pagination } from '../../components/pagination/pagination';
import { ButtomPrimary } from "../../components/buttons/buttom-primary/buttom-primary";
import { ProfileStoreService } from '../../services/profile-store.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    WorkSpaceModal,
    MatIconModule,
    ConfirmModal,
    SignedInSidebar,
    SiteHeader,
    FilterBar,
    Pagination,
    ButtomPrimary
],
  providers: [WorkspaceService, Api],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public workspaces: JoinedWorkspace[] = [];
  public filtered: JoinedWorkspace[] = [];
  public query: string = '';
  public page: number = 1;
  public pageSize: number = 5;
  public isOpenWorkspace: boolean = false;
  public isConfirmModalOpen: boolean = false;
  public confirmModalOpen: boolean = false;
  public workspaceId: number = 0;
  public credits: number = 0;
  public firstUser: WorkspaceResponseItem | null = null;
  public editingWorkspace: JoinedWorkspace | null = null;
  public userData: { name?: string } | null = null;
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private profileStore: ProfileStoreService
  ) {}

  public ngOnInit(): void {
    const user = localStorage.getItem('userData');
    const parsedUser = user ? JSON.parse(user) : null;
    this.userData = parsedUser?.dataValues ?? parsedUser;
    this.fetchWorkspaces();
  }

  private fetchWorkspaces(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.workspaceService
      .getWorkspaces({
        page: this.page,
        pageSize: this.pageSize,
        q: this.query,
      })
      .subscribe({
        next: (data: WorkspaceResponseItem[]) => {
          const firstUser =
            Array.isArray(data) && data.length > 0 ? data[0] : null;
          this.workspaces = firstUser?.joined_workspaces ?? [];
          this.applyFilter();

          this.firstUser = firstUser;
          this.credits = data[0]?.credits ?? 0;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage =
            err?.error?.message || 'Failed to load workspaces.';
          this.isLoading = false;
        },
      });
  }

  public openWorkspace(id: number): void {
    this.router.navigate(['/workspace', id]);
  }
  public onClickUpgrade(): void {
    this.router.navigate(['/plans']);
  }
  public handleWorkspace(): void {
    this.editingWorkspace = null;
    this.isConfirmModalOpen = true;
  }

  public onCancelSave(): void {
    this.isConfirmModalOpen = false;
  }

  public onFilterChange(q: string): void {
    this.query = (q || '').toLowerCase();
    this.page = 1;
    this.applyFilter();
    this.fetchWorkspaces();
  }

  private applyFilter(): void {
    if (!this.query) {
      this.filtered = [...this.workspaces];
    } else {
      this.filtered = this.workspaces.filter(
        (w) =>
          (w.name || '').toLowerCase().includes(this.query) ||
          String(w.id).includes(this.query)
      );
    }
  }

  public get paged(): JoinedWorkspace[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  public onPageChange(p: number): void {
    this.page = p;
    this.fetchWorkspaces();
  }
  public onPageSizeChange(s: number): void {
    this.pageSize = s;
    this.page = 1;
    this.fetchWorkspaces();
  }

  public editWorkspace(ws: JoinedWorkspace): void {
    this.editingWorkspace = ws;
    console.log('editingWorkspace', this.editingWorkspace);
    this.isConfirmModalOpen = true;
  }
  public deleteWorkspace(id: number): void {
    this.workspaceId = id;
    this.confirmModalOpen = true;
    console.log('editingWorkspace', id);
  }

  public onConfirmDelete(): void {
    this.isLoading = true;

    this.confirmModalOpen = false;
    this.workspaceService.deleteWorkspace(this.workspaceId).subscribe({
      next: () => {
        this.fetchWorkspaces();
      },
      error: (err: any) => {
        this.errorMessage =
          err?.error?.message || 'Failed to delete workspace.';
        this.isLoading = false;
      },
    });
  }

  public onCancelDelete(): void {
    this.confirmModalOpen = false;
  }

  public onConfirmSave(data: {
    name: string;
    role: string;
    credits: number;
  }): void {
    console.log('data.......', data);
    this.isConfirmModalOpen = false;
    const name = (data.name || '').trim();
    const role = (data.role || '').trim();
    const credits = data.credits || 0;
    if (!name || !role) return;
    this.isLoading = true;
    if (this.editingWorkspace) {
      this.workspaceService
        .updateWorkspace(this.editingWorkspace.id, { name, role, credits })
        .subscribe({
          next: () => {
            this.fetchWorkspaces();
            this.isLoading = false;
            notyf.success('update successfully');
            this.profileStore.refetch();
          },
          error: (err: any) => {
            this.errorMessage =
              err?.error?.message || 'Failed to update workspace.';
            this.isLoading = false;
            notyf.error(err?.error?.message || 'Failed to update workspace.');
          },
        });
    } else {
      this.workspaceService.createWorkspace(data).subscribe({
        next: () => {
          notyf.success('create workspace successfully');
          this.fetchWorkspaces();
          this.isLoading = false;
          this.profileStore.refetch();
        },
        error: (err: any) => {
          this.errorMessage =
            err?.error?.message || 'Failed to create workspace.';
          this.isLoading = false;
          this.fetchWorkspaces();
          this.isConfirmModalOpen = false;
          notyf.error(err?.error?.message || 'Failed to create workspace.');
        },
      });
    }
  }
}
