import { Component, inject } from '@angular/core';

import { staff } from '../../../models/staff.model';
import { roles } from '../../../models/roles.model';

import { StaffService } from '../../../services/staff.service';
import { RolesService } from '../../../services/roles.service';
import { forkJoin } from 'rxjs';
@Component({
	selector: 'app-role-assignment',
	imports: [],
	templateUrl: './role-assignment.component.html',
	styleUrl: './role-assignment.component.css',
})
export class RoleAssignmentComponent {
	private _getStaffService = inject(StaffService);
	private _getRolesService = inject(RolesService);
	showModal: boolean = false;
	selectedData!: staff;
	selectedRoleData!: roles[];
	listRoles: roles[] = [];
	open(userID: number) {
		console.log('Role assignment modal opened for user ID:', userID);
		forkJoin({
			userResponse: this._getStaffService.getUserById(userID),
			roles: this._getRolesService.getRoles(),
		}).subscribe(({ userResponse, roles }) => {
			this.selectedData = userResponse.data;
			this.selectedRoleData = userResponse.data2 || [];

			this.listRoles = roles.filter((role: any) => {
				return !this.selectedRoleData.some((r: any) => r.id_role === role.id_role);
			});

			console.log('Roles disponibles para asignar:', this.listRoles);
		});

		this.showModal = true;
	}
	assignRole(id_role: number) {
		console.log('Assigning role ID:', id_role, 'to user ID:', this.selectedData.id);
	}

	close() {
		this.showModal = false;
	}
}
