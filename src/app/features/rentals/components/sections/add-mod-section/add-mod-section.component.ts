import { Component, EventEmitter, Output, ViewChild, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';

import { section } from '../../../models/section.model';
import { sector } from '../../../models/sector.model';
import { ActionEvent } from '../../../models/actions.model';

import { capitalizeWords } from 'src/app/shared/utils/stringData';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: 'app-add-mod-section',
	imports: [ReactiveFormsModule, ConfirmDialogComponent, ValidationComponent],
	templateUrl: './add-mod-section.component.html',
	styleUrl: './add-mod-section.component.css',
})
export class AddModSectionComponent implements OnInit {
	private _getRentalService = inject(RentalService);

	@Output() save = new EventEmitter<ActionEvent>();

	@ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

	_formBuilder = inject(FormBuilder);
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}
	showModal: boolean = false;
	submitted: boolean = false;
	selectedID?: number;
	codsID?: number;
	selectedName?: string;
	sectors: sector[] = [];

	open(userID: number | null, name: string, cods: number | null): void {
		if (userID && cods) {
			this.selectedID = userID;
			this.codsID = cods;
			this.selectedName = name;
			this.patchForm();
		}
		this.showModal = true;
		this.getSectors();
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.showModal = false;
	}

	ngOnInit() {
		this.buildForm();
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			cods: new FormControl('', [Validators.required]),
		});
	}

	patchForm(): void {
		this.form.patchValue({
			nombre: this.selectedName,
			cods: this.codsID,
		});
	}

	getSectors(): void {
		this._getRentalService.getListSectors().subscribe((data) => {
			this.sectors = data.content;
			console.log('Sectors:', this.sectors);
		});
	}

	onPreSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) return;
		this.confirmModal.show();
	}

	saveData(): void {
		const { ...values } = this.form.value;
		const data: section = {
			...values,
			nombre: capitalizeWords(values.nombre),
		};
		console.log('Form values:', data);
		if (this.selectedID) {
			this._getRentalService.modSectionData(data, this.selectedID).subscribe({
				next: () => {
					this.save.emit({ action: 'edit', success: true, data, id: this.selectedID });
					this.close();
				},
				error: () => {
					this.save.emit({ action: 'edit', success: false });
				},
			});
		} else {
			this._getRentalService.addSectionData(data).subscribe({
				next: () => {
					this.save.emit({ action: 'add', success: true, data });
					this.close();
				},
				error: () => {
					this.save.emit({ action: 'add', success: false });
				},
			});
		}
	}
}
