import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomLogoText } from './buttom-logo-text';

describe('ButtomLogoText', () => {
  let component: ButtomLogoText;
  let fixture: ComponentFixture<ButtomLogoText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtomLogoText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomLogoText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
