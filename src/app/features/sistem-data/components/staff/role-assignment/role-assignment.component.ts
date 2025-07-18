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
		forkJoin({
			userResponse: this._getStaffService.getUserById(userID),
			roles: this._getRolesService.getRoles(),
		}).subscribe(({ userResponse, roles }) => {
			this.selectedData = userResponse.data;
			this.selectedRoleData = userResponse.data2 || [];

			this.listRoles = roles.filter((role: any) => {
				return !this.selectedRoleData.some((r: any) => r.id_role === role.id_role);
			});
		});

		this.showModal = true;
	}
	assignRole(id_role: number, action: boolean) {
		const data = {
			id_person: this.selectedData.id,
			id_role: id_role,
		};
		if (action) {
			this._getRolesService.assignRole(data).subscribe({
				next: () => {
					const assignedRole = this.listRoles.find((role) => role.id_role === id_role);
					if (assignedRole) {
						this.selectedRoleData.push(assignedRole);
						this.listRoles = this.listRoles.filter((role) => role.id_role !== id_role);
					}
				},
			});
		} else {
			this._getRolesService.assignRole(data).subscribe({
				next: () => {
					const removedRole = this.selectedRoleData.find((role) => role.id_role === id_role);
					if (removedRole) {
						this.selectedRoleData = this.selectedRoleData.filter((role) => role.id_role !== id_role);
						this.listRoles.push(removedRole);
					}
				},
			});
		}
	}

	close() {
		this.showModal = false;
		this.selectedRoleData = [];
		this.listRoles = [];
	}
}
