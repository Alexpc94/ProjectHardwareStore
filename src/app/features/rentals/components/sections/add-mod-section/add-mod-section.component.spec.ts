import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModSectionComponent } from './add-mod-section.component';

describe('AddModSectionComponent', () => {
  let component: AddModSectionComponent;
  let fixture: ComponentFixture<AddModSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
