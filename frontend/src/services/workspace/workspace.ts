import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../utils/api/api';

export interface WorkspaceUserPivot {
  id: number;
  role: string;
  user_id: number;
  workspace_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface JoinedWorkspace {
  id: number;
  name: string;
  credit: string;
  admin_user_id: number;
  createdAt: string;
  updatedAt: string;
  WorkspaceUser: WorkspaceUserPivot;
}

export interface WorkspaceResponseItem {
  id: number;
  name: string;
  avatar_url: string | null;
  email: string;
  password: string;
  plan_id: number;
  createdAt: string;
  updatedAt: string;
  joined_workspaces: JoinedWorkspace[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private api: Api) {}

  public getWorkspaces(): Observable<WorkspaceResponseItem[]> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.get<WorkspaceResponseItem[]>('/workspace', headers);
  }

  public getWorkspaceById(id: number): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.get<any>(`/workspace/${id}`, headers);
  }
  public getInviteLinkByWorkspaceId(id: number): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.get<any>(`/workspace/invite/${id}`, headers);
  }

  public getInvitedById(id: string): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.get<any>(`/workspace/invited/${id}`, headers);
  }
}


