import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBusisnessSectorsComponent } from './list-busisness-sectors.component';

describe('ListBusisnessSectorsComponent', () => {
  let component: ListBusisnessSectorsComponent;
  let fixture: ComponentFixture<ListBusisnessSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBusisnessSectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBusisnessSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
