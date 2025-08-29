import { Component, Input, ViewChild, Output, EventEmitter, inject, signal } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { ownership } from '../../../models/ownership.model';
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
	@Input() ownerships!: ownership;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<{ ownershipID: string }>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedView = signal<'all' | 'sectores' | 'secciones' | 'predios'>('all');

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	openModalToUpdateStatus() {
		this.confirmDialog.message = this.ownerships.estado ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		const { codpre, estado } = this.ownerships;
		this._getRentalService.modOwnershipStatus(codpre!, estado!).subscribe({
			next: (response) => {
				this.save.emit({ action: estado ? 'delete' : 'enable', success: true, id: codpre });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
	}

	updateSection() {
		this.addModModal.emit({ ownershipID: this.ownerships.codpre });
	}
}
