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
	@Output() saveSon = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	_formBuilder = inject(FormBuilder);
	form!: FormGroup;
	selectedData?: BSector;
	isEditing: boolean = false;
	isFather: boolean = false;

	get f() {
		return this.form.controls;
	}

	bsectorList: BSector[] = [];
	showModal: boolean = false;
	submitted: boolean = false;
	codpadreID?: string;

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info' | 'dependency-data-error') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(codcID: string, codpadre: string): void {
		this.isEditing = !!codcID;
		this.isFather = !!codpadre;
		if (codcID) {
			this._getBusinessSectorsService.getBusinessSectorById(codcID).subscribe((data) => {
				this.selectedData = data.data;
				this.patchForm();
			});
		}
		this.codpadreID = codpadre;
		this.form.get('padre')?.setValue(this.codpadreID);
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
		this.getFirstLevelData();
	}

	getFirstLevelData(): void {
		this._getBusinessSectorsService.getListBsectors().subscribe((data) => {
			this.bsectorList = data;
		});
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			codc: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]),
			nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			padre: new FormControl(''),
			estado: new FormControl(1),
		});
	}

	patchForm(): void {
		if (this.selectedData) {
			this.form.patchValue({
				codc: this.selectedData.codc,
				nombre: this.selectedData.nombre,
				padre: this.selectedData.padre,
				estado: this.selectedData.estado,
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
		const data: BSector = {
			...values,
			codc: this.isEditing ? this.selectedData?.codc : values.codc,
			nombre: capitalizeWords(values.nombre),
			padre: values.padre || '',
		};
		if (this.isEditing) {
			this._getBusinessSectorsService.modBsectorData(data, this.selectedData?.codc).subscribe({
				next: () => {
					(!this.isFather ? this.save : this.saveSon).emit({
						action: 'edit',
						success: true,
						data,
						id: this.selectedData?.codc,
					});
					this.close();
					this.showAlert('success');
				},
				error: (err) => {
					if (err?.error?.message?.includes('El Nombre del Rubro ya Existe.')) {
						this.showAlert('dependency-data-error');
						this.form.get('nombre')?.setErrors({ datoExistente: true });
						return;
					}
					this.save.emit({ action: 'edit', success: false });
					this.showAlert('error');
				},
			});
		} else {
			this._getBusinessSectorsService.addBsectorData(data).subscribe({
				next: () => {
					(!this.isFather ? this.save : this.saveSon).emit({
						action: 'add',
						success: true,
						data,
					});
					this.close();
					this.showAlert('success');
				},
				error: (err) => {
					if (err?.error?.message?.includes('El Código Rubro ya Existe.')) {
						this.showAlert('dependency-data-error');
						this.form.get('codc')?.setErrors({ datoExistente: true });
						return;
					}
					if (err?.error?.message?.includes('El Nombre del Rubro ya Existe.')) {
						this.showAlert('dependency-data-error');
						this.form.get('nombre')?.setErrors({ datoExistente: true });
						return;
					}
					this.save.emit({ action: 'add', success: false });
					this.showAlert('error');
				},
			});
		}
	}
}
