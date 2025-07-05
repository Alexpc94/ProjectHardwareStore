import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialStaffComponent } from './credential-staff.component';

describe('CredentialStaffComponent', () => {
  let component: CredentialStaffComponent;
  let fixture: ComponentFixture<CredentialStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
