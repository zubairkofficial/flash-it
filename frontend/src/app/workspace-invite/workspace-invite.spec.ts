import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceInvite } from './workspace-invite';

describe('WorkspaceInvite', () => {
  let component: WorkspaceInvite;
  let fixture: ComponentFixture<WorkspaceInvite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceInvite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceInvite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
