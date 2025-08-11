import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomPrimary } from './buttom-primary';

describe('ButtomPrimary', () => {
  let component: ButtomPrimary;
  let fixture: ComponentFixture<ButtomPrimary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtomPrimary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomPrimary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
