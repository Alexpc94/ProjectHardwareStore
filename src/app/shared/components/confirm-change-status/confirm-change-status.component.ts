import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-confirm-change-status',
	imports: [],
	templateUrl: './confirm-change-status.component.html',
	styleUrl: './confirm-change-status.component.css',
})
export class ConfirmChangeStatusComponent {
	@Input() open = false;
	@Input() name = '';
	@Input() status = false;

	@Output() cancel = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	get actionLabel(): string {
		return this.status ? 'dar de baja' : 'habilitar';
	}
}
