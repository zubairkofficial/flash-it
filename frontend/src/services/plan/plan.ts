import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Plan {
  constructor(private api: Api) {}
}
