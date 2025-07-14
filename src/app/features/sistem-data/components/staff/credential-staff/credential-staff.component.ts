import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ActionEvent } from '../../../models/Actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

import { AuthService } from 'src/app/core/services/auth.service';
@Component({
	selector: 'app-credential-staff',
	imports: [ReactiveFormsModule, AngularSvgIconModule, ValidationComponent, ConfirmDialogComponent],
	templateUrl: './credential-staff.component.html',
	styleUrl: './credential-staff.component.css',
})
export class CredentialStaffComponent {
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;
	private _loginAccessService = inject(AuthService);
	_formBuilder = inject(FormBuilder);

	showModal: boolean = false;
	submitted: boolean = false;
	form!: FormGroup;
	selectedID!: number;
	selectedUserCredential: boolean = true;
	selectedNameUserCredential?: string;
	selectedCedula?: string;
	get f() {
		return this.form.controls;
	}

	open(userID: number, userCredential: string, userCedula: string) {
		this.selectedID = userID;
		this.selectedNameUserCredential = userCredential;

		if (!userCredential) {
			this.selectedCedula = userCedula;
			this.selectedUserCredential = false;
		}
		this.buildForm();
		this.showModal = true;
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;
	}

	buildForm(): void {
		const usuarioValidators = !this.selectedUserCredential
			? [Validators.required, Validators.maxLength(50), Validators.minLength(3)]
			: [];
		this.form = this._formBuilder.group(
			{
				usuario: [this.selectedCedula ?? '', usuarioValidators],
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
		console.log('usuario a modificar ', this.selectedNameUserCredential);
		const { usuario, password } = this.form.value;
		const data: any = {
			username: usuario,
			password: password,
			idPerson: this.selectedID,
		};
		const dataToArray: any = { usuario: usuario };
		if (this.selectedUserCredential) {
			//console.log('user updated:');
			this._loginAccessService.UpdatePassword(this.selectedNameUserCredential!, password).subscribe({
				next: () => {
					this.save.emit({ action: 'edit', success: true });
				},
				error: (error) => {
					console.log('Error recibido:', error);
					this.save.emit({ action: 'edit', success: false });
				},
			});
			this.close();
		} else {
			//console.log('user created:');
			this._loginAccessService.addUserData(data).subscribe({
				next: () => {
					this.save.emit({ action: 'edit', success: true, data: dataToArray, id: this.selectedID });
					this.close();
				},
				error: (error) => {
					console.error('Error:', error);
					const mensaje =
						typeof error?.error === 'string'
							? error.error
							: typeof error?.error?.message === 'string'
							? error.error.message
							: '';
					// Validar si el mensaje es de "usuario ya existe"
					if (mensaje.includes('El UserName ya Existe.')) {
						this.form.get('usuario')?.setErrors({ datoExistente: true });
						return;
					}
					this.save.emit({ action: 'edit', success: false });
				},
			});
		}
	}
}
