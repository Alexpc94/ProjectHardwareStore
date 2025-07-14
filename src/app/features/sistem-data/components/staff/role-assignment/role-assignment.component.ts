import { Component } from '@angular/core';

@Component({
	selector: 'app-role-assignment',
	imports: [],
	templateUrl: './role-assignment.component.html',
	styleUrl: './role-assignment.component.css',
})
export class RoleAssignmentComponent {
	showModal: boolean = false;
	open(userID: number) {
		console.log('Role assignment modal opened for user ID:', userID);
		this.showModal = true;
	}

	close() {
		this.showModal = false;
	}
}
