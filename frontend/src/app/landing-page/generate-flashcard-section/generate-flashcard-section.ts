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
  extractedText: string = '';
  selectedFileName: string = '';
  textForm: FormGroup;

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
    if (this.textForm.valid) {
      const textValue = this.textForm.value.text;
      // Handle the submitted text value here
      console.log('Submitted text:', this.selectedFileName);
      const uploadRes = this.flashcardService.uploadData({
        text: textValue,
        title:this.selectedFileName,
        data_type: this.activeState,
      });

      uploadRes.subscribe({
        next: (res) => {
          // Expecting res to have data : { message, temporary_flashcard_id }
          if (res && res.data.temporary_flashcard_id) {
            this.router.navigate(['/auth/register'], {
              queryParams: {
                temp_id: res.data.temporary_flashcard_id,
              },
            });
          } else {
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
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.extractedText = await this.pdfService.extractText(file);
      this.textForm.value.text = this.extractedText;
    }
  }
}
