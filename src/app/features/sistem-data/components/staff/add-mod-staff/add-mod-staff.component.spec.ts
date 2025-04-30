import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModStaffComponent } from './add-mod-staff.component';

describe('AddModStaffComponent', () => {
  let component: AddModStaffComponent;
  let fixture: ComponentFixture<AddModStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
