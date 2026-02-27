import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModContractComponent } from './add-mod-contract.component';

describe('AddModContractComponent', () => {
  let component: AddModContractComponent;
  let fixture: ComponentFixture<AddModContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
