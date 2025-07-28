import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { tenant } from '../../models/tenant.model';
import { ActionEvent } from '../../models/actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

import { TenantService } from '../../services/tenant.service';

@Component({
	selector: 'app-add-mod-tenant',
	imports: [ReactiveFormsModule, ValidationComponent, ConfirmDialogComponent],
	templateUrl: './add-mod-tenant.component.html',
	styleUrl: './add-mod-tenant.component.css',
})
export class AddModTenantComponent implements OnInit {
	private _getTenantService = inject(TenantService);
	_formBuilder = inject(FormBuilder);
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}
	showModal: boolean = false;
	submitted: boolean = false;
	selectedData?: tenant;
	selectedID?: number;

	ngOnInit() {
		this.buildForm();
	}

	open(userID: number | null): void {
		if (userID) {
			this._getTenantService.getTenantById(userID).subscribe((user) => {
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
			nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			ap: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			am: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
			cedula: new FormControl('', [
				Validators.required,
				Validators.maxLength(15),
				Validators.minLength(4),
				Validators.pattern('^[0-9]*$'),
			]),
			direc: new FormControl(''),
			celular: new FormControl('', [Validators.pattern('^[0-9]*$')]),
			photo: new FormControl('', [
				CustomValidators.onlyImageFilesValidator(),
				CustomValidators.maxFileSizeValidator(2),
			]),
		});
	}

	patchForm(): void {
		console.log(this.selectedData);
		if (this.selectedData) {
			this.form.patchValue({
				cedula: this.selectedData.cedula,
				nombre: this.selectedData.nombre,
				ap: this.selectedData.ap,
				am: this.selectedData.am,
				direc: this.selectedData.direc,
				celular: this.selectedData.celular,
			});
		}
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			this.form.get('photo')?.setValue(file);
			this.form.get('photo')?.updateValueAndValidity();
		}
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		console.log('holi');
	}
}
