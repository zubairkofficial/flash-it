import { Component } from '@angular/core';
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

@Component({
  selector: 'app-generate-flashcard-section',
  imports: [
    ButtonToggle,
    ButtonPrimaryDropdown,
    ButtomPrimary,
    ReactiveFormsModule,
  ],
  providers: [Pdf, Api, FlashcardService],
  templateUrl: './generate-flashcard-section.html',
  styleUrl: './generate-flashcard-section.css',
})
export class GenerateFlashcardSection {
  activeState = DATA_TYPE.FILE;
  availableStates = Object.values(DATA_TYPE);
  activeLanguage = 'en';
  isLanguageDropDownOpen = false;
  isLoading = false;
  extractedText: string = '';
  language: string = 'en';
  filesSelected: FileList | null = null;
  selectedFiles: {name: string, content: string}[] = []; // Array to store multiple files
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

  onSubmit() {
   if(this.textForm.value.text){
    console.log("this.textForm.value.text",this.textForm.value)
const uploadText=this.flashcardService.uploadDataText(this.textForm.value.text,this.language)
uploadText.subscribe({
  next: (res) => {
    if (res && res.data.temporary_flashcard_id) {
      this.isLoading=false
      this.router.navigate(['/auth/register'], {
        queryParams: {
          temp_id: res.data.temporary_flashcard_id,
        },
      });
    } else {
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
      const uploadRes = this.flashcardService.uploadData(this.filesSelected,this.language);

      uploadRes.subscribe({
        next: (res) => {
          if (res && res.data.temporary_flashcard_id) {
            this.isLoading=false
            this.router.navigate(['/auth/register'], {
              queryParams: {
                temp_id: res.data.temporary_flashcard_id,
              },
            });
          } else {
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
    console.log("files",files)
    this.filesSelected=files
    if (files && files.length > 0) {
      this.selectedFiles = []; // Reset selected files

      // Process each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const fileContent = await this.pdfService.extractText(file);
          this.selectedFiles.push({
            name: file.name,
            content: fileContent
          });
        } catch (error) {
          notyf.error(`Error processing ${file.name}: ${error}`);
        }
      }

      // Update the form with all extracted text
      // const allText = this.selectedFiles.map(file => file.content).join('\n\n');
      // this.textForm.patchValue({ text: allText });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);

    // Update the form text if files remain
    if (this.selectedFiles.length > 0) {
      const allText = this.selectedFiles.map(file => file.content).join('\n\n');
      this.textForm.patchValue({ text: allText });
    } else {
      this.textForm.patchValue({ text: '' });
    }
  }

  handleSelection(event: any) {
    console.log("event",event)
    this.language=event
   }
}
