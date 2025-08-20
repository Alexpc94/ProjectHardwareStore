import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRentalSectionsComponent } from './list-rental-sections.component';

describe('ListRentalSectionsComponent', () => {
  let component: ListRentalSectionsComponent;
  let fixture: ComponentFixture<ListRentalSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRentalSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRentalSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
