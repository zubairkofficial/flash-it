import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpLayout } from './sign-up-layout';

describe('SignUpLayout', () => {
  let component: SignUpLayout;
  let fixture: ComponentFixture<SignUpLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
