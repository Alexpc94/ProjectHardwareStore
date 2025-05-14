import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { staff } from './../../../models/staff.model';

@Component({
	selector: '[app-table-row]',
	imports: [FormsModule, AngularSvgIconModule],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	@Input() user: staff = <staff>{};

	ensureHttps(url: string): string {
		return url.startsWith('http') ? url : 'https://' + url;
	}

	onImageError(event: Event) {
		(event.target as HTMLImageElement).src = 'assets/profiles/default profile.png';
	}

	viewUser(user: any) {
		// Lógica para ver todo el usuario
		console.log('Ver Usuario:', user);
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
