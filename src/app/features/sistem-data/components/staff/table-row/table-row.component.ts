import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AddModStaffComponent } from '../add-mod-staff/add-mod-staff.component';

import { staff } from './../../../models/staff.model';

@Component({
	selector: '[app-table-row]',
	imports: [FormsModule, AngularSvgIconModule, AddModStaffComponent],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	@Input() user: staff = <staff>{};
	selectedUser: any = null;
	@ViewChild(AddModStaffComponent) userModal!: AddModStaffComponent;

	ensureHttps(url: string): string {
		return url.startsWith('http') ? url : 'https://' + url;
	}

	onImageError(event: Event) {
		(event.target as HTMLImageElement).src = 'assets/profiles/default profile.png';
	}

	viewUser(user: any) {
		this.selectedUser = { ...user }; // evita mutaciones
		this.userModal.selectedUser = this.selectedUser;
		this.userModal.open();
	}

	handleSave(user: any) {
		console.log('Usuario guardado desde listado:', user);
		// Aquí podrías hacer lógica de actualizar o crear
	}

	editUser(id: number) {
		console.log('Editar usuario con id:', id);
		// Lógica para editar al usuario
	}

	ActivateUser(userId: number, name: string) {
		// Lógica para eliminar el usuario
		console.log('Eliminar Usuario:', userId, name);
	}

	deleteUser(userId: number, name: string) {
		// Lógica para eliminar el usuario
		console.log('Eliminar Usuario:', userId, name);
	}
}
