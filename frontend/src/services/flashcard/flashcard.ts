import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { DATA_TYPE } from '../../utils/enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  constructor(private api: Api) {}

  generateFlashCard(data: {
    workspace_id: number;
    temporary_flashcard_id: string;
  }): Observable<any> {
    return this.api.put('/flashcard/generate', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  uploadData(data: { text: string;title:string; data_type: DATA_TYPE }): Observable<any> {
    return this.api.post('/flashcard/upload-data', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  getFlashcardById(id: number): Observable<any> {
    return this.api.get(`/flashcard/${id}`, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }
}
