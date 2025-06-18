import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { staff } from './../../../models/staff.model';
import { TableRowComponent } from '../table-row/table-row.component';

import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';

import { TableFilterService } from '../../../services/table-filter.service';
import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-list-staff',
	imports: [AngularSvgIconModule, TableRowComponent, TableFooterComponent, SortHeaderComponent, ToggleSwitchComponent],
	templateUrl: './list-staff.component.html',
	styleUrl: './list-staff.component.css',
})
export class ListStaffComponent implements OnInit {
	@ViewChild(TableRowComponent) childComponent!: TableRowComponent;
	private _filterService = inject(TableFilterService);
	private _getStaffService = inject(StaffService);
	users = signal<staff[]>([]);
	totalUsers = computed(() => this.users().length);
	itemsPerPage = signal(5);
	currentPage = signal(1);
	isActive = signal(true);

	addUser(): void {
		this.childComponent.addUpdateUser(); // sin argumentos
	}

	ngOnInit(): void {
		this._getStaffService.getUsers(this.isActive()).subscribe((users) => {
			this.users.set(users);
		});
	}

	filteredUsers = computed(() => {
		const search = this._filterService.searchField().toLowerCase().trim();

		return this.users().filter((user) => {
			const fullName = `${user.name} ${user.firstName} ${user.secondName}`.toLowerCase();
			const reverseFullName = `${user.secondName} ${user.firstName} ${user.name}`.toLowerCase();

			const matchesSearch = fullName.includes(search) || reverseFullName.includes(search);
			user.cedula.toLowerCase().includes(search);
			//user.telephone.includes(search);

			const matchesStatus = user.status === this.isActive();

			return matchesSearch && matchesStatus;
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
