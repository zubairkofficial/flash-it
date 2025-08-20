import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { globalInstance } from '../global.utils';

@Injectable({
  providedIn: 'root',
})
export class Api {
  public contentTypeHeader: any = null;
  public authorizationHeader: any = null;
  private API_BASE_URL: string | null = null;

  constructor(private http: HttpClient) {
    this.authorizationHeader = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    };
    this.contentTypeHeader = {
      'Content-Type': 'application/json',
    };
    this.API_BASE_URL = globalInstance.getInstance().getURL();
    console.log('api service initialized');
  }

  public get<T>(url: string, headers: any): Observable<T> {
    return this.http.get<T>(`${this.API_BASE_URL}${url}`, {
      headers: headers,
    });
  }

  public post<T>(url: string, data: any, headers: any): Observable<T> {
    return this.http.post<T>(`${this.API_BASE_URL}${url}`, data, {
      headers: headers,
    });
  }

  public put<T>(url: string, data: any, headers: any): Observable<T> {
    return this.http.put<T>(`${this.API_BASE_URL}${url}`, data, {
      headers: headers,
    });
  }

  public delete<T>(url: string, headers: any): Observable<T> {
    return this.http.delete<T>(`${this.API_BASE_URL}${url}`, {
      headers: headers,
    });
  }
}