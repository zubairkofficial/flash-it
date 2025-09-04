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
  generateFirstFlashCard(data: {
    tempId: string|null;
  }): Observable<any> {
    return this.api.put('/flashcard/first/generate', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }


  uploadData(files: FileList | null,language:string): Observable<any> {
    if (!files) {
      throw new Error('No files selected');
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('language',language)

    return this.api.post('/flashcard/upload-data', formData, {
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
