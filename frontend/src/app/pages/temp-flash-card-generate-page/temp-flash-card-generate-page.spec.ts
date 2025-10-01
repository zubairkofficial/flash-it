import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempFlashCardGeneratePage } from './temp-flash-card-generate-page';

describe('TempFlashCardGeneratePage', () => {
  let component: TempFlashCardGeneratePage;
  let fixture: ComponentFixture<TempFlashCardGeneratePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempFlashCardGeneratePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempFlashCardGeneratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
