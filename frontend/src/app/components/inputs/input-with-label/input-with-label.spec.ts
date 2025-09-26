import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithLabel } from './input-with-label';

describe('InputWithLabel', () => {
  let component: InputWithLabel;
  let fixture: ComponentFixture<InputWithLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputWithLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputWithLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
