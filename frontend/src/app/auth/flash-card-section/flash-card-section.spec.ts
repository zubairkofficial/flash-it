import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardSection } from './flash-card-section';

describe('FlashCardSection', () => {
  let component: FlashCardSection;
  let fixture: ComponentFixture<FlashCardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashCardSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashCardSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
