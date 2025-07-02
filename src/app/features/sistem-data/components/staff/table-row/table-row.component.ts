import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AddModStaffComponent } from '../add-mod-staff/add-mod-staff.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { staff } from './../../../models/staff.model';
import { ActionEvent } from '../../../models/Actions.model';
import { StaffService } from '../../../services/staff.service';
import { environment } from 'src/environments/environment.prod';
@Component({
	selector: '[app-table-row]',
	imports: [FormsModule, AngularSvgIconModule, AddModStaffComponent, AlertsComponent, ConfirmChangeStatusComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	@Input() user!: staff;
	@Output() save = new EventEmitter<ActionEvent>();
	selectedID: any = null;
	@ViewChild(AddModStaffComponent) userModal!: AddModStaffComponent;
	apiUrl = environment.apiUrl;
	saveSubscription!: Subscription;
	private _getStaffService = inject(StaffService);
	alertType: '' | 'success' | 'error' | 'info' = '';

	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = ''; // Reiniciar para forzar cambio
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	getUserPhoto(photoPath: string): string {
		return `${this.apiUrl}${photoPath}`;
	}

	viewUser(id: number) {}

	handleSave(user: any) {}

	addUpdateUser(userID?: number) {
		if (userID) {
			this.selectedID = userID;
		} else {
			this.selectedID = null;
		}
		this.userModal.selectedID = this.selectedID;
		this.userModal.open();
	}

	selectedUser: { id: number; name: string; status: boolean } | null = null;
	openModal(id: number, name: string, status: boolean) {
		this.selectedUser = { id, name, status };
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

	cancelModal() {
		this.selectedUser = null;
	}

	ngAfterViewInit(): void {
		this.saveSubscription = this.userModal.save.subscribe((res) => {
			console.log('Respuesta:', res);
			if (!res.success) return this.showAlert('error');
			this.save.emit(res);
			this.showAlert('success');
		});
	}

	ngOnDestroy() {
		this.saveSubscription?.unsubscribe();
	}
}
