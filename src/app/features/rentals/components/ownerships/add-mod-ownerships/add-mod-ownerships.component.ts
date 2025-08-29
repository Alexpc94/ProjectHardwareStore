import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { section } from '../../../models/section.model';
import { ownership } from '../../../models/ownership.model';
import { ActionEvent } from '../../../models/actions.model';

import { capitalizeWords } from 'src/app/shared/utils/stringData';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: 'app-add-mod-ownerships',
	imports: [ReactiveFormsModule, ConfirmDialogComponent, ValidationComponent, AlertsComponent],
	templateUrl: './add-mod-ownerships.component.html',
	styleUrl: './add-mod-ownerships.component.css',
})
export class AddModOwnershipsComponent implements OnInit {
	private _getRentalService = inject(RentalService);

	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	_formBuilder = inject(FormBuilder);
	form!: FormGroup;
	selectedOsData?: ownership;
	isEditing: boolean = false;
	codsecID?: number;
	sections: section[] = [];
	get f() {
		return this.form.controls;
	}
	showModal: boolean = false;
	submitted: boolean = false;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(codpreID: string, codsec: number): void {
		this.isEditing = !!codpreID;
		if (codpreID) {
			this._getRentalService.getOwnershipById(codpreID).subscribe((data) => {
				this.selectedOsData = data.data;
				this.patchForm();
			});
		}
		this.codsecID = codsec;
		this.form.get('codsec')?.setValue(this.codsecID);
		this.showModal = true;
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;

		this.codsecID = undefined;
		this.selectedOsData = undefined;
	}

	ngOnInit() {
		this.buildForm();
		this.getSections();
	}

	getSections(): void {
		this._getRentalService.getListSections().subscribe((data) => {
			this.sections = data.content;
		});
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			codpre: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]),
			nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			codsec: new FormControl('', [Validators.required]),
			libre: new FormControl('', [Validators.required]),
		});
	}

	patchForm(): void {
		console.log(this.selectedOsData);
		if (this.selectedOsData) {
			this.form.patchValue({
				codpre: this.selectedOsData.codpre,
				nombre: this.selectedOsData.nombre,
				codsec: this.selectedOsData.codsec,
				libre: this.selectedOsData.libre,
			});
		}
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		const { ...values } = this.form.value;
		const data: ownership = {
			...values,
			codpre: this.isEditing ? this.selectedOsData?.codpre : values.codpre,
			nombre: capitalizeWords(values.nombre),
		};
		if (this.isEditing) {
			this._getRentalService.modOwnershipData(data, this.selectedOsData?.codpre).subscribe({
				next: () => {
					this.save.emit({ action: 'edit', success: true, data, id: this.selectedOsData?.codpre });
					this.close();
					this.showAlert('success');
				},
				error: (error) => {
					if (this.handleNombreError(error)) return;
					this.save.emit({ action: 'edit', success: false });
					this.showAlert('error');
				},
			});
		} else {
			this._getRentalService.addOwnershipData(data).subscribe({
				next: () => {
					this.save.emit({ action: 'add', success: true, data });
					this.close();
					this.showAlert('success');
				},
				error: (error) => {
					if (this.handleNombreError(error)) return;
					if (this.handleCodpreError(error)) return;
					this.save.emit({ action: 'add', success: false });
					this.showAlert('error');
				},
			});
		}
	}

	private handleNombreError(error: any): boolean {
		const mensaje =
			typeof error?.error === 'string'
				? error.error
				: typeof error?.error?.message === 'string'
				? error.error.message
				: '';
		if (mensaje.includes('El Predio ya Existe.')) {
			this.form.get('nombre')?.setErrors({ datoExistente: true });
			return true;
		}
		return false;
	}

	private handleCodpreError(error: any): boolean {
		const mensaje =
			typeof error?.error === 'string'
				? error.error
				: typeof error?.error?.message === 'string'
				? error.error.message
				: '';
		if (mensaje.includes('Error al Guardar los Datos')) {
			this.form.get('codpre')?.setErrors({ datoExistente: true });
			return true;
		}
		return false;
	}
}
