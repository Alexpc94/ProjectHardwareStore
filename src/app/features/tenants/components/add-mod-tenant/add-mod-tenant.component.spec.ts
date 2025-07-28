import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModTenantComponent } from './add-mod-tenant.component';

describe('AddModTenantComponent', () => {
  let component: AddModTenantComponent;
  let fixture: ComponentFixture<AddModTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
