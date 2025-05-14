import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { staff } from './../../../models/staff.model';
import { TableRowComponent } from '../table-row/table-row.component';

import { dummyData } from 'src/app/shared/dummy/staff.dummy';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';

import { TableFilterService } from '../../../services/table-filter.service';
@Component({
	selector: 'app-list-staff',
	imports: [AngularSvgIconModule, TableRowComponent, TableFooterComponent, SortHeaderComponent],
	templateUrl: './list-staff.component.html',
	styleUrl: './list-staff.component.css',
})
export class ListStaffComponent implements OnInit {
	private _filterService = inject(TableFilterService);
	users = signal<staff[]>([]);
	totalUsers = computed(() => this.users().length);
	itemsPerPage = signal(5);
	currentPage = signal(1);
	ngOnInit(): void {
		this.users.set(dummyData);
	}

	filteredUsers = computed(() => {
		const search = this._filterService.searchField().toLowerCase().trim();

		return this.users().filter((user) => {
			const fullName = `${user.name} ${user.lastname}`.toLowerCase();
			const reverseFullName = `${user.lastname} ${user.name}`.toLowerCase();

			return (
				fullName.includes(search) ||
				reverseFullName.includes(search) ||
				user.username.toLowerCase().includes(search) ||
				user.phone.includes(search)
			);
		});
	});

	onSearchChange(value: Event) {
		const input = value.target as HTMLInputElement;
		this._filterService.searchField.set(input.value);
		this.currentPage.set(1);
	}

	paginatedData = computed(() => {
		const start = (this.currentPage() - 1) * this.itemsPerPage();
		const end = start + this.itemsPerPage();
		return this.filteredUsers().slice(start, end);
	});

	handlePageChange(page: number) {
		this.currentPage.set(page);
	}

	handleItemsPerPageChange(count: number) {
		this.itemsPerPage.set(count);
		this.currentPage.set(1);
	}
}
