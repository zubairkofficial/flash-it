import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
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
  // generateFirstFlashCardByTempId(data: {
  //   tempId: string;
  //   files: FileList | null,
  //   language:string
    
  // }): Observable<any> {
  //   if (!data.files) {
  //     throw new Error('No files selected');
  //   }

  //   const formData = new FormData();
  //   for (let i = 0; i < data.files.length; i++) {
  //     formData.append('files', data.files[i]);
  //   }
  //   formData.append('language',data.language)
   
  //   return this.api.put('/flashcard/generate/'+data.tempId,formData, {
  //     ...this.api.contentTypeHeader,
  //     ...this.api.authorizationHeader,
  //   });
  // }
  generateFirstFlashCardByTempId(tempId:string,files: FileList | null,language:string,workspaceId?:number): Observable<any> {
    if (!files) {
      throw new Error('No files selected');
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('language',language)
    formData.append('workspaceId',workspaceId?.toString() || '')
    return this.api.put('/flashcard/generate/'+tempId, formData, {
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

    uploadAuthData(files: FileList | null,language:string,workspaceId?:number): Observable<any> {
      if (!files) {
        throw new Error('No files selected');
      }

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('language',language)
      formData.append('workspaceId',workspaceId?.toString() || '')
      return this.api.post('/flashcard/authorized/upload-data', formData, {
        ...this.api.authorizationHeader,
      });
    }

  uploadDataText(text: string,language:string): Observable<any> {
    return this.api.post('/flashcard/upload-text', {text,language}, {
      ...this.api.authorizationHeader,
    });
  }
  uploadDataTextAuth(text: string,language:string,workspaceId?:number): Observable<any> {
    return this.api.post('/flashcard/authorized/upload-text', {text,language,workspaceId}, {
      ...this.api.authorizationHeader,
    });
  }

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
