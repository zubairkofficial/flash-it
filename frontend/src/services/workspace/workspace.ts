import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../utils/api/api';
import { SUBSCRIPTION_TYPE } from '../../utils/enum';

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
export interface PlanType {
  id: number,
  plan_type: SUBSCRIPTION_TYPE,
  price: number,
  features: [
               string
            ],
  createdAt: string;
  updatedAt: string;

}

export interface WorkspaceResponseItem {
  id: number;
  name: string;
  avatar_url: string | null;
  email: string;
  password: string;
  credits: number;
  plan_id: number;
  createdAt: string;
  updatedAt: string;
  plan:PlanType;
  joined_workspaces: JoinedWorkspace[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private api: Api) {}

  public getWorkspaces(params?: { page?: number; pageSize?: number; q?: string }): Observable<WorkspaceResponseItem[]> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.q) query.set('q', params.q);
    const qs = query.toString();
    return this.api.get<WorkspaceResponseItem[]>(`/workspace${qs ? '?' + qs : ''}`, headers);
  }

  public getWorkspaceById(id: number, params?: { page?: number; pageSize?: number; q?: string }): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.q) query.set('q', params.q);
    const qs = query.toString();
    return this.api.get<any>(`/workspace/${id}${qs ? '?' + qs : ''}`, headers);
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
  public deleteWorkspaceUser(workspace_id: any,user_id: any): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.delete<any>(`/workspace/${workspace_id}/${user_id}`, headers);
  }

  public createWorkspace(data: { name: string; role: string; credits: number; }): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.post<any>('/workspace', { ...data }, headers);
  }

  public updateWorkspace(id: number, data:{name:string,role:string,credits:number}): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.put<any>(`/workspace/${id}`, { ...data }, headers);
  }
  public deleteWorkspace(id: number): Observable<any> {
    const headers = {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    };
    return this.api.delete<any>(`/workspace/${id}`, headers);
  }
}


