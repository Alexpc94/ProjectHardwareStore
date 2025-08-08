import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
	selector: 'app-file-upload',
	imports: [AngularSvgIconModule],
	templateUrl: './file-upload.component.html',
	styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
	@Input() emptyMessage: string = 'Haz clic o arrastra tu archivo aquí';
	@Input() emptySubMessage: string = 'Formatos permitidos: PNG, JPG, JPEG - Máx 1MB';

	@Output() fileSelected = new EventEmitter<File>();

	fileName: string = '';
	isDragging = false;

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			this.fileName = file.name;
			this.fileSelected.emit(file);
		} else {
			this.fileName = '';
			input.value = '';
			this.fileSelected.emit();
		}
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragging = true;
	}

	onDragLeave(event: DragEvent) {
		event.preventDefault();
		this.isDragging = false;
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragging = false;

		if (event.dataTransfer?.files.length) {
			const file = event.dataTransfer.files[0];
			this.fileName = file.name;
			this.fileSelected.emit(file);
		}
	}
}
