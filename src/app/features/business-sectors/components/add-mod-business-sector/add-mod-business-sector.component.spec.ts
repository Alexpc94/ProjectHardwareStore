import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModBusinessSectorComponent } from './add-mod-business-sector.component';

describe('AddModBusinessSectorComponent', () => {
  let component: AddModBusinessSectorComponent;
  let fixture: ComponentFixture<AddModBusinessSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModBusinessSectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModBusinessSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
