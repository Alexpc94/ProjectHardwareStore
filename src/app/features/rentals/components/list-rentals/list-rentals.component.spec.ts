import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRentalsComponent } from './list-rentals.component';

describe('ListRentalsComponent', () => {
	let component: ListRentalsComponent;
	let fixture: ComponentFixture<ListRentalsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ListRentalsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ListRentalsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
