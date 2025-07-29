import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tenant } from '../../models/tenant.model';

import { TenantService } from '../../services/tenant.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-view-tenant',
	imports: [],
	templateUrl: './view-tenant.component.html',
	styleUrl: './view-tenant.component.css',
})
export class ViewTenantComponent {
	private _getTenantService = inject(TenantService);
	showModal: boolean = false;
	selectedData!: tenant;
	storageUrl = environment.storageUrl;

	getUserPhoto(photoPath: string): string {
		return `${this.storageUrl}${photoPath}`;
	}

	open(tenantID: number) {
		this._getTenantService.getTenantById(tenantID).subscribe((tenant) => {
			this.selectedData = tenant.data;
			console.log('User data:', this.selectedData);
		});
		this.showModal = true;
	}

	close() {
		this.showModal = false;
	}
}
