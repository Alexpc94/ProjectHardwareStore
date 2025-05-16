import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
@Component({
	selector: 'app-add-mod-staff',
	imports: [],
	templateUrl: './add-mod-staff.component.html',
	styleUrl: './add-mod-staff.component.css',
})
export class AddModStaffComponent {
	@Input() selectedUser: any = { id: null, name: '' };
	@Output() save = new EventEmitter<any>();
	@ViewChild('userDialog') userDialog!: ElementRef<HTMLDialogElement>;
	_formBuilder = inject(FormBuilder);
	form!: FormGroup;

	ngOnInit() {
		this.buildForm();
	}
	buildForm(): void {
		this.form = this._formBuilder.group({
			id: new FormControl(''),
			ciudad_id: new FormControl('', [Validators.required]),
			nombres: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			apellidos: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			dni: new FormControl('', [
				Validators.required,
				Validators.maxLength(15),
				Validators.minLength(4),
				Validators.pattern('^[0-9]*$'),
			]),
			dni_tipo: new FormControl('', [Validators.required]),
			dni_comp: new FormControl(''),
			fecha_nacimiento: new FormControl('', [Validators.required, this.ValidAgeDate()]),
			sexo: new FormControl('SIN DECLARAR'),
			fecha_inicio: new FormControl(''),
			estado: new FormControl(''),
		});
	}

	ValidAgeDate(): ValidatorFn {
		// Función to define if people are 18 years old o more
		return (control: AbstractControl): { [key: string]: any } | null => {
			const startDate = control.value;
			const today = new Date();
			const maxStartDate = new Date();
			maxStartDate.setFullYear(today.getFullYear() - 18);
			if (startDate && startDate > maxStartDate) {
				return { startDateInvalid: true };
			}
			return null;
		};
	}

	open() {
		this.userDialog.nativeElement.showModal();
	}

	close() {
		this.userDialog.nativeElement.close();
	}

	saveUser() {
		this.save.emit(this.selectedUser);
		this.close();
	}
}
