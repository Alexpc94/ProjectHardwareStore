import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { tenant } from '../../models/tenant.model';

import { TableFilterService } from '../../services/table-filter.service';
import { TenantService } from '../../services/tenant.service';

@Component({
	selector: 'app-list-tenants',
	imports: [],
	templateUrl: './list-tenants.component.html',
	styleUrl: './list-tenants.component.css',
})
export class ListTenantsComponent {
	private _filterService = inject(TableFilterService);
	private _getTenantService = inject(TenantService);

	isActive: boolean = true;

	ngOnInit(): void {
		this.loadTenants(true);
	}

	loadTenants(status: boolean): void {
		this.isActive = status;
		this._getTenantService
			.getTenants(status, {
				page: 0,
				size: 5,
				sort: ['id'],
			})
			.subscribe((data) => {
				//this.users.set(users);
				console.log('Usuarios cargados:', data.content);
				console.log('total usuarios:', data.totalElements);
				//this.currentPage.set(1); // to restart pagination
			});
	}
}
