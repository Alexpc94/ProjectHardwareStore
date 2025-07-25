import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';

import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { tenant } from '../../models/tenant.model';
import { ActionEvent } from '../../models/actions.model';

import { TenantService } from '../../services/tenant.service';

@Component({
	selector: '[app-table-row]',
	imports: [AngularSvgIconModule, ConfirmChangeStatusComponent, AlertsComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getTenantService = inject(TenantService);
	@Input() tenant!: tenant;
	@Input() rowIndex!: number;
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedtenant: Partial<tenant> = {};

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
}
