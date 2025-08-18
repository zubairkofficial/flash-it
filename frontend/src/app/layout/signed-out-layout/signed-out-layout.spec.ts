import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedOutLayout } from './signed-out-layout';

describe('SignedOutLayout', () => {
  let component: SignedOutLayout;
  let fixture: ComponentFixture<SignedOutLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignedOutLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignedOutLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
