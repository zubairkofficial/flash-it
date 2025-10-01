import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardCreate } from './flashcard-create';

describe('FlashcardCreate', () => {
  let component: FlashcardCreate;
  let fixture: ComponentFixture<FlashcardCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
