import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractLogsComponent } from './contract-logs.component';

describe('ContractLogsComponent', () => {
  let component: ContractLogsComponent;
  let fixture: ComponentFixture<ContractLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
