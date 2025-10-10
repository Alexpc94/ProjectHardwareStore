import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { contract } from '../../models/contracts.model';
import { tenant } from '../../../tenants/models/tenant.model';
import { ActionEvent } from '../../models/actions.model';

import { capitalizeWords } from 'src/app/shared/utils/stringData';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { ContractService } from '../../services/contract.service';
import { TenantService } from '../../../tenants/services/tenant.service';

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
	tenants: tenant[] = [];
	filteredTenants: tenant[] = [];
	showInput = false;

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

	toggleInput() {
		this.showInput = !this.showInput;
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;
		this.selectedID = undefined;
		this.selectedData = undefined;
		this.showInput = false;
	}

	ngOnInit() {
		this.buildForm();
		this.getTenants();
	}

	getTenants(): void {
		this._getTenantService.getAllTenants().subscribe((data) => {
			this.tenants = data.data;
			this.filteredTenants = [...this.tenants];
			console.log('inquilinos', this.tenants);
		});
	}

	filterTenants(term: string | undefined) {
		const search = term?.toLowerCase() ?? '';
		if (!search) {
			this.filteredTenants = [...this.tenants];
		} else {
			this.filteredTenants = this.tenants.filter(
				(t) =>
					t.cedula.toLowerCase().includes(search) ||
					t.ap.toLowerCase().includes(search) ||
					t.am.toLowerCase().includes(search) ||
					t.nombre.toLowerCase().includes(search),
			);
		}
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			codcon: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			fechaini: new FormControl('', [Validators.required]),
			fechafin: new FormControl(''),
			fecha: new FormControl('', [Validators.required]),
			inquilino: new FormControl('', [Validators.required]),
			obs: new FormControl(''),
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
		};

		console.log('shego esto', data);
	}
}
