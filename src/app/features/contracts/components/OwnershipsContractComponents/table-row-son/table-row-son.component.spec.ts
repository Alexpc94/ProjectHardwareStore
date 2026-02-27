import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowSonComponent } from './table-row-son.component';

describe('TableRowSonComponent', () => {
  let component: TableRowSonComponent;
  let fixture: ComponentFixture<TableRowSonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRowSonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRowSonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
