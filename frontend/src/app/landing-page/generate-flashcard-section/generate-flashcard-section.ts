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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ALL_LANGUAGES } from '../../../utils/constants/languages';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-flashcard-section',
  imports: [
    CommonModule,
    ButtonToggle,
    ButtonPrimaryDropdown,
    ButtomPrimary,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
  ],
  providers: [Api, FlashcardService],
  templateUrl: './generate-flashcard-section.html',
  styleUrl: './generate-flashcard-section.css',
})
export class GenerateFlashcardSection {
  getFlashcardIdFromParams(): string | null {
    let flashcardId: string | null = null;
    this.route.queryParamMap.subscribe((params) => {
      flashcardId = params.get('flashcard_id');
    });
    console.log('this.falshcardID', flashcardId);

    return flashcardId;
  }
  @Input() workspaceId!: number;
  tempId: string | null = null;
  private _activeState = DATA_TYPE.FILE;
  get activeState() {
    return this._activeState;
  }
  set activeState(value: DATA_TYPE) {
    if (this._activeState !== value) {
      this._activeState = value;
      // Reset text and selectedFiles when activeState changes
      this.textForm.patchValue({ text: '' });
      this.selectedFiles = [];
      this.filesSelected = null;
    }
  }
  showAddMoreFilesButton = false;
  isAddMoreFilesLoading = false;
  @Input() width: number = 0;
  isWorkspaceRoute: boolean = false;
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
    if (document.referrer && document.referrer.includes('/plans')) {
    }
    const match = this.router.url.match(/^\/workspace\/(\d+)/);
    console.log('match', match);
    if (match) {
      const workspaceId = match[1]; // e.g. "299"
      this.isWorkspaceRoute = true;
      console.log('Workspace ID:', workspaceId);
    }

    this.route.queryParamMap.subscribe((params) => {
      this.tempId = params.get('temp_id');
      const showButton = params.get('show');
      if (showButton && showButton === 'true') {
        this.showAddMoreFilesButton = true;
      }
      this.isBytesSelected = false;
      console.log('this.tsfsdfsdfempId', this.tempId);

      if (this.tempId) {
        this.flashcardService.getFlashcardByTempId(this.tempId).subscribe({
          next: (res) => {
            if (!res.raw_data[0].title) {
              this.textForm.patchValue({ text: res.raw_data[0].text });
            } else {
              res.raw_data.forEach((item: any) => {
                const name = item.title;
                const size = parseInt(item.file_size); // or Math.round(...) if needed
                const dummyContent = new Uint8Array(size); // simulate content of that size

                const file = new File([dummyContent], name, {
                  type: 'application/pdf',
                });

                this.selectedFiles.push(file);
              });
            }
            const dataTransfer = new DataTransfer();
            this.selectedFiles.forEach((f: File) => dataTransfer.items.add(f));
            this.filesSelected = dataTransfer.files;
            this.isBytesSelected = true;
          },
          error: (err) => {
            this.isLoading = false;
            this.isBytesSelected = false;
            notyf.error(err?.error?.message || err.message);

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
    this.isLoading = true;
    const textValue = this.textForm.value.text;
    const hasText =
      textValue !== null && textValue !== undefined && textValue.trim() !== '';
    let uploadRes;
    if (this.tempId) {
      uploadRes = this.flashcardService.generateFirstFlashCardByTempId({
        tempId: this.tempId,
      });
    } else if (this.workspaceId) {
      uploadRes = this.flashcardService.uploadAuthData({
        files: hasText ? null : this.filesSelected,
        language: this.language,
        text: hasText ? textValue : undefined,
        title: '', // set if you have a title
        data_type: this.activeState,
        workspaceId: Number(this.workspaceId),
      });
    } else {
      uploadRes = this.flashcardService.uploadData({
        files: hasText ? null : this.filesSelected,
        language: this.language,
        text: hasText ? textValue : undefined,
        title: '', // set if you have a title
        data_type: this.activeState,
        workspaceId: this.workspaceId,
      });
    }

    uploadRes.subscribe({
      next: (res) => {
        console.log('res after upload', res);
        if (res && res.data.temporary_flashcard_id) {
          this.isLoading = false;
          notyf.success(res.data.message || 'upload successfully');
          this.router.navigate(['/auth/register'], {
            queryParams: {
              temp_id: res.data.temporary_flashcard_id,
              flashcard_id: res.data.flashcard_id,
            },
          });
        } else if (res && res.data.temporary_flashcard_id === null) {
          this.isLoading = false;
          notyf.success(res.data.message || 'upload successfully');
          this.router.navigate([`/flashcard/${res.data.flashcard_id}`]);
        } else {
          this.isLoading = false;
          notyf.error('No temporary_flashcard_id returned.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        notyf.error(
          error?.error?.message ||
            error.message ||
            'flashcard proccessing failed.'
        );
      },
    });
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
  navigateToFlashcardDetail() {
    this.isAddMoreFilesLoading = true;
    // ...existing navigation logic...

    if (this.tempId) {
      const res = this.flashcardService.generateFirstFlashCardByTempId({
        tempId: this.tempId,
      });

      res.subscribe({
        next: () => {
          const flashcardId = this.getFlashcardIdFromParams();
          if (flashcardId) {
            this.router.navigate([`/flashcard/${flashcardId}/detail`]);
          } else {
            notyf.error('No flashcard_id found in params.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          notyf.error(
            error?.error?.message ||
              error.message ||
              'flashcard proccessing failed.'
          );
        },
      });
    }
    this.isAddMoreFilesLoading = false;
  }
}
