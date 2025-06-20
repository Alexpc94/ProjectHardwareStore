import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
	@Input() title = '¿Confirmar acción?';
	@Input() message = '¿Estás seguro de que deseas continuar?';

	@Output() confirm = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();

	@ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

	open(): void {
		this.dialogRef.nativeElement.showModal();
	}

	close(): void {
		this.dialogRef.nativeElement.close();
	}
}
