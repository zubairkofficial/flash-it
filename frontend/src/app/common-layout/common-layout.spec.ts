import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLayout } from './common-layout';

describe('CommonLayout', () => {
  let component: CommonLayout;
  let fixture: ComponentFixture<CommonLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
