import { Component, OnInit, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-update-password',
	imports: [FormsModule, AngularSvgIconModule, NgIf, ButtonComponent, ReactiveFormsModule, NgClass, AlertsComponent],
	templateUrl: './update-password.component.html',
	styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent implements OnInit {
	private _loginAccessService = inject(AuthService);
	private _formBuilder = inject(FormBuilder);
	private _router = inject(Router);
	public userData: any = {};

	form!: FormGroup;
	submitted = false;
	passwordTextType!: boolean;
	confirmPasswordTextType: boolean = false;
	alertType: '' | 'success' | 'error' | 'login-error' | 'info' = '';

	showAlert(type: 'success' | 'error' | 'login-error' | 'info') {
		this.alertType = ''; // Reiniciar para forzar cambio
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	onClick() {
		console.log('Button clicked');
	}

	ngOnInit(): void {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
		this.form = this._formBuilder.group(
			{
				password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
				password2: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
			},
			{ validators: this.passwordMatchValidator.bind(this) },
		);
	}

	get f() {
		return this.form.controls;
	}

	toggleVisibility(field: 'passwordTextType' | 'confirmPasswordTextType') {
		this[field] = !this[field];
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

	onSubmit() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const user = this.userData.otherParams.username;
		const { password2 } = this.form.value;
		this._loginAccessService.UpdatePassword(user, password2).subscribe({
			next: () => {
				this.showAlert('success');
				setTimeout(() => {
					this._loginAccessService.deleteCurrentSession('currentUser');
					this._router.navigate(['/auth/sign-in']);
				}, 2000);
			},
			error: (error) => {
				console.log('Error recibido:', error);
				if (error.error) {
					console.error('Detalles del error:', error.error);
				}
				this.showAlert('error');
			},
		});
	}
}
