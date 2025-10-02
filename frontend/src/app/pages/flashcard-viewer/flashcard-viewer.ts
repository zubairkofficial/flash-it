import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FlashcardService } from '../../../services/flashcard/flashcard';
import { globalInstance } from '../../../utils/global.utils';
import { Api } from '../../../utils/api/api';

type Slide = {
  id: number;
  slide_type: 'concise' | 'standard' | 'detailed';
  title: string;
  text: string;
};

@Component({
  selector: 'app-flashcard-viewer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  providers: [Api, FlashcardService],
  templateUrl: './flashcard-viewer.html',
  styleUrl: './flashcard-viewer.css',
})
export class FlashcardViewer implements OnInit {
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public flashcard: any = null;
  public activeTab: 'concise' | 'standard' | 'detailed' = 'concise';
  public currentIndex: number = 0;
  private touchStartX: number | null = null;
  private touchEndX: number | null = null;
  public tabs: Array<'concise' | 'standard' | 'detailed'> = [
    'concise',
    'standard',
    'detailed',
  ];

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid flashcard id';
      return;
    }
    this.fetchFlashcard(id);
  }

  private fetchFlashcard(id: number): void {
    this.isLoading = true;
    this.flashcardService.getFlashcardById(id).subscribe({
      next: (data: any) => {
        this.flashcard = data;
        this.isLoading = false;
        this.currentIndex = 0;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to load flashcard.';
        this.isLoading = false;
      },
    });
  }

  public setTab(tab: 'concise' | 'standard' | 'detailed'): void {
    this.activeTab = tab;
    this.currentIndex = 0;
  }

  public get filteredSlides(): Slide[] {
    const slides: Slide[] = this.flashcard?.slides || [];
    return slides.filter((s) => s.slide_type === this.activeTab);
  }

  public prev(): void {
    const slides = this.filteredSlides;
    if (!slides.length) return;
    this.currentIndex = (this.currentIndex - 1 + slides.length) % slides.length;
  }

  public next(): void {
    const slides = this.filteredSlides;
    if (!slides.length) return;
    this.currentIndex = (this.currentIndex + 1) % slides.length;
  }

  public get progressPercent(): number {
    const slides = this.filteredSlides.length;
    if (!slides) return 0;
    return ((this.currentIndex + 1) / slides) * 100;
  }

  @HostListener('window:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  public onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }
  public handleFlashCardDownload(flashCardSlide: any): void {
    console.log('flashCardSlideId', flashCardSlide);
    const downloadUrl = `${globalInstance
      .getInstance()
      .getURL()}/flashcard-slides/${flashCardSlide[0].flashcard_id}`;

    window.open(downloadUrl, '_blank');
  }

  public onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    if (this.touchStartX === null || this.touchEndX === null) return;
    const deltaX = this.touchEndX - this.touchStartX;
    const threshold = 40;
    if (deltaX > threshold) {
      this.prev();
    } else if (deltaX < -threshold) {
      this.next();
    }
    this.touchStartX = null;
    this.touchEndX = null;
  }

  goBack() {
    this.router.navigate(['workspace', this.flashcard.workspace_id]);
  }
}
