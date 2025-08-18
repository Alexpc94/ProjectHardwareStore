import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModSectorComponent } from './add-mod-sector.component';

describe('AddModSectorComponent', () => {
  let component: AddModSectorComponent;
  let fixture: ComponentFixture<AddModSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModSectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
