import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';

import { AngularSvgIconModule } from 'angular-svg-icon';

import { AddModTenantComponent } from '../add-mod-tenant/add-mod-tenant.component';
import { ViewTenantComponent } from '../view-tenant/view-tenant.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
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
		AddModTenantComponent,
		ViewTenantComponent,
	],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getTenantService = inject(TenantService);
	@Input() tenant!: tenant;
	@Input() rowIndex!: number;
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;
	@ViewChild(AddModTenantComponent) tenantModal!: AddModTenantComponent;
	@ViewChild(ViewTenantComponent) tenantViewModal!: ViewTenantComponent;

	selectedtenant: Partial<tenant> = {};
	selectedID?: number | null;

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

	addUpdateUser(userID?: number) {
		this.selectedID = userID ?? null;
		this.tenantModal.open(this.selectedID);
	}

	addModSave(res: any) {
		console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}

	viewTenant(tenantID: number) {
		this.tenantViewModal.open(tenantID);
	}
}
