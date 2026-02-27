import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { decinalFormat } from 'src/app/shared/utils/number-format';

import { reatailContainer } from './../../../models/retailContainer.model';
import { ActionEvent } from './../../../models/actions.model';

import { retailContainerService } from '../../../services/retailContainer.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
	selector: '[app-table-row]',
	imports: [
		DatePipe,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		AngularSvgIconModule,
		AlertsComponent,
		ConfirmChangeStatusComponent,
	],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getContainerService = inject(retailContainerService);
	_loginAccessService = inject(AuthService);
	public userData: any = {};

	@Input() rcontainer!: reatailContainer;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<string>();
	@Output() dependencyList = new EventEmitter<reatailContainer>();

	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	stopModalOpen = false;
	decinalFormat = decinalFormat;
	selectedUser: any;
	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	ngOnInit() {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
	}

	openModalToUpdateStatus(id: string, name: string, status: number) {
		//console.log('usuario', this.userData.otherParams.id);
		this.selectedUser = { id, name, status };
		this.confirmDialog.message = status ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedUser) return;
		const { id, status } = this.selectedUser;
		this._getContainerService.modContractStatus(id, this.userData.otherParams.id).subscribe({
			next: (response) => {
				this.save.emit({ action: status ? 'delete' : 'enable', success: true, id: id });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
		this.selectedUser = null;
	}

	// updateContract() {
	// 	this.addModModal.emit(this.contract.codcon);
	// }

	selectRecursiveData(rcontainer: reatailContainer) {
		console.log('Selected rcontainer for dependencies:', rcontainer);
		this.dependencyList.emit(rcontainer);
	}

	stopContainerContract() {
		this.stopModalOpen = true;
	}

	closeTypeModal(): void {
		this.stopModalOpen = false;
		this.formStop.reset();
	}

	formStop = new FormGroup({
		obs: new FormControl<string>('', { nonNullable: true }),
	});

	sendStop() {
		//console.log('shego esto', this.rcontainer.coda);
		const obsValue = this.formStop.get('obs')?.value || '';

		const data = {
			observacion: obsValue,
			codresponsable: this.userData.otherParams.id,
		};

		this._getContainerService.stopContainerContract(this.rcontainer.coda, data).subscribe({
			next: () => {
				this.save.emit({ action: 'stop', success: true, data, id: this.rcontainer.coda });
				this.closeTypeModal();
				this.showAlert('success');
			},
			error: (error) => {
				this.save.emit({ action: 'stop', success: false });
				this.showAlert('error');
			},
		});
	}
}
