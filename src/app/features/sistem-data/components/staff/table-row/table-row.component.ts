import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { environment } from 'src/environments/environment.prod';

import { AddModStaffComponent } from '../add-mod-staff/add-mod-staff.component';
import { ViewStaffComponent } from '../view-staff/view-staff.component';
import { CredentialStaffComponent } from '../credential-staff/credential-staff.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';

import { staff } from './../../../models/staff.model';
import { ActionEvent } from '../../../models/Actions.model';

import { StaffService } from '../../../services/staff.service';
@Component({
	selector: '[app-table-row]',
	imports: [
		FormsModule,
		AngularSvgIconModule,
		AddModStaffComponent,
		AlertsComponent,
		ConfirmChangeStatusComponent,
		CredentialStaffComponent,
		ViewStaffComponent,
	],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getStaffService = inject(StaffService);

	@Input() user!: staff;
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild(AddModStaffComponent) userModal!: AddModStaffComponent;
	@ViewChild(ViewStaffComponent) userViewModal!: ViewStaffComponent;
	@ViewChild(CredentialStaffComponent) userCredentialModal!: CredentialStaffComponent;
	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedID: any = null;
	selectedUser: any;
	apiUrl = environment.apiUrl;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	getUserPhoto(photoPath: string): string {
		return `${this.apiUrl}${photoPath}`;
	}

	viewUser(userID: number) {
		this.userViewModal.open(userID);
	}

	addUpdateCredentials(userID: number, userCredential?: string) {
		this.userCredentialModal.open(userID, userCredential);
	}

	addModSaveCredential(res: any) {
		console.log('Credential save response:', res);
	}

	addUpdateUser(userID?: number) {
		if (userID) {
			this.selectedID = userID;
		} else {
			this.selectedID = null;
		}
		this.userModal.open(this.selectedID);
	}

	addModSave(res: any) {
		console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}

	openModalToUpdateStatus(id: number, name: string, status: boolean) {
		this.selectedUser = { id, name, status };
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedUser) return;
		const { id, status } = this.selectedUser;
		this._getStaffService.modStatus(id).subscribe({
			next: (response) => {
				this.save.emit({ action: status ? 'delete' : 'enable', success: true, id: id });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.save.emit({ action: 'edit', success: false });
				this.showAlert('error');
			},
		});
		this.selectedUser = null;
	}
}
