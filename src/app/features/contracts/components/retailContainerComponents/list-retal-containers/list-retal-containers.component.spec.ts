import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRetalContainersComponent } from './list-retal-containers.component';

describe('ListRetalContainersComponent', () => {
  let component: ListRetalContainersComponent;
  let fixture: ComponentFixture<ListRetalContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRetalContainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRetalContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
