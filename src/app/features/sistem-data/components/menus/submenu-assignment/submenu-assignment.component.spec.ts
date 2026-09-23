import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { SubmenuAssignmentComponent } from './submenu-assignment.component';

describe('SubmenuAssignmentComponent', () => {
  let component: SubmenuAssignmentComponent;
  let fixture: ComponentFixture<SubmenuAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmenuAssignmentComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmenuAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
