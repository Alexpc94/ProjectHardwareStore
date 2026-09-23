import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxFlatpickrWrapperComponent } from 'ngx-flatpickr-wrapper';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { retailContainer, reatailContainerDetail } from '../../../models/retailContainer.model';
import { BSector } from '../../../../business-sectors/models/BSectort.model';
import { tenant } from '../../../../tenants/models/tenant.model';
import { ActionEvent } from '../../../models/actions.model';

import { retailContainerService } from '../../../services/retailContainer.service';
import { BusinessSectorsService } from '../../../../business-sectors/services/businessSectors.service';
import { TenantService } from '../../../../tenants/services/tenant.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
	selector: 'app-add-mod-rcontainer-contract',
	imports: [
		ReactiveFormsModule,
		SelectDropDownModule,
		//NgxFlatpickrWrapperComponent,
		ValidationComponent,
		ConfirmDialogComponent,
		AngularSvgIconModule,
		AlertsComponent,
	],
	templateUrl: './add-mod-rcontainer-contract.component.html',
	styleUrl: './add-mod-rcontainer-contract.component.css',
})
export class AddModRContainerContractComponent {
	private _getRetailContainerService = inject(retailContainerService);
	private _getTenantService = inject(TenantService);
	private _getBusinessSectorService = inject(BusinessSectorsService);
	public userData: any = {};
	_loginAccessService = inject(AuthService);
	_formBuilder = inject(FormBuilder);
	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}

	isEditing: boolean = false;
	selectedRCData?: retailContainer;
	showModal: boolean = false;
	activeInput: string = '';
	submitted: boolean = false;

	tenants: tenant[] = [];
	filteredTenants: tenant[] = [];

	bSector: BSector[] = [];
	filteredBsector: BSector[] = [];
	searchTerms: string[] = [];

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	configDate = {
		dateFormat: 'd/m/Y',
		locale: Spanish,
		allowInput: true,
	};

	open(selectedID: string): void {
		this.isEditing = !!selectedID;
		if (selectedID) {
			this._getRetailContainerService.getRContainersById(selectedID).subscribe((data) => {
				this.selectedRCData = data.data;
				console.log(this.selectedRCData);
				this.patchForm();
			});
		}
		this.showModal = true;
	}
	close() {
		this.form.reset();
		this.form.patchValue({
			fecha: this.userData.otherParams.fecha,
		});
		this.dacoplados.clear();
		this.submitted = false;
		this.showModal = false;
		this.activeInput = '';
		this.filteredTenants = [...this.tenants];
		//this.filteredOwnerships = [...this.ownerships];
		this.filteredBsector = [...this.bSector];
		this.searchTerms = [];
	}

	toggleInput(type: string) {
		const isClosing = this.activeInput === type;

		this.activeInput = isClosing ? '' : type;

		if (isClosing && type.startsWith('codc-')) {
			const index = Number(type.split('-')[1]);
			this.searchTerms[index] = '';
		}
		this.filteredTenants = [...this.tenants];
		// this.filteredOwnerships = [...this.ownerships];
		this.filteredBsector = [...this.bSector];
	}

	ngOnInit() {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
		//console.log('user data', this.userData);
		this.buildForm();
		this.getTenants();
		// this.getFreeOwnerships();
		this.getBusinessSectorFiltered();
	}

	getTenants(): void {
		this._getTenantService.getAllTenants().subscribe((data) => {
			this.tenants = data.data;
			this.filteredTenants = [...this.tenants];
			//console.log('inquilinos', this.tenants);
		});
	}

	getBusinessSectorFiltered(): void {
		this._getBusinessSectorService.getBusinessSectorSonFiltered().subscribe((data) => {
			this.bSector = data.data;
			this.filteredBsector = [...this.bSector];
			//console.log('Rubros', this.bSector);
		});
	}

	filterTenants(term: string | undefined): void {
		this.filteredTenants = this.filterArray(this.tenants, term, ['cedula', 'ap', 'am', 'nombre'], 'inquilino');
	}

	filterBsector(term: string | undefined): void {
		this.filteredBsector = this.filterArray(this.bSector, term, ['codc', 'nombre'], 'codc');
	}

	filterListBsectors(term: string | undefined): BSector[] {
		const search = term?.toLowerCase() ?? '';
		if (!search) return [...this.bSector];
		return this.bSector.filter((item) =>
			['codc', 'nombre'].some((key) => {
				const value = item[key as keyof BSector];
				return typeof value === 'string' && value.toLowerCase().includes(search);
			}),
		);
	}

	private filterArray<T>(source: T[], term: string | undefined, keys: (keyof T)[], controlName: string): T[] {
		const search = term?.toLowerCase() ?? '';
		let filtered = source;

		if (search) {
			filtered = source.filter((item) =>
				keys.some((key) => {
					const value = item[key];
					return typeof value === 'string' && value.toLowerCase().includes(search);
				}),
			);
		}

		const control = this.form.get(controlName);
		if (control) {
			const currentValue = control.value;
			const stillExists = filtered.some((item: any) => item.id === currentValue);
			if (!stillExists) control.setValue('');
		}

		return filtered;
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			gestion: new FormControl('', [Validators.required]),
			fecha: new FormControl(this.userData.otherParams.fecha),
			obs: new FormControl(''),
			inquilino: new FormControl('', [Validators.required]), //codcliente
			dacoplados: this._formBuilder.array([]),
		});
	}

	get dacoplados(): FormArray {
		return this.form.get('dacoplados') as FormArray;
	}

	addDetail(): void {
		const detalleGroup = this._formBuilder.group({
			codc: new FormControl('', [Validators.required]),
			importe: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
		});
		this.dacoplados.push(detalleGroup);
	}

	removeDetail(index: number): void {
		this.dacoplados.removeAt(index);
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		const { inquilino, ...values } = this.form.value;

		const data: retailContainer = {
			...values,
			codcliente: inquilino,
			codresponsable: this.userData.otherParams.id,
			fecha: this.userData.otherParams.fecha,
			dacoplados:
				values.dacoplados?.map((item: any) => ({
					...item,
				})) || [],
		};
		this._getRetailContainerService.addRContainerData(data).subscribe({
			next: () => {
				this.save.emit({ action: 'add', success: true, data });
				this.close();
				this.showAlert('success');
			},
			error: (error) => {
				// if (this.handleNombreError(error)) return;
				// if (this.handleCodpreError(error)) return;
				this.save.emit({ action: 'add', success: false });
				this.showAlert('error');
			},
		});
		console.log('shego esto', data);
	}

	patchForm(): void {}
}
