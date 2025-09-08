import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { BSector } from '../../models/BSectort.model';
import { ActionEvent } from '../../models/actions.model';

import { capitalizeWords } from 'src/app/shared/utils/stringData';

import { BusinessSectorsService } from '../../services/businessSectors.service';

@Component({
	selector: 'app-add-mod-business-sector',
	imports: [ReactiveFormsModule, ConfirmDialogComponent, ValidationComponent, AlertsComponent],
	templateUrl: './add-mod-business-sector.component.html',
	styleUrl: './add-mod-business-sector.component.css',
})
export class AddModBusinessSectorComponent {
	private _getBusinessSectorsService = inject(BusinessSectorsService);

	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	_formBuilder = inject(FormBuilder);
	form!: FormGroup;
	selectedData?: BSector;
	isEditing: boolean = false;

	get f() {
		return this.form.controls;
	}
	showModal: boolean = false;
	submitted: boolean = false;
	codpadreID?: string;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(codcID: string, codpadre: string): void {
		if (codcID) {
			this._getBusinessSectorsService.getBusinessSectorById(codcID).subscribe((data) => {
				this.selectedData = data.data;
				this.patchForm();
			});
		}
		this.codpadreID = codpadre;
		//this.form.get('codsec')?.setValue(this.codsecID);
		this.showModal = true;
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;

		this.selectedData = undefined;
		this.codpadreID = '';
	}

	ngOnInit() {
		this.buildForm();
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			codc: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]),
			nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			padre: new FormControl(''),
		});
	}

	patchForm(): void {
		console.log(this.selectedData);
		if (this.selectedData) {
			this.form.patchValue({
				codc: this.selectedData.codc,
				nombre: this.selectedData.nombre,
				padre: this.selectedData.padre,
			});
		}
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {}
}
