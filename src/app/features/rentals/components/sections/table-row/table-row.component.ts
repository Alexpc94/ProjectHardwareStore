import { Component, Input, ViewChild, Output, EventEmitter, inject, signal } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { section } from '../../../models/section.model';
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
	@Input() sections!: section;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<{ sectionID: number; name: string; cods: number }>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedSection: Partial<section> = {};
	selectedName?: string;
	selectedView = signal<'all' | 'sectores' | 'secciones' | 'predios'>('all');

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	openModalToUpdateStatus(codsec: number, nombre: string, estado: number) {
		this.selectedSection = { codsec, nombre, estado };
		this.confirmDialog.message = estado ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedSection) return;
		const { codsec, estado } = this.selectedSection;
		this._getRentalService.modSectionStatus(codsec!, estado!).subscribe({
			next: (response) => {
				this.save.emit({ action: estado ? 'delete' : 'enable', success: true, id: codsec });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
		this.selectedSection = {};
	}

	updateSection(sectionID: number, name: string, cods: number) {
		this.addModModal.emit({ sectionID, name, cods });
	}

	redirectProperty(sectionID?: number) {
		if (!sectionID) return;
		this._getRentalService.setView('predios', sectionID);
	}
}
