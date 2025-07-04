import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { staff } from '../../../models/staff.model';

import { StaffService } from '../../../services/staff.service';
import { environment } from 'src/environments/environment.prod';
@Component({
	selector: 'app-view-staff',
	imports: [CommonModule],
	templateUrl: './view-staff.component.html',
	styleUrl: './view-staff.component.css',
})
export class ViewStaffComponent {
	private _getStaffService = inject(StaffService);

	showModal: boolean = false;
	selectedData!: staff;
	selectedRoleData!: any;
	apiUrl = environment.apiUrl;

	getUserPhoto(photoPath: string): string {
		return `${this.apiUrl}${photoPath}`;
	}

	open(userID: number) {
		this._getStaffService.getUserById(userID).subscribe((user) => {
			this.selectedData = user.data;
			this.selectedRoleData = user.data2;
			console.log('User data:', this.selectedData);
			console.log('User data2:', this.selectedRoleData);
		});
		this.showModal = true;
	}

	close() {
		this.showModal = false;
	}
}
