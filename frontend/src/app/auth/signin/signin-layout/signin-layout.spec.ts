import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninLayout } from './signin-layout';

describe('SigninLayout', () => {
  let component: SigninLayout;
  let fixture: ComponentFixture<SigninLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
