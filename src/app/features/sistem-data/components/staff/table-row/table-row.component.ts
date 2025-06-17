import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AddModStaffComponent } from '../add-mod-staff/add-mod-staff.component';

import { staff } from './../../../models/staff.model';
import { environment } from 'src/environments/environment.prod';
@Component({
	selector: '[app-table-row]',
	imports: [FormsModule, AngularSvgIconModule, AddModStaffComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	@Input() user!: staff;
	selectedData: any = null;
	@ViewChild(AddModStaffComponent) userModal!: AddModStaffComponent;
	apiUrl = environment.apiUrl;

	getUserPhoto(photoPath: string): string {
		return `${this.apiUrl}${photoPath}`;
	}

	viewUser(id: number) {}

	handleSave(user: any) {}

	addUpdateUser(user: staff) {
		this.selectedData = { ...user };
		this.userModal.selectedData = this.selectedData;
		this.userModal.open();
	}

	ActivateUser(userId: number, name: string) {
		// Lógica para eliminar el usuario
		console.log('Habilitar Usuario:', userId, name);
	}

	deleteUser(userId: number, name: string) {
		// Lógica para eliminar el usuario
		console.log('Eliminar Usuario:', userId, name);
	}
}
