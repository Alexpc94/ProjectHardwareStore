import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { TableRowComponent } from '../table-row/table-row.component';
import { AddModStaffComponent } from '../add-mod-staff/add-mod-staff.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';

import { staff } from '../../../models/staff.model';

import { TableFilterService } from '../../../services/table-filter.service';
import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-list-staff',
	imports: [
		AngularSvgIconModule,
		TableRowComponent,
		TableFooterComponent,
		SortHeaderComponent,
		ToggleSwitchComponent,
		AddModStaffComponent,
	],
	templateUrl: './list-staff.component.html',
	styleUrl: './list-staff.component.css',
})
export class ListStaffComponent implements OnInit {
	private _filterService = inject(TableFilterService);
	private _getStaffService = inject(StaffService);

	@ViewChild(TableRowComponent) childComponent!: TableRowComponent;
	@ViewChild(AddModStaffComponent) userModal!: AddModStaffComponent;

	selectedID: any = null;
	selectedTipoPer?: string;
	users = signal<staff[]>([]);
	totalUsers = computed(() => this.users().length);
	itemsPerPage = signal(5);
	currentPage = signal(1);
	isActive: boolean = true;
	userType: string = 'Sistema';

	ngOnInit(): void {
		this.loadUsers(true, this.userType);
	}

	onToggleChange(status: boolean) {
		this.loadUsers(status, this.userType);
	}

	onTypeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.userType = select.value;
		this.loadUsers(this.isActive, this.userType);
	}

	loadUsers(status: boolean, type: string): void {
		this.isActive = status;
		this.userType = type;
		this._getStaffService.getUsers(status, type).subscribe((users) => {
			this.users.set(users);
			//console.log('Usuarios cargados:', users);
			this.currentPage.set(1); // to restart pagination
		});
	}

	filteredData = computed(() => {
		const search = this._filterService.searchField().toLowerCase().trim();

		return this.users().filter((data) => {
			const fullName = `${data.name} ${data.firstName} ${data.secondName}`.toLowerCase();
			const reverseFullName = `${data.secondName} ${data.firstName} ${data.name}`.toLowerCase();

			return (
				fullName.includes(search) ||
				reverseFullName.includes(search) ||
				data.cedula.includes(search) ||
				data.telephone?.toString().includes(search)
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
		return this.filteredData().slice(start, end);
	});

	handlePageChange(page: number) {
		this.currentPage.set(page);
	}

	handleItemsPerPageChange(count: number) {
		this.itemsPerPage.set(count);
		this.currentPage.set(1);
	}

	addUpdateUser(userID?: number, tipoPer?: string) {
		this.selectedID = userID ?? null;
		this.selectedTipoPer = tipoPer ?? this.userType;
		this.userModal.open(this.selectedID, this.selectedTipoPer);
	}

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadUsers(this.isActive, this.userType);
				break;
			case 'edit':
				this.users.update((users) => users.map((user) => (user.id === res.id ? { ...user, ...res.data } : user)));
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable';
				this.users.update((users) => users.map((user) => (user.id === res.id ? { ...user, status: newStatus } : user)));
				break;
			case 'assignType':
				this.users.update((users) => users.filter((user) => user.id !== res.id));
				break;
		}
	}
}
