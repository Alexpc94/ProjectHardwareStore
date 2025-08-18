import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { AddModSectorComponent } from '../add-mod-sector/add-mod-sector.component';

import { sector } from '../../../models/sector.model';
import { ActionEvent } from '../../../models/actions.model';

import { SectorService } from '../../../services/sectors.service';

@Component({
	selector: '[app-table-row]',
	imports: [AngularSvgIconModule, AlertsComponent, ConfirmChangeStatusComponent, AddModSectorComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getSectorService = inject(SectorService);
	@Input() sectors!: sector;
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;
	@ViewChild(AddModSectorComponent) tenantModal!: AddModSectorComponent;

	selectedSector: Partial<sector> = {};
	selectedID?: number | null;
	selectedName?: string;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	openModalToUpdateStatus(cods: number, nombre: string, estado: number) {
		this.selectedSector = { cods, nombre, estado };
		this.confirmDialog.message = estado ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedSector) return;
		const { cods, estado } = this.selectedSector;
		this._getSectorService.modStatus(cods!, estado!).subscribe({
			next: (response) => {
				this.save.emit({ action: estado ? 'delete' : 'enable', success: true, id: cods });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
		this.selectedSector = {};
	}

	addUpdateSector(userID?: number, nombre?: string) {
		this.selectedID = userID ?? null;
		this.selectedName = nombre ?? '';
		this.tenantModal.open(this.selectedID, this.selectedName);
	}

	addModSave(res: any) {
		//console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}
}
