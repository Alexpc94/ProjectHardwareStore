import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { decinalFormat } from 'src/app/shared/utils/number-format';

import { contract } from './../../models/contracts.model';
import { ActionEvent } from './../../models/actions.model';

import { ContractService } from '../../services/contract.service';

@Component({
	selector: '[app-table-row]',
	imports: [DatePipe, FormsModule, AngularSvgIconModule, AlertsComponent, ConfirmChangeStatusComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getContractService = inject(ContractService);

	@Input() contract!: contract;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<string>();
	@Output() dependencyList = new EventEmitter<contract>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	decinalFormat = decinalFormat;
	selectedUser: any;
	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	openModalToUpdateStatus(id: string, name: string, status: number) {
		this.selectedUser = { id, name, status };
		this.confirmDialog.message = status ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedUser) return;
		const { id, status } = this.selectedUser;
		// this._getStaffService.modStatus(id).subscribe({
		// 	next: (response) => {
		// 		this.save.emit({ action: status ? 'delete' : 'enable', success: true, id: id });
		// 		this.showAlert('success');
		// 	},
		// 	error: (err) => {
		// 		console.error('Error:', err);
		// 		this.showAlert('error');
		// 	},
		// });
		this.selectedUser = null;
	}

	updateContract() {
		this.addModModal.emit(this.contract.codcon);
	}

	selectRecursiveData(contract: contract) {
		//console.log('Selected contract for dependencies:', contract);
		this.dependencyList.emit(contract);
	}
}
