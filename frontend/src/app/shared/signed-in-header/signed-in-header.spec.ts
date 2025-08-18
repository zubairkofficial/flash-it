import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedInHeader } from './signed-in-header';

describe('SignedInHeader', () => {
  let component: SignedInHeader;
  let fixture: ComponentFixture<SignedInHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignedInHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignedInHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
