import { Component, EventEmitter, inject, ViewChild, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ActionEvent } from '../../../models/Actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';

import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-update-image',
	imports: [ReactiveFormsModule, ValidationComponent, ConfirmDialogComponent, FileUploadComponent],
	templateUrl: './update-image.component.html',
	styleUrl: './update-image.component.css',
})
export class UpdateImageComponent {
	@Output() save = new EventEmitter<ActionEvent>();

	_formBuilder = inject(FormBuilder);
	private _getStaffService = inject(StaffService);
	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	showModal: boolean = false;
	submitted: boolean = false;
	userId!: number;
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}
	open(userID: number) {
		this.userId = userID;
		this.showModal = true;
		this.buildForm();
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			photo: new FormControl('', [
				CustomValidators.onlyImageFilesValidator(),
				CustomValidators.maxFileSizeValidator(1),
			]),
		});
	}

	onFileSelected(file: File) {
		this.form.get('photo')?.setValue(file);
		this.form.get('photo')?.updateValueAndValidity();
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		const formData = new FormData();
		const file = this.form.value.photo;
		if (file instanceof File) {
			//console.log('Archivo presente:', file.name, file.size);
			formData.append('file', file);
		} else {
			formData.append('file', new Blob([], { type: 'application/octet-stream' }), '');
		}
		this._getStaffService.updateImage(formData, this.userId).subscribe({
			next: (response) => {
				//console.log('user updated:', response);
				this.save.emit({ action: 'add', success: true });
				this.close();
			},
			error: () => {
				this.save.emit({ action: 'add', success: false });
			},
		});
	}
}
