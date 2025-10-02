import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardShowLayout } from './flashcard-show-layout';

describe('FlashcardShowLayout', () => {
  let component: FlashcardShowLayout;
  let fixture: ComponentFixture<FlashcardShowLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardShowLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardShowLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
