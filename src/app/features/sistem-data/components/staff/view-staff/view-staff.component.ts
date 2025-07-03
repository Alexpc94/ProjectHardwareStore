import { Component, Input, inject } from '@angular/core';

import { staff } from '../../../models/staff.model';

import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-view-staff',
	imports: [],
	templateUrl: './view-staff.component.html',
	styleUrl: './view-staff.component.css',
})
export class ViewStaffComponent {
	private _getStaffService = inject(StaffService);

	showModal: boolean = false;
	selectedData?: staff;

	open(userID: number) {
		this._getStaffService.getUserById(userID).subscribe((user) => {
			this.selectedData = user;
			console.log('User data:', this.selectedData);
		});
		this.showModal = true;
	}

	close() {
		this.showModal = false;
	}
}
