import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { tenant } from '../../models/tenant.model';

import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';

import { TableFilterService } from '../../services/table-filter.service';
import { TenantService } from '../../services/tenant.service';

@Component({
	selector: 'app-list-tenants',
	imports: [ToggleSwitchComponent, TableFooterComponent, SortHeaderComponent, AngularSvgIconModule],
	templateUrl: './list-tenants.component.html',
	styleUrl: './list-tenants.component.css',
})
export class ListTenantsComponent {
	private _filterService = inject(TableFilterService);
	private _getTenantService = inject(TenantService);

	tenants = signal<tenant[]>([]);
	totalTenants!: number;
	itemsPerPage = signal(5);
	currentPage = signal(1);

	isActive: boolean = true;

	ngOnInit(): void {
		this.loadTenants(true);
	}

	loadTenants(status: boolean): void {
		this.isActive = status;
		const size = this.itemsPerPage();
		const page = this.currentPage() - 1;
		this._getTenantService
			.getTenants(status, {
				page,
				size,
				sort: ['id'],
			})
			.subscribe((data) => {
				//this.users.set(users);
				this.totalTenants = data.totalElements;
				console.log('Total Tenants:', data);
				this.tenants.set(data.content);
				//this.currentPage.set(1); // to restart pagination
			});
	}

	filteredData = computed(() => {
		const search = this._filterService.searchField().toLowerCase().trim();

		return this.tenants().filter((data) => {
			const fullName = `${data.nombre} ${data.ap} ${data.am}`.toLowerCase();
			const reverseFullName = `${data.am} ${data.ap} ${data.nombre}`.toLowerCase();
			return fullName.includes(search) || reverseFullName.includes(search);
		});
	});

	onSearchChange(value: Event) {
		const input = value.target as HTMLInputElement;
		this._filterService.searchField.set(input.value);
		//this.currentPage.set(1);
	}

	handlePageChange(page: number) {
		this.currentPage.set(page);
		this.loadTenants(this.isActive);
	}

	handleItemsPerPageChange(count: number) {
		this.itemsPerPage.set(count);
		this.currentPage.set(1);
		this.loadTenants(this.isActive);
	}
}
