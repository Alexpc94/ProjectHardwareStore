import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ActionEvent } from '../../../models/Actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

import { StaffService } from '../../../services/staff.service';
@Component({
	selector: 'app-credential-staff',
	imports: [ReactiveFormsModule, AngularSvgIconModule, ValidationComponent, ConfirmDialogComponent],
	templateUrl: './credential-staff.component.html',
	styleUrl: './credential-staff.component.css',
})
export class CredentialStaffComponent {
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	private _getStaffService = inject(StaffService);
	_formBuilder = inject(FormBuilder);

	showModal: boolean = false;
	submitted: boolean = false;
	form!: FormGroup;
	selectedID!: number;
	selectedCredential?: string;
	get f() {
		return this.form.controls;
	}

	open(userID: number, userCredential?: string) {
		this.selectedID = userID;
		this.selectedCredential = userCredential;
		this.buildForm();
		this.showModal = true;
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;
	}

	buildForm(): void {
		this.form = this._formBuilder.group(
			{
				usuario: new FormControl(this.selectedCredential ?? '', [
					Validators.required,
					Validators.maxLength(50),
					Validators.minLength(3),
				]),
				password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
				password2: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
			},
			{ validators: this.passwordMatchValidator.bind(this) },
		);
	}

	passwordMatchValidator(formGroup: FormGroup): void {
		const password = formGroup.get('password')?.value;
		const confirmPasswordControl = formGroup.get('password2');
		if (!confirmPasswordControl) return;
		const errors = { ...confirmPasswordControl.errors };
		if (password !== confirmPasswordControl.value) {
			errors['passwordMismatch'] = true;
			confirmPasswordControl.setErrors(errors);
		} else {
			if ('passwordMismatch' in errors) {
				delete errors['passwordMismatch'];
			}
			confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
		}
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		console.log('Saving data...');
	}
}
