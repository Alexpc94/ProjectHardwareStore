import { Component, Input, ViewChild, Output, EventEmitter, inject, signal } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { AddModSectionComponent } from '../add-mod-section/add-mod-section.component';

import { section } from '../../../models/section.model';
import { ActionEvent } from '../../../models/actions.model';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: '[app-table-row]',
	imports: [AngularSvgIconModule, AlertsComponent, ConfirmChangeStatusComponent, AddModSectionComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getRentalService = inject(RentalService);
	@Input() sections!: section;
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;
	@ViewChild(AddModSectionComponent) sectionModal!: AddModSectionComponent;

	selectedSection: Partial<section> = {};
	selectedID?: number | null;
	codsID?: number | null;
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

	addUpdateSection(sectionID?: number, nombre?: string, cods?: number) {
		console.log('Editando sección ID:', sectionID, 'Nombre:', nombre, 'Cods:', cods);
		this.selectedID = sectionID ?? null;
		this.selectedName = nombre ?? '';
		this.codsID = cods ?? null;
		this.sectionModal.open(this.selectedID, this.selectedName, this.codsID);
	}

	addModSave(res: any) {
		//console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}

	redirectProperty(sectionID?: number) {
		if (!sectionID) return;
		this._getRentalService.setView('predios', sectionID);
	}
}
