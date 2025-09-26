import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedOutHeader } from './signed-out-header';

describe('SignedOutHeader', () => {
  let component: SignedOutHeader;
  let fixture: ComponentFixture<SignedOutHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignedOutHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignedOutHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
