import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  // Regenerate flashcard by id
  regenerateFlashcard(id: number): Observable<any> {
    return this.api.post(`/flashcard/regenerate-flashcard/${id}`, null, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }
  constructor(private api: Api) {}

  // Get raw data for a flashcard
  getRawData(flashcardId: number): Observable<any> {
    return this.api.get(`/flashcard/${flashcardId}/raw-data`, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  // Add raw data to a flashcard
  addRawData(
    flashcardId: number,
    params: {
      files?: FileList | null;
      text?: string;
      title?: string;
      language: string;
      data_type?: string;
      workspaceId?: number;
    }
  ): Observable<any> {
    const formData = new FormData();
    if (params.files) {
      for (let i = 0; i < params.files.length; i++) {
        formData.append('files', params.files[i]);
      }
    }
    if (params.text) formData.append('text', params.text);
    if (params.title) formData.append('title', params.title);
    formData.append('language', params.language);
    if (params.data_type) formData.append('data_type', params.data_type);
    if (params.workspaceId !== undefined)
      formData.append('workspaceId', params.workspaceId.toString());
    return this.api.post(`/flashcard/${flashcardId}/raw-data`, formData, {
      ...this.api.authorizationHeader,
    });
  }

  // Delete raw data from a flashcard
  deleteRawData(flashcardId: number, rawDataId: number): Observable<any> {
    return this.api.post(
      `/flashcard/${flashcardId}/raw-data/delete`,
      { rawDataId },
      {
        ...this.api.contentTypeHeader,
        ...this.api.authorizationHeader,
      }
    );
  }

  generateFlashCard(data: {
    workspace_id: number;
    temporary_flashcard_id: string;
  }): Observable<any> {
    return this.api.put('/flashcard/generate', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  // generateFirstFlashCardByTempId(data: { tempId: string }): Observable<any> {
  //   console.log('herererereer', data.tempId);
  //   return this.api.post('/flashcard/generate/' + data.tempId, null, {
  //     ...this.api.contentTypeHeader,
  //     ...this.api.authorizationHeader,
  //   });
  // }

  generateFirstFlashCard(data: { tempId: string | null }): Observable<any> {
    return this.api.put('/flashcard/first/generate', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  uploadData(params: {
    files: FileList | null;
    language: string;
    text?: string;
    title?: string;
    data_type?: string;
    workspaceId?: number;
  }): Observable<any> {
    const { files, language, text, title, data_type, workspaceId } = params;
    if (!files) {
      throw new Error('No files selected');
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('language', language);
    if (text) formData.append('text', text);
    if (title) formData.append('title', title);
    if (data_type) formData.append('data_type', data_type);
    if (workspaceId !== undefined)
      formData.append('workspaceId', workspaceId.toString());
    return this.api.post('/flashcard/upload-data', formData, {
      ...this.api.authorizationHeader,
    });
  }

  // uploadAuthData(params: {
  //   files: FileList | null;
  //   language: string;
  //   text?: string;
  //   title?: string;
  //   data_type?: string;
  //   workspaceId?: number;
  // }): Observable<any> {
  //   const { files, language, text, title, data_type, workspaceId } = params;
  //   if (!files) {
  //     throw new Error('No files selected');
  //   }
  //   const formData = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append('files', files[i]);
  //   }
  //   formData.append('language', language);
  //   if (text) formData.append('text', text);
  //   if (title) formData.append('title', title);
  //   if (data_type) formData.append('data_type', data_type);
  //   if (workspaceId !== undefined)
  //     formData.append('workspaceId', workspaceId.toString());
  //   return this.api.post('/flashcard/authorized/upload-data', formData, {
  //     ...this.api.authorizationHeader,
  //   });
  // }

  getFlashcardByTempId(id: string): Observable<any> {
    return this.api.get(`/flashcard/temp/${id}`, {
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
