import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
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
