import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ViewTenantComponent } from '../view-tenant/view-tenant.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { OpenStreetMapComponent } from 'src/app/shared/components/open-street-map/open-street-map.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { tenant } from '../../models/tenant.model';
import { ActionEvent } from '../../models/actions.model';

import { TenantService } from '../../services/tenant.service';

@Component({
	selector: '[app-table-row]',
	imports: [
		AngularSvgIconModule,
		ConfirmChangeStatusComponent,
		AlertsComponent,
		ViewTenantComponent,
		OpenStreetMapComponent,
	],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getTenantService = inject(TenantService);
	@Input() tenant!: tenant;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<number>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;
	@ViewChild(ViewTenantComponent) tenantViewModal!: ViewTenantComponent;

	selectedtenant: Partial<tenant> = {};
	selectedID?: number | null;
	showMap: boolean = false;
	latitude?: number;
	longitude?: number;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	openModalToUpdateStatus(id: number, nombre: string, estado: boolean) {
		this.selectedtenant = { id, nombre, estado };
		this.confirmDialog.message = estado ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedtenant) return;
		const { id, estado } = this.selectedtenant;
		this._getTenantService.modStatus(id!).subscribe({
			next: (response) => {
				this.save.emit({ action: estado ? 'delete' : 'enable', success: true, id: id });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
		this.selectedtenant = {};
	}

	UpdateUser(userID: number) {
		this.addModModal.emit(userID);
	}

	viewTenant(tenantID: number) {
		this.tenantViewModal.open(tenantID);
	}

	toggleMap(id: number, lat?: number, lng?: number) {
		this.showMap = !this.showMap;
		this.latitude = lat;
		this.longitude = lng;
		this.selectedID = id;
	}

	onLocationChanged(coords: { lat: number; lng: number }) {
		this.latitude = coords.lat;
		this.longitude = coords.lng;
	}
	saveLocation() {
		//console.log('New coordinates:', this.latidude, this.longitude, 'id:', this.selectedID);
		const data = {
			id: this.selectedID,
			latitude: this.latitude,
			longitude: this.longitude,
		};
		const formData = new FormData();
		formData.append('inquilinos', new Blob([JSON.stringify(data)], { type: 'application/json' }));
		this._getTenantService.updateLocationData(formData, this.selectedID!).subscribe({
			next: () => {
				//console.log('user updated:', response);
				this.save.emit({ action: 'editLocation', success: true, data, id: this.selectedID! });
				this.showAlert('success');
				this.closeMap();
			},
			error: () => {
				this.showAlert('error');
			},
		});
	}
	closeMap() {
		this.showMap = false;
	}
}
