import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { tenant } from '../../models/tenant.model';

import { TenantService } from '../../services/tenant.service';
import { OpenStreetMapComponent } from 'src/app/shared/components/open-street-map/open-street-map.component';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-view-tenant',
	imports: [AngularSvgIconModule, OpenStreetMapComponent],
	templateUrl: './view-tenant.component.html',
	styleUrl: './view-tenant.component.css',
})
export class ViewTenantComponent {
	private _getTenantService = inject(TenantService);
	showModal: boolean = false;
	showMap = false;
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

	toggleMap() {
		console.log(this.selectedData.ubicacion_gps?.latitude, this.selectedData.ubicacion_gps?.longitude);
		this.showMap = !this.showMap;
	}

	close() {
		this.showModal = false;
	}
	closeMap() {
		this.showMap = false;
	}
}
