import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { environment } from 'src/environments/environment.prod';

import { ViewStaffComponent } from '../view-staff/view-staff.component';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { CredentialStaffComponent } from '../credential-staff/credential-staff.component';
import { RoleAssignmentComponent } from '../role-assignment/role-assignment.component';
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
		AlertsComponent,
		ConfirmChangeStatusComponent,
		CredentialStaffComponent,
		RoleAssignmentComponent,
		ViewStaffComponent,
		UpdateImageComponent,
	],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	private _getStaffService = inject(StaffService);

	@Input() user!: staff;
	@Output() save = new EventEmitter<ActionEvent>();
	@Output() addModModal = new EventEmitter<{ userID?: number; tipoPer?: string }>();

	@ViewChild(ViewStaffComponent) userViewModal!: ViewStaffComponent;
	@ViewChild(UpdateImageComponent) userImageModal!: UpdateImageComponent;
	@ViewChild(CredentialStaffComponent) userCredentialModal!: CredentialStaffComponent;
	@ViewChild(RoleAssignmentComponent) roleAssignmentModal!: RoleAssignmentComponent;
	@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

	selectedUser: any;
	storageUrl = environment.storageUrl;
	typeModalOpen = false;
	userTypes: string[] = ['Sistema', 'Operarios'];
	selectedType: string = '';

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	getUserPhoto(photoPath: string): string {
		return `${this.storageUrl}${photoPath}`;
	}

	viewUser(userID: number) {
		this.userViewModal.open(userID);
	}
	UpdateProfileImage(userID: number) {
		this.userImageModal.open(userID);
	}

	ImageUpdated(res: any) {
		//console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}

	addUpdateCredentials(userID: number, userCredential: string, userCedula: string) {
		this.userCredentialModal.open(userID, userCredential, userCedula);
	}

	addModSaveCredential(res: any) {
		console.log('Credential save response:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}

	UpdateUser(userID: number, tipoPer: string) {
		this.addModModal.emit({ userID, tipoPer });
	}

	openModalToUpdateStatus(id: number, name: string, status: boolean) {
		this.selectedUser = { id, name, status };
		this.confirmDialog.message = status ? 'dar de baja' : 'habilitar';
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
				this.showAlert('error');
			},
		});
		this.selectedUser = null;
	}

	openModalToUpdateType(id: number, name: string, type: string) {
		this.selectedUser = { id, name, type };
		this.typeModalOpen = true;
	}

	closeTypeModal(): void {
		this.typeModalOpen = false;
		this.selectedUser = null;
	}

	changeType() {
		if (!this.selectedUser) return;
		const { id } = this.selectedUser;
		this._getStaffService.modTipoper(id, this.selectedType).subscribe({
			next: (response) => {
				this.save.emit({ action: 'assignType', success: true, id: id });
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
		this.closeTypeModal();
	}

	roleAssignment(userID: number) {
		this.roleAssignmentModal.open(userID);
	}

	roleAssignmentUpdated(res: any) {}
}
