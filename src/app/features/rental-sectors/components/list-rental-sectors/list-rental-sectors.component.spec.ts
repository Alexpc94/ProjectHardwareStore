import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRentalSectorsComponent } from './list-rental-sectors.component';

describe('ListRentalSectorsComponent', () => {
  let component: ListRentalSectorsComponent;
  let fixture: ComponentFixture<ListRentalSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRentalSectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRentalSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
