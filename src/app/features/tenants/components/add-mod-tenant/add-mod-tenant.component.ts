import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { tenant } from '../../models/tenant.model';
import { ActionEvent } from '../../models/actions.model';

import { capitalizeWords } from 'src/app/shared/utils/stringData';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { OpenStreetMapComponent } from 'src/app/shared/components/open-street-map/open-street-map.component';

import { TenantService } from '../../services/tenant.service';

@Component({
	selector: 'app-add-mod-tenant',
	imports: [
		ReactiveFormsModule,
		ValidationComponent,
		ConfirmDialogComponent,
		FileUploadComponent,
		AngularSvgIconModule,
		OpenStreetMapComponent,
	],
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
	showMap: boolean = false;
	submitted: boolean = false;
	selectedData?: tenant;
	selectedID?: number;
	latitude?: number;
	longitude?: number;

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

	closeMap() {
		this.showMap = false;
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
			this.latitude = this.selectedData.ubicacion_gps?.latitude;
			this.longitude = this.selectedData.ubicacion_gps?.longitude;
		}
	}

	onFileSelected(file: File) {
		this.form.get('photo')?.setValue(file);
		this.form.get('photo')?.updateValueAndValidity();
	}

	toggleMap() {
		this.showMap = !this.showMap;
	}

	onLocationChanged(coords: { lat: number; lng: number }) {
		this.latitude = coords.lat;
		this.longitude = coords.lng;
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		const { nombre, ap, am, ...values } = this.form.value;

		const data: tenant = {
			...values,
			nombre: capitalizeWords(nombre),
			ap: capitalizeWords(ap),
			am: capitalizeWords(am),
			latitude: this.latitude,
			longitude: this.longitude,
		};
		//console.log('Form values:', data);
		const formData = new FormData();
		const file = this.form.value.photo;
		formData.append('inquilinos', new Blob([JSON.stringify(data)], { type: 'application/json' }));
		if (file instanceof File) {
			formData.append('file', file);
		} else {
			formData.append('file', new Blob([], { type: 'application/octet-stream' }), '');
		}
		if (this.selectedID) {
			this._getTenantService.modData(formData, this.selectedID).subscribe({
				next: () => {
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
			this._getTenantService.addData(formData).subscribe({
				next: () => {
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
