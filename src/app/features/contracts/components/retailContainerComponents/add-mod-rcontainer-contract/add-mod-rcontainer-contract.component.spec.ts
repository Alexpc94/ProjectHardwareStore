import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModRContainerContractComponent } from './add-mod-rcontainer-contract.component';

describe('AddModRContainerContractComponent', () => {
  let component: AddModRContainerContractComponent;
  let fixture: ComponentFixture<AddModRContainerContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModRContainerContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModRContainerContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
