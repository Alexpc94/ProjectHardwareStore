import { Component, OnInit, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

import { AuthService } from 'src/app/core/services/auth.service';
@Component({
	selector: 'app-update-password',
	imports: [FormsModule, AngularSvgIconModule, NgIf, ButtonComponent, ReactiveFormsModule, NgClass, AlertsComponent],
	templateUrl: './update-password.component.html',
	styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent implements OnInit {
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

	public userData: any = {};
	private _loginAccessService = inject(AuthService);
	private _formBuilder = inject(FormBuilder);
	onClick() {
		console.log('Button clicked');
	}

	ngOnInit(): void {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
		this.form = this._formBuilder.group({
			user: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
			password2: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
		});
	}

	get f() {
		return this.form.controls;
	}

	toggleVisibility(field: 'passwordTextType' | 'confirmPasswordTextType') {
		this[field] = !this[field];
	}

	onSubmit() {}
}
