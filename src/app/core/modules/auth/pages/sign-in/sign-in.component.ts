import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';

import { AuthService } from 'src/app/core/services/auth.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		AngularSvgIconModule,
		ButtonComponent,
		NgClass,
		NgIf,
		AlertsComponent,
		ValidationComponent,
	],
	providers: [AuthService],
})
export class SignInComponent implements OnInit {
	private _loginAccessService = inject(AuthService);
	private _router = inject(Router);
	private _formBuilder = inject(FormBuilder);

	form!: FormGroup;
	submitted = false;
	isLoading = false;
	passwordTextType!: boolean;
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
		this.form = this._formBuilder.group({
			user: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
		});
	}

	get f() {
		return this.form.controls;
	}

	togglePasswordTextType() {
		this.passwordTextType = !this.passwordTextType;
	}

	onSubmit() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const { user, password } = this.form.value;
		this.isLoading = true;
		this._loginAccessService.getToken(user, password).subscribe({
			next: (data: any) => {
				console.log('Respuesta del servicio:', data);
				this.isLoading = false;
				if (data.otherParams) {
					this._loginAccessService.setCurrentSession('currentUser', data);
					this._router.navigate(['/']);
				} else {
					this.showAlert('login-error');
				}
			},
			error: (error: any) => {
				this.isLoading = false;
				if (error.error && error.error.errors) {
					console.error('error detail:', error.error.errors);
				}
			},
		});
	}
}
