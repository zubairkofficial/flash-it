import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanCard } from './subscription-plan-card';

describe('SubscriptionPlanCard', () => {
  let component: SubscriptionPlanCard;
  let fixture: ComponentFixture<SubscriptionPlanCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlanCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
