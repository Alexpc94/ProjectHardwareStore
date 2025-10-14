import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { contract } from '../../models/contracts.model';
import { tenant } from '../../../tenants/models/tenant.model';
import { freeOwnership } from '../../../rentals/models/ownership.model';
import { BSector } from '../../../business-sectors/models/BSectort.model';
import { ActionEvent } from '../../models/actions.model';

import { capitalizeWords } from 'src/app/shared/utils/stringData';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { ContractService } from '../../services/contract.service';
import { TenantService } from '../../../tenants/services/tenant.service';
import { RentalService } from '../../../rentals/services/rentals.service';
import { BusinessSectorsService } from '../../../business-sectors/services/businessSectors.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
	selector: 'app-add-mod-contract',
	imports: [
		ReactiveFormsModule,
		SelectDropDownModule,
		ValidationComponent,
		ConfirmDialogComponent,
		AngularSvgIconModule,
		AlertsComponent,
	],
	templateUrl: './add-mod-contract.component.html',
	styleUrl: './add-mod-contract.component.css',
})
export class AddModContractComponent implements OnInit {
	private _getContractService = inject(ContractService);
	private _getTenantService = inject(TenantService);
	private _getRentalService = inject(RentalService);
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

	showModal: boolean = false;
	submitted: boolean = false;
	selectedData?: contract;
	selectedID?: string;
	activeInput: string = '';

	tenants: tenant[] = [];
	filteredTenants: tenant[] = [];

	ownerships: freeOwnership[] = [];
	filteredOwnerships: freeOwnership[] = [];

	bSector: BSector[] = [];
	filteredBsector: BSector[] = [];

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(contractID: string): void {
		if (contractID) {
			this._getContractService.getContractById(contractID).subscribe((contract) => {
				this.selectedData = contract.data;
				this.selectedID = contractID;
				this.patchForm();
			});
		}
		this.showModal = true;
	}

	toggleInput(type: string) {
		this.activeInput = this.activeInput === type ? '' : type;
		this.filteredTenants = [...this.tenants];
		this.filteredOwnerships = [...this.ownerships];
	}

	close() {
		this.form.reset();
		this.form.patchValue({
			fecha: this.userData.otherParams.fecha,
		});
		this.submitted = false;
		this.showModal = false;
		this.selectedID = undefined;
		this.selectedData = undefined;
		this.activeInput = '';
	}

	ngOnInit() {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
		//console.log('user data', this.userData);
		this.buildForm();
		this.getTenants();
		this.getFreeOwnerships();
		this.getBusinessSectorFiltered();
	}

	getTenants(): void {
		this._getTenantService.getAllTenants().subscribe((data) => {
			this.tenants = data.data;
			this.filteredTenants = [...this.tenants];
			//console.log('inquilinos', this.tenants);
		});
	}

	getFreeOwnerships(): void {
		this._getRentalService.getFreeOwnership().subscribe((data) => {
			this.ownerships = data.data;
			this.filteredOwnerships = [...this.ownerships];
			//console.log('predios libres', this.ownerships);
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
		this.filteredTenants = this.filterArray(this.tenants, term, ['cedula', 'ap', 'am', 'nombre']);
	}

	filterOwnerships(term: string | undefined): void {
		this.filteredOwnerships = this.filterArray(this.ownerships, term, ['codpre', 'nompredio', 'nomseccion']);
	}

	filterBsector(term: string | undefined): void {
		this.filteredBsector = this.filterArray(this.bSector, term, ['codc', 'nombre']);
	}

	private filterArray<T>(source: T[], term: string | undefined, keys: (keyof T)[]): T[] {
		const search = term?.toLowerCase() ?? '';
		if (!search) return [...source];
		return source.filter((item) =>
			keys.some((key) => {
				const value = item[key];
				return typeof value === 'string' && value.toLowerCase().includes(search);
			}),
		);
	}

	get dcontratos(): FormArray {
		return this.form.get('dcontratos') as FormArray;
	}

	addDetail(): void {
		const detalleGroup = this._formBuilder.group({
			codc: new FormControl('', [Validators.required]),
			codpre: new FormControl('', [Validators.required]),
			importe: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
		});
		this.dcontratos.push(detalleGroup);
	}

	removeDetail(index: number): void {
		this.dcontratos.removeAt(index);
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			codcon: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			fechaini: new FormControl('', [Validators.required]),
			fechafin: new FormControl(''),
			fecha: new FormControl(this.userData.otherParams.fecha),
			inquilino: new FormControl('', [Validators.required]),
			obs: new FormControl(''),
			indefinido: new FormControl(''),
			dcontratos: this._formBuilder.array([]),
		});
	}

	patchForm(): void {
		//console.log(this.selectedData);
		if (this.selectedData) {
			this.form.patchValue({
				codcon: this.selectedData.codcon,
				inquilino: this.selectedData.inquilino,
				fechaini: this.selectedData.fechaini,
				fechafin: this.selectedData.fechafin,
				fecha: this.selectedData.fecha,
				obs: this.selectedData.obs,
			});
		}
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		const { inquilino, ...values } = this.form.value;
		const data: contract = {
			...values,
			codcliente: inquilino,
			codresponsable: this.userData.otherParams.id,
			fecha: this.userData.otherParams.fecha,
			indefinido: values.indefinido ? 1 : 0,
		};

		this._getContractService.addContractrData(data).subscribe({
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
}
