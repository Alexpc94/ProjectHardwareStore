import { Component, Input, ViewChild, Output, EventEmitter, inject, signal } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { sector } from '../../../models/sector.model';
import { ActionEvent } from '../../../models/actions.model';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: '[app-table-row]',
	imports: [AngularSvgIconModule, AlertsComponent, ConfirmChangeStatusComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getRentalService = inject(RentalService);
	@Input() sectors!: sector;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<{ sectorID: number; sectorName: string }>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedSector: Partial<sector> = {};
	selectedView = signal<'all' | 'sectores' | 'secciones' | 'predios'>('all');

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
		this._getRentalService.modStatus(cods!, estado!).subscribe({
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

	updateSector(sectorID: number, sectorName: string) {
		this.addModModal.emit({ sectorID, sectorName });
	}

	redirectSection(sectorID?: number) {
		if (!sectorID) return;
		this._getRentalService.setView('secciones', sectorID);
	}
}
