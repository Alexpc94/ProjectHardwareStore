import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import {
	AbstractControl,
	ReactiveFormsModule,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { staff } from '../../../models/staff.model';
import { ActionEvent } from '../../../models/Actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-add-mod-staff',
	imports: [ReactiveFormsModule, ValidationComponent, ConfirmDialogComponent],
	providers: [DatePipe],
	templateUrl: './add-mod-staff.component.html',
	styleUrl: './add-mod-staff.component.css',
})
export class AddModStaffComponent implements OnInit {
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	private _getStaffService = inject(StaffService);
	_formBuilder = inject(FormBuilder);
	_datePipe = inject(DatePipe);
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}
	showModal: boolean = false;
	submitted: boolean = false;
	selectedData?: staff;
	selectedID?: number;
	ngOnInit() {
		this.buildForm();
	}

	open(userID: number) {
		if (userID != null) {
			this._getStaffService.getUserById(userID).subscribe((user) => {
				this.selectedData = user.data;
				this.selectedID = userID;
				this.patchForm();
			});
		}
		this.showModal = true;
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			firstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			secondName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
			cedula: new FormControl('', [
				Validators.required,
				Validators.maxLength(15),
				Validators.minLength(4),
				Validators.pattern('^[0-9]*$'),
			]),
			datebirth: new FormControl('', [Validators.required, this.ValidAgeDate()]),
			gender: new FormControl('', [Validators.required]),
			telephone: new FormControl('', [Validators.pattern('^[0-9]*$')]),
			email: new FormControl('', [Validators.email]),
			photo: new FormControl('', [this.onlyImageFilesValidator(), this.maxFileSizeValidator(3)]),
		});
	}

	patchForm(): void {
		//console.log(this.selectedData);
		if (this.selectedData) {
			const birthDate = this.selectedData?.dateBirth
				? this._datePipe.transform(new Date(this.selectedData.dateBirth), 'yyyy-MM-dd', 'UTC')
				: null;
			const formattedBirdthDate = this._datePipe.transform(birthDate, 'yyyy-MM-dd', 'UTC');
			this.form.patchValue({
				cedula: this.selectedData.cedula,
				name: this.selectedData.name,
				firstName: this.selectedData.firstName,
				secondName: this.selectedData.secondName,
				gender: this.selectedData.gender,
				email: this.selectedData.email,
				telephone: this.selectedData.telephone,
				datebirth: formattedBirdthDate,
			});
		}
	}

	ValidAgeDate(): ValidatorFn {
		// Function to define if people are 18 years old o more
		return (control: AbstractControl): { [key: string]: any } | null => {
			const startDate = new Date(control.value);
			const today = new Date();
			const maxStartDate = new Date();
			maxStartDate.setFullYear(today.getFullYear() - 18);
			if (startDate && startDate > maxStartDate) {
				return { ValidAgeDate: true };
			}
			return null;
		};
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			this.form.get('photo')?.setValue(file);
			this.form.get('photo')?.updateValueAndValidity();
		}
	}

	maxFileSizeValidator(maxSizeMB: number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const file = control.value;
			if (!file) return null;
			if (!(file instanceof File)) return { maxSizeExceeded: { actualSize: 0, maxSize: maxSizeMB } };
			const maxSizeBytes = maxSizeMB * 1024 * 1024;
			if (file.size > maxSizeBytes) {
				return {
					maxSizeExceeded: { maxSize: maxSizeMB },
				};
			}
			return null;
		};
	}

	onlyImageFilesValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const file = control.value;
			if (!file) return null; // dont validate if no file selected
			if (!(file instanceof File)) return { invalidType: true };
			if (!file.type.startsWith('image/')) {
				return { invalidType: true };
			}
			return null;
		};
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	capitalizeWords(str: string | undefined | null): string {
		if (!str) return '';
		return str
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	saveData(): void {
		const { datebirth, photo, name, firstName, secondName, ...values } = this.form.value;
		const data: staff = {
			...values,
			name: this.capitalizeWords(name),
			firstName: this.capitalizeWords(firstName),
			secondName: this.capitalizeWords(secondName),
			dateBirth: datebirth,
		};
		const formData = new FormData();
		const file = this.form.value.photo;
		formData.append('person', new Blob([JSON.stringify(data)], { type: 'application/json' }));
		if (file instanceof File) {
			formData.append('file', file);
		} else {
			formData.append('file', new Blob([], { type: 'application/octet-stream' }), '');
		}
		// for (const [key, value] of (formData as any).entries()) {
		// 	if (value instanceof File) {
		// 		console.log(`${key}: [File] ${value.name}`);
		// 	} else {
		// 		console.log(`${key}:`, value);
		// 	}
		// }
		if (this.selectedID) {
			this._getStaffService.modData(formData, this.selectedID).subscribe({
				next: (response) => {
					//console.log('user updated:', response);
					this.save.emit({ action: 'edit', success: true, data, id: this.selectedID });
					this.close();
				},
				error: (error) => {
					if (this.handleCedulaError(error)) return;
					this.save.emit({ action: 'edit', success: false });
				},
			});
		} else {
			this._getStaffService.addData(formData).subscribe({
				next: (response) => {
					//console.log('User added:', response);
					this.save.emit({ action: 'add', success: true, data });
					this.close();
				},
				error: (error) => {
					if (this.handleCedulaError(error)) return;
					this.save.emit({ action: 'add', success: false });
				},
			});
		}
	}

	private handleCedulaError(error: any): boolean {
		const mensaje =
			typeof error?.error === 'string'
				? error.error
				: typeof error?.error?.message === 'string'
				? error.error.message
				: '';
		if (mensaje.includes('La Cédula ya Existe.')) {
			this.form.get('cedula')?.setErrors({ datoExistente: true });
			return true;
		}
		return false;
	}
}
