import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPrimaryDropdown } from './button-primary-dropdown';

describe('ButtonPrimaryDropdown', () => {
  let component: ButtonPrimaryDropdown;
  let fixture: ComponentFixture<ButtonPrimaryDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPrimaryDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPrimaryDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
