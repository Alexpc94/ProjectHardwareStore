import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { BSector } from '../../models/BSectort.model';
import { ActionEvent } from '../../models/actions.model';

import { BusinessSectorsService } from '../../services/businessSectors.service';

@Component({
	selector: '[app-table-row]',
	imports: [AngularSvgIconModule, ConfirmChangeStatusComponent, AlertsComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getBusinessSectorsService = inject(BusinessSectorsService);
	@Input() bsector!: BSector;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<string>();
	@Output() dependencyList = new EventEmitter<string>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedBSector: Partial<BSector> = {};
	selectedID?: number | null;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info' | 'dependency-error') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	openModalToUpdateStatus() {
		this.confirmDialog.message = this.bsector.estado ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		const { codc, estado } = this.bsector;
		this._getBusinessSectorsService.modStatus(codc).subscribe({
			next: (response) => {
				if (response?.message?.includes('Cuenta PADRE tiene HIJOS activos')) {
					this.showAlert('dependency-error');
					return;
				}
				this.save.emit({ action: estado ? 'delete' : 'enable', success: true, id: codc });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
	}

	updateSection() {
		this.addModModal.emit(this.bsector.codc);
	}

	selectRecursiveData() {
		this.dependencyList.emit(this.bsector.codc);
	}
}
