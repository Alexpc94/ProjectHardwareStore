import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

import { AuthService } from 'src/app/core/services/auth.service';

import { Data } from 'src/app/core/models/data.interface';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css'],
	imports: [FormsModule, ReactiveFormsModule, AngularSvgIconModule, NgIf, ButtonComponent, NgClass],
	providers: [AuthService],
})
export class SignInComponent implements OnInit {
	form!: FormGroup;
	submitted = false;
	passwordTextType!: boolean;

	private _loginAccessService = inject(AuthService);
	private _router = inject(Router);
	constructor(private readonly _formBuilder: FormBuilder) {}

	onClick() {
		console.log('Button clicked');
	}

	ngOnInit(): void {
		this.form = this._formBuilder.group({
			email: ['', [Validators.required]],
			password: ['', Validators.required],
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
		const { email, password } = this.form.value;

		if (this.form.invalid) {
			return;
		}
		console.log('Formulario válido:', this.form.value);
		let xloging: any = 'alex';
		let xpassword: any = 123;
		this._loginAccessService.getToken(xloging, xpassword).subscribe({
			next: (data: Data) => {
				if (data) {
					this._loginAccessService.setCurrentSession('currentUser', JSON.stringify(data));
					this._router.navigate(['/']);
				} else {
					console.log('Fail');
				}
			},
			error: (error: any) => {
				if (error.error && error.error.errors) {
					// console.error('error detail:', error.error.errors);
				}
			},
		});
	}
}
