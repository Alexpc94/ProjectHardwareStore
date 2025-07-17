import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-confirm-change-status',
	imports: [],
	templateUrl: './confirm-change-status.component.html',
	styleUrl: './confirm-change-status.component.css',
})
export class ConfirmChangeStatusComponent {
	@Input() name?: string;
	@Input() message?: string;
	@Output() confirm = new EventEmitter<void>();

	open = false;

	show() {
		this.open = true;
	}

	close() {
		this.open = false;
	}
}
