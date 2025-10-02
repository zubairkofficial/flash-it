import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from '../../../services/workspace/workspace';
import { DATA_TYPE } from '../../../utils/enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService } from '../../../services/flashcard/flashcard';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';
import { SiteHeader } from '../../shared/site-header/site-header';
import { Api } from '../../../utils/api/api';

@Component({
  selector: 'app-flashcard-detail',
  templateUrl: './flashcard-detail.html',
  imports: [CommonModule, FormsModule, SignedInSidebar, SiteHeader],
  providers: [Api, FlashcardService, WorkspaceService],
})
export class FlashcardDetailComponent implements OnInit {
  credits: number = 0;
  availableDataTypes = Object.values(DATA_TYPE);
  selectedDataType: DATA_TYPE = DATA_TYPE.FILE;
  flashcardId!: number;
  rawDataList: any[] = [];
  isLoading = false;

  showDeleteModal = false;
  rawDataIdToDelete: number | null = null;

  showAddModal = false;
  inputState: 'file' | 'text' = 'file';
  selectedFiles: File[] = [];
  filesSelected: FileList | null = null;
  textValue: string = '';

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCredits();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.flashcardId = +id;
        this.fetchRawData();
      }
    });
  }

  fetchRawData() {
    this.isLoading = true;
    this.flashcardService.getRawData(this.flashcardId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.rawDataList = res?.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.rawDataList = [];
      },
    });
  }

  confirmDeleteRawData(rawDataId: number) {
    this.rawDataIdToDelete = rawDataId;
    this.showDeleteModal = true;
  }

  fetchCredits(): void {
    this.workspaceService.getWorkspaces({ page: 1, pageSize: 1 }).subscribe({
      next: (data: any) => {
        this.credits = data[0]?.credits ?? 0;
      },
      error: () => {
        this.credits = 0;
      },
    });
  }
  cancelDeleteRawData() {
    this.rawDataIdToDelete = null;
    this.showDeleteModal = false;
  }

  deleteRawDataConfirmed() {
    if (this.rawDataIdToDelete !== null) {
      this.flashcardService
        .deleteRawData(this.flashcardId, this.rawDataIdToDelete)
        .subscribe({
          next: () => {
            this.fetchRawData();
            this.cancelDeleteRawData();
          },
        });
    }
  }

  openAddModal() {
    this.showAddModal = true;
    this.selectedDataType = DATA_TYPE.FILE;
    this.inputState = 'file';
    this.resetInputs();
  }

  closeAddModal() {
    this.showAddModal = false;
    this.resetInputs();
  }

  toggleInputState(state: 'file' | 'text') {
    if (this.inputState !== state) {
      this.inputState = state;
      this.selectedDataType =
        state === 'file' ? DATA_TYPE.FILE : DATA_TYPE.TEXT;
      this.resetInputs();
    }
  }

  resetInputs() {
    this.selectedFiles = [];
    this.filesSelected = null;
    this.textValue = '';
  }

  onFileSelected(event: any) {
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
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach((f: File) => dataTransfer.items.add(f));
      this.filesSelected = dataTransfer.files;
      event.target.value = '';
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach((f: File) => dataTransfer.items.add(f));
    this.filesSelected = dataTransfer.files;
  }

  uploadRawData() {
    const hasText = this.textValue !== null && this.textValue.trim() !== '';
    const params: any = {
      language: 'en', // You can make this dynamic
      data_type: this.selectedDataType,
      title: '', // You can add a title input if needed
    };
    if (hasText) {
      params.text = this.textValue;
      params.files = null;
    } else if (this.filesSelected && this.selectedFiles.length > 0) {
      params.files = this.filesSelected;
      params.text = undefined;
    }
    this.flashcardService.addRawData(this.flashcardId, params).subscribe({
      next: () => {
        this.fetchRawData();
        this.closeAddModal();
      },
    });
  }

  regenerateFlashcard() {
    if (!this.flashcardId) return;
    this.isLoading = true;
    this.flashcardService.regenerateFlashcard(this.flashcardId).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Optionally show a notification or refresh data
        // this.fetchRawData();
        this.router.navigate([`/flashcard/${this.flashcardId}`]);
      },
      error: (err) => {
        this.isLoading = false;
        // Optionally show error notification
      },
    });
  }
}
