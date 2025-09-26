import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePlanSection } from './price-plan-section';

describe('PricePlanSection', () => {
  let component: PricePlanSection;
  let fixture: ComponentFixture<PricePlanSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricePlanSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricePlanSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
