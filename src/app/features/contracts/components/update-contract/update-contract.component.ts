import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { contract } from '../../models/contracts.model';
import { ActionEvent } from '../../models/actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { ContractService } from '../../services/contract.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
	selector: 'app-update-contract',
	imports: [
		ReactiveFormsModule,
		SelectDropDownModule,
		ValidationComponent,
		ConfirmDialogComponent,
		AngularSvgIconModule,
		AlertsComponent,
	],
	templateUrl: './update-contract.component.html',
	styleUrl: './update-contract.component.css',
})
export class UpdateContractComponent {
	private _getContractService = inject(ContractService);
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

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(contractID: string): void {
		this._getContractService.getContractById(contractID).subscribe((contract) => {
			this.selectedData = contract.data;
			this.selectedID = contractID;
			this.patchForm();
		});
		this.showModal = true;
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
	}

	ngOnInit() {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
		this.buildForm();
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			monto: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
			obs: new FormControl(''),
		});
	}

	patchForm(): void {
		if (this.selectedData) {
			this.form.patchValue({
				monto: this.selectedData.monto,
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
		const { ...values } = this.form.value;
		const data: contract = {
			...values,
			codresponsable: this.userData.otherParams.id,
		};

		this._getContractService.stopContractrData(this.selectedID!, data).subscribe({
			next: () => {
				this.save.emit({ action: 'edit', success: true, data, id: this.selectedID });
				this.close();
				this.showAlert('success');
			},
			error: (error) => {
				this.save.emit({ action: 'edit', success: false });
				this.showAlert('error');
			},
		});
	}
}
