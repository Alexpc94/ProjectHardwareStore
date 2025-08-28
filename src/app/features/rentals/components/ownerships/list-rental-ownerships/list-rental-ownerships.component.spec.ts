import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRentalOwnershipsComponent } from './list-rental-ownerships.component';

describe('ListRentalOwnershipsComponent', () => {
  let component: ListRentalOwnershipsComponent;
  let fixture: ComponentFixture<ListRentalOwnershipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRentalOwnershipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRentalOwnershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
