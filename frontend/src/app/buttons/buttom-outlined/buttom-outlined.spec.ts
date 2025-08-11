import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomOutlined } from './buttom-outlined';

describe('ButtomOutlined', () => {
  let component: ButtomOutlined;
  let fixture: ComponentFixture<ButtomOutlined>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtomOutlined]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomOutlined);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
