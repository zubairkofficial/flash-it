import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonToggle } from '../../components/buttons/button-toggle/button-toggle';
import { ButtonPrimaryDropdown } from '../../components/buttons/button-primary-dropdown/button-primary-dropdown';
import { ButtomPrimary } from '../../components/buttons/buttom-primary/buttom-primary';
import { Pdf } from '../../../services/pdf/pdf';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DATA_TYPE } from '../../../utils/enum';
import { Api } from '../../../utils/api/api';
import { FlashcardService } from '../../../services/flashcard/flashcard';
import { notyf } from '../../../utils/notyf.utils';
import { Router } from '@angular/router';
import { ALL_LANGUAGES } from '../../../utils/constants/languages';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-generate-flashcard-section',
  imports: [
    ButtonToggle,
    ButtonPrimaryDropdown,
    ButtomPrimary,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [Pdf, Api, FlashcardService],
  templateUrl: './generate-flashcard-section.html',
  styleUrl: './generate-flashcard-section.css',
})
export class GenerateFlashcardSection {
  @Input() workspaceId!: number;
  activeState = DATA_TYPE.FILE;
  availableStates = Object.values(DATA_TYPE);
  activeLanguage = 'en';
  isLanguageDropDownOpen = false;
  isLoading = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  extractedText: string = '';
  language: string = 'en';
  filesSelected: FileList | null = null;
  selectedFiles: File[] = []; // Keep actual File objects for upload/UI
  textForm: FormGroup;
  popularLanguages = ALL_LANGUAGES;
  popularLanguageCodes: string[] = ALL_LANGUAGES.map(l => l.code);
  constructor(
    private pdfService: Pdf,
    private fb: FormBuilder,
    private flashcardService: FlashcardService,
    private router: Router
  ) {
    this.textForm = this.fb.group({
      text: ['', [Validators.min(100)]],
    });
  }

  formatBytes(bytes: number): string {
    if (!bytes && bytes !== 0) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = bytes > 0 ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;
    const value = bytes / Math.pow(1024, i);
    const fixed = value >= 100 || i === 0 ? 0 : value >= 10 ? 1 : 2;
    return `${value.toFixed(fixed)} ${units[i]}`;
  }

  onSubmit() {
   if(this.textForm.value.text){
    console.log("this.textForm.value.text",this.textForm.value)

const uploadText= this.workspaceId?this.flashcardService.uploadDataTextAuth(this.textForm.value.text,this.language,+this.workspaceId):this.flashcardService.uploadDataText(this.textForm.value.text,this.language)
uploadText.subscribe({
  next: (res) => {
    if (res && res.data.temporary_flashcard_id) {
      this.isLoading=false
      notyf.success("upload successfully")
      this.router.navigate(['/auth/register'], {
        queryParams: {
          temp_id: res.data.temporary_flashcard_id,
        },
      });
    }
     else if(res && !res.data.temporary_flashcard_id){
      this.isLoading=false
      notyf.success("upload successfully")
      this.router.navigate(['dashboard']);
    }
     else {
      this.isLoading=false
      notyf.error('No temporary_flashcard_id returned.');
    }
  },error: (error) => {
    notyf.error('error: ' + error.message);
  },
})
}
    else if (this.textForm.valid) {
     this.isLoading=true
      const uploadRes = this.workspaceId?this.flashcardService.uploadAuthData(this.filesSelected,this.language,+this.workspaceId): this.flashcardService.uploadData(this.filesSelected,this.language);

      uploadRes.subscribe({
        next: (res) => {
          if (res && res.data.temporary_flashcard_id) {
            this.isLoading=false
            notyf.success(res.data.message)
            this.router.navigate(['/auth/register'], {
              queryParams: {
                temp_id: res.data.temporary_flashcard_id,
              },
            });
          }else if(res && !res.data.temporary_flashcard_id){
            this.isLoading=false
            notyf.success(res.data.message)
            this.router.navigate(['dashboard']);
          }
           else {
            this.isLoading=false
            notyf.error('No temporary_flashcard_id returned.');
          }
        },
        error: (error) => {
          notyf.error('error: ' + error.message);
        },
      });
    }
  }

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isAlreadySelected = this.selectedFiles.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (isAlreadySelected) continue;
        this.selectedFiles.push(file);
      }

      // Build a FileList (for existing service signature)
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach((f: File) => dataTransfer.items.add(f));
      this.filesSelected = dataTransfer.files;

      // Clear input so same file can be selected again
      event.target.value = '';
    }
  }

  triggerFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach((f: File) => dataTransfer.items.add(f));
    this.filesSelected = dataTransfer.files;
  }

  handleSelection(event: any) {
    console.log("event",event)
    this.language=event
   }
}
