import { formatBytes } from './../../../utils/file.utils';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonToggle } from '../../components/buttons/button-toggle/button-toggle';
import { ButtonPrimaryDropdown } from '../../components/buttons/button-primary-dropdown/button-primary-dropdown';
import { ButtomPrimary } from '../../components/buttons/buttom-primary/buttom-primary';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ALL_LANGUAGES } from '../../../utils/constants/languages';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-generate-flashcard-section',
  imports: [
    ButtonToggle,
    ButtonPrimaryDropdown,
    ButtomPrimary,
    ReactiveFormsModule,
    MatIconModule,
  ],
  providers: [ Api, FlashcardService],
  templateUrl: './generate-flashcard-section.html',
  styleUrl: './generate-flashcard-section.css',
})
export class GenerateFlashcardSection {
  @Input() workspaceId!: number;
  tempId: string | null = localStorage.getItem('tempId') || null;
  activeState = DATA_TYPE.FILE;
  @Input() width: number =85;
  availableStates = Object.values(DATA_TYPE);
  activeLanguage = 'en';
  isLanguageDropDownOpen = false;
  isLoading = false;
  isBytesSelected = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  extractedText: string = '';
  language: string = 'en';
  filesSelected: FileList | null = null;
  selectedFiles: File[] = []; // Keep actual File objects for upload/UI
  textForm: FormGroup;
  popularLanguages = ALL_LANGUAGES;
  popularLanguageCodes: string[] = ALL_LANGUAGES.map((l) => l.code);
  constructor(
    private fb: FormBuilder,
    private flashcardService: FlashcardService,
   
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.textForm = this.fb.group({
      text: ['', [Validators.min(100)]],
    });
  }

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.tempId = localStorage.getItem('tempId') || null;
      this.isBytesSelected=false;
      console.log('this.tempId', this.tempId);

      if (this.tempId) {
        this.flashcardService
          .getFlashcardByTempId(this.tempId)
          .subscribe({
            next: (res) => {
            
             if(!res.raw_data[0].title){
              this.textForm.patchValue({ text: res.raw_data[0].text });
             }
             else{ 
              res.raw_data.forEach((item: any)=>
               {
                const name = item.title;
                const size = parseInt(item.file_size); // or Math.round(...) if needed
                const dummyContent = new Uint8Array(size); // simulate content of that size
              
                const file = new File([dummyContent], name, {
                  type: 'application/pdf',
                });
              
                this.selectedFiles.push(file);
              }              
            )}
              const dataTransfer = new DataTransfer();
              this.selectedFiles.forEach((f: File) => dataTransfer.items.add(f));
              this.filesSelected = dataTransfer.files;
              this.isBytesSelected = true;
            },
            error: (err) => {
              this.isLoading=false
              this.isBytesSelected = false;
              notyf.error(err?.error?.message || err.message );
    
              // notyf.error('error: ' + error.message);
            },
          });
      }
    });
  }

  formatBytes(bytes: number): string {
    return formatBytes(bytes);
  }

  onSubmit() {
    if (this.textForm.value.text) {
      console.log('this.textForm.value.text', this.textForm.value);

      const uploadText =this.tempId?this.flashcardService.generateFirstFlashCardByTempId({tempId: this.tempId}): this.workspaceId
        ? this.flashcardService.uploadDataTextAuth(
            this.textForm.value.text,
            this.language,
            +this.workspaceId
          )
        : this.flashcardService.uploadDataText(
            this.textForm.value.text,
            this.language
          );
      uploadText.subscribe({
        next: (res) => {
          if (res && res.data.temporary_flashcard_id) {
            this.isLoading = false;
            notyf.success('upload successfully');
            this.router.navigate(['/auth/register'], {
              queryParams: {
                temp_id: res.data.temporary_flashcard_id,
              },
            });
          } else if (res && !res.data.temporary_flashcard_id) {
            this.isLoading = false;
            notyf.success('upload successfully');
            this.router.navigate(['dashboard']);
          } else {
            this.isLoading = false;
            notyf.error('No temporary_flashcard_id returned.');
          }
        },
        error: (err) => {
          this.isLoading=false
          notyf.error(err?.error?.message || err.message );
    
          // notyf.error('error: ' + error.message);
        },
      });
    } else if (this.textForm.valid) {
      this.isLoading = true;
      const uploadRes =this.tempId?this.flashcardService.generateFirstFlashCardByTempId({tempId: this.tempId}): this.workspaceId
        ? this.flashcardService.uploadAuthData(
            this.filesSelected,
            this.language,
            +this.workspaceId
          )
        : this.flashcardService.uploadData(this.filesSelected, this.language);

      uploadRes.subscribe({
        next: (res) => {
          if (res && res.data.temporary_flashcard_id) {
            this.isLoading = false;
            notyf.success(res.data.message);
            this.router.navigate(['/auth/register'], {
              queryParams: {
                temp_id: res.data.temporary_flashcard_id,
              },
            });
          } else if (res && !res.data.temporary_flashcard_id) {
            this.tempId=null
            localStorage.removeItem('tempId')
            this.isLoading = false;
            notyf.success(res.data.message);
            this.router.navigate(['dashboard']);
          } else {
            this.isLoading = false;
            notyf.error('No temporary_flashcard_id returned.');
          }
        },
        error: (error) => {
          this.isLoading=false
          notyf.error(error?.error?.message || error.message || 'flashcard proccessing failed.');
    
          // notyf.error('error: ' + error.message);
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
    console.log('event', event);
    this.language = event;
  }
}
