import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModOwnershipsComponent } from './add-mod-ownerships.component';

describe('AddModOwnershipsComponent', () => {
  let component: AddModOwnershipsComponent;
  let fixture: ComponentFixture<AddModOwnershipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModOwnershipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModOwnershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
