
import { Component, EventEmitter, Output, ViewChild, inject, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActionEvent } from '../../../models/Actions.model';

import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';


import { roles } from '../../../models/roles.model';
import { RolesService } from '../../../services/roles.service';
@Component({
	selector: 'app-add-mod-rol',
	imports: [ReactiveFormsModule, ValidationComponent, ConfirmDialogComponent],
	providers: [DatePipe],
	templateUrl: './add-mod-rol.component.html',
	styleUrl: './add-mod-rol.component.css',
})

export class AddModRolComponent implements OnInit  {
  @Output() save = new EventEmitter<ActionEvent>();
@Input() roles: roles[] = [];
	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	private _getRoleService = inject(RolesService);
	_formBuilder = inject(FormBuilder);
	_datePipe = inject(DatePipe);
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}
	showModal: boolean = false;
	submitted: boolean = false;
	selectedData?: roles;
	selectedID?: number;
	

	ngOnInit() {
		this.buildForm();
	}

	open(selectedID: number, rolStatus: boolean): void {
		
		if (rolStatus) {
			this._getRoleService.getRoles(rolStatus).subscribe((roles) => {
				this.selectedID = selectedID; // Primero asignas el ID
				this.roles = roles;
				this.selectedData =  this.roles.find(r => r.id_role === this.selectedID);
				console.log(this.selectedData);
				
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
			name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			description: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			
			
		});
	}

	patchForm(): void {
		//console.log(this.selectedData);
		if (this.selectedData) {
			
			this.form.patchValue({
				
				name: this.selectedData.name,
				description: this.selectedData.description,
				
			});
		}
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	capitalizeWords(str: string | undefined | null): string {
		if (!str) return '';
		return str
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	saveData(): void {
		const {name, description } = this.form.value;
		const data: Partial<roles> = {
			id_role: 1, // backend lo genera usualmente
			name: this.capitalizeWords(name),
			description: this.capitalizeWords(description),
			
			
		};
		

		if (this.selectedID) {
			this._getRoleService.updateRole(this.selectedID, data).subscribe({
				next: (response) => {
					//console.log('user updated:', response);
					this.save.emit({ action: 'edit', success: true, data, id : this.selectedID });
					this.close();
				},
				error: (error) => {
					if (this.handleCedulaError(error)) return;
					this.save.emit({ action: 'edit', success: false });
				},
			});
		} else {
				const createData: roles = {
				id_role: 0,
				name: this.capitalizeWords(name),
				description: this.capitalizeWords(description),
				status: true
				};

				this._getRoleService.createRole(createData).subscribe({
					next: (response) => {
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
