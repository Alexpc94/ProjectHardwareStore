import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { TableRowComponent } from '../table-row/table-row.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';

import { staff } from './../../../models/staff.model';

import { TableFilterService } from '../../../services/table-filter.service';
import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-list-staff',
	imports: [AngularSvgIconModule, TableRowComponent, TableFooterComponent, SortHeaderComponent, ToggleSwitchComponent],
	templateUrl: './list-staff.component.html',
	styleUrl: './list-staff.component.css',
})
export class ListStaffComponent implements OnInit {
	private _filterService = inject(TableFilterService);
	private _getStaffService = inject(StaffService);

	@ViewChild(TableRowComponent) childComponent!: TableRowComponent;

	users = signal<staff[]>([]);
	totalUsers = computed(() => this.users().length);
	itemsPerPage = signal(5);
	currentPage = signal(1);
	isActive = true;
	addUser(): void {
		this.childComponent.addUpdateUser();
	}

	ngOnInit(): void {
		this.loadUsers(true);
	}

	loadUsers(status: boolean): void {
		this.isActive = status;
		this._getStaffService.getUsers(status).subscribe((users) => {
			this.users.set(users);
			this.currentPage.set(1); // opcional: resetear página al cambiar estado
		});
	}

	filteredUsers = computed(() => {
		const search = this._filterService.searchField().toLowerCase().trim();

		return this.users().filter((user) => {
			const fullName = `${user.name} ${user.firstName} ${user.secondName}`.toLowerCase();
			const reverseFullName = `${user.secondName} ${user.firstName} ${user.name}`.toLowerCase();

			return (
				fullName.includes(search) ||
				reverseFullName.includes(search) ||
				user.cedula.includes(search) ||
				user.telephone?.toString().includes(search)
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

	handleUserSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadUsers(true);
				break;
			case 'edit':
				this.users.update((users) => users.map((user) => (user.id === res.id ? { ...user, ...res.data } : user)));
				break;
			case 'delete':
				this.users.update((users) => users.map((user) => (user.id === res.id ? { ...user, status: false } : user)));
				break;
			case 'enable':
				this.users.update((users) => users.map((user) => (user.id === res.id ? { ...user, status: true } : user)));
				break;
		}
	}
}
