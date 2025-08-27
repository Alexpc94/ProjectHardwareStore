import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { tenant } from '../../models/tenant.model';

import { TableRowComponent } from '../table-row/table-row.component';
import { AddModTenantComponent } from '../add-mod-tenant/add-mod-tenant.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';

import { TenantService } from '../../services/tenant.service';

@Component({
	selector: 'app-list-tenants',
	imports: [
		ToggleSwitchComponent,
		TableFooterComponent,
		SortHeaderComponent,
		AngularSvgIconModule,
		TableRowComponent,
		AddModTenantComponent,
	],
	templateUrl: './list-tenants.component.html',
	styleUrl: './list-tenants.component.css',
})
export class ListTenantsComponent {
	private searchDebounceTimer?: any;
	constructor(private _getTenantService: TenantService) {
		effect(() => {
			this.loadTenants();
		});
	}

	@ViewChild(AddModTenantComponent) tenantModal!: AddModTenantComponent;

	selectedID: any = null;
	tenants = signal<tenant[]>([]);
	totalTenants!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	loadTenants(): void {
		const status = this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getTenantService.getTenants(status, searchTerm, { page, size, sort }).subscribe((data) => {
			this.totalTenants = data.totalElements;
			this.tenants.set(data.content);
		});
	}

	onToggleChange(status: boolean) {
		this.isActive.set(status);
		this.currentPage.set(1);
	}

	onSearchChange(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value?.toLowerCase().trim();
		const input = inputValue ? inputValue : ' ';
		if (this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
		}
		this.searchDebounceTimer = setTimeout(() => {
			this.search.set(input);
			this.currentPage.set(1);
		}, 500);
		this.currentPage.set(1);
	}

	handlePageChange(page: number) {
		this.currentPage.set(page);
	}

	handleItemsPerPageChange(count: number) {
		this.itemsPerPage.set(count);
		this.currentPage.set(1);
	}

	onSortChange(column: string) {
		if (this.sortBy() === column) {
			this.sortDirection.set(this.sortDirection() === 'ASC' ? 'DESC' : 'ASC');
		} else {
			this.sortBy.set(column);
			this.sortDirection.set('ASC');
		}
		this.currentPage.set(1);
	}

	addUpdateUser(userID?: number) {
		this.selectedID = userID ?? null;
		this.tenantModal.open(this.selectedID);
	}

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadTenants();
				break;
			case 'edit':
				this.tenants.update((tenants) =>
					tenants.map((tenant) => {
						if (tenant.id !== res.id) return tenant;
						const { latitude, longitude, ...restData } = res.data;
						return {
							...tenant,
							...restData,
							ubicacion_gps: {
								...tenant.ubicacion_gps,
								latitude,
								longitude,
							},
						};
					}),
				);
				break;
			case 'editLocation':
				this.tenants.update((tenants) =>
					tenants.map((tenant) =>
						tenant.id === res.id ? { ...tenant, ubicacion_gps: { ...tenant.ubicacion_gps, ...res.data } } : tenant,
					),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable';
				this.tenants.update((tenants) =>
					tenants.map((tenant) => (tenant.id === res.id ? { ...tenant, estado: newStatus } : tenant)),
				);
				break;
		}
	}
}
