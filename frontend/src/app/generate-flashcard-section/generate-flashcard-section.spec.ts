import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateFlashcardSection } from './generate-flashcard-section';

describe('GenerateFlashcardSection', () => {
  let component: GenerateFlashcardSection;
  let fixture: ComponentFixture<GenerateFlashcardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateFlashcardSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateFlashcardSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
